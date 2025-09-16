import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { database as db } from '@repo/database';
import { getFlightRecommendations } from '@/services/amadeus';
import { sendBatchDealAlert } from '@/services/deal-email';
import { stripe } from '@repo/payments';

export async function POST(request: NextRequest) {
  console.log('=== REFRESH RECOMMENDATIONS API CALLED ===');
  try {
    const { userId } = await auth();
    console.log('User ID from auth:', userId);
    
    if (!userId) {
      console.log('No user ID, returning unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user and their travel preferences
    console.log('Looking up user in database...');
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        travelPreferences: true,
        stripeSubscription: true,
      },
    });

    console.log('User found:', { id: user?.id, email: user?.email, hasPreferences: !!user?.travelPreferences, subscriptionTier: user?.subscriptionTier });

    if (!user) {
      console.log('User not found in database');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has an active Stripe subscription
    let hasValidSubscription = false;
    let subscriptionTier = 'FREE';

    if (user.stripeSubscription?.stripeSubscriptionId) {
      try {
        // Get subscription directly from Stripe
        const stripeSub = await stripe.subscriptions.retrieve(user.stripeSubscription.stripeSubscriptionId);
        
        // Check if subscription is active or trialing
        if (stripeSub.status === 'active' || stripeSub.status === 'trialing') {
          hasValidSubscription = true;
          
          // Determine tier based on price lookup key
          const priceId = stripeSub.items.data[0]?.price.id;
          if (priceId) {
            try {
              const price = await stripe.prices.retrieve(priceId);
              if (price.lookup_key === 'member_plan') {
                subscriptionTier = 'MEMBER';
              } else {
                subscriptionTier = 'PRO'; // Default for other paid plans
              }
            } catch (error) {
              console.error('Error retrieving price details:', error);
              subscriptionTier = 'PRO'; // Default if price lookup fails
            }
          }
        }
      } catch (error) {
        console.error('Error checking Stripe subscription:', error);
      }
    }

    if (!hasValidSubscription) {
      console.log('User does not have valid subscription:', user.subscriptionTier);
      return NextResponse.json({ 
        success: false, 
        error: 'Subscription required',
        message: 'You need an active subscription to refresh flight deals. Please start your free trial.',
        requiresSubscription: true
      }, { status: 403 });
    }

    if (!user.travelPreferences) {
      console.log('User has no travel preferences');
      return NextResponse.json({ error: 'User travel preferences not found. Please complete onboarding.' }, { status: 400 });
    }

    // Prepare search parameters
    const searchParams = {
      homeAirports: user.travelPreferences.homeAirports as string[],
      dreamDestinations: user.travelPreferences.dreamDestinations as string[],
      travelFlexibility: user.travelPreferences.travelFlexibility || 3, // Reduced from 7 to 3
      currency: user.travelPreferences.currency || 'USD', // Use user's preferred currency
    };

    // Get new recommendations from Amadeus API
    console.log('Calling Amadeus API with params:', searchParams);
    const amadeusRecommendations = await getFlightRecommendations(searchParams, user.id);
    console.log('Amadeus API returned:', { dealsCount: amadeusRecommendations.deals.length, summary: amadeusRecommendations.summary });

    // Keep old recommendations - don't clear them
    // await db.flightRecommendation.updateMany({
    //   where: { userId: user.id },
    //   data: { isActive: false },
    // });

    // Save new recommendations to database
    console.log('Saving recommendations to database...');
    const savedRecommendations = await Promise.all(
      amadeusRecommendations.deals.map(async (deal) => {
        return await db.flightRecommendation.create({
          data: {
            userId: user.id,
            origin: deal.origin,
            destination: deal.destination,
            departureDate: new Date(deal.departureDate),
            returnDate: deal.returnDate ? new Date(deal.returnDate) : null,
            price: deal.price,
            currency: deal.currency,
            airline: deal.airline,
            flightNumber: deal.flightNumber,
            layovers: deal.layovers,
            duration: deal.duration,
            baggageInfo: deal.baggageInfo,
            aiSummary: amadeusRecommendations.summary,
            confidenceScore: deal.confidenceScore,
            dealQuality: deal.dealQuality,
            bookingUrl: deal.bookingUrl,
            otaUrl: deal.bookingUrl, // Using same URL for now
            isActive: true,
            isWatched: false,
          },
        });
      })
    );
    console.log('Saved recommendations count:', savedRecommendations.length);

    // Send email notification if deals were found
    console.log(`Found ${savedRecommendations.length} deals, user email: ${user.email}`);
    console.log('User object:', { id: user.id, email: user.email, name: user.name });
    console.log('User email type:', typeof user.email, 'User email value:', user.email);
    
    if (savedRecommendations.length > 0) {
      console.log('Attempting to send email notification...');
      try {
        const dealsForEmail = savedRecommendations.map(deal => ({
          origin: deal.origin,
          destination: deal.destination,
          departureDate: deal.departureDate.toISOString(),
          returnDate: deal.returnDate?.toISOString(),
          price: deal.price,
          currency: deal.currency,
          airline: deal.airline,
          dealQuality: deal.dealQuality as 'excellent' | 'good' | 'fair' | undefined,
          bookingUrl: deal.bookingUrl || undefined,
        }));

        const summary = amadeusRecommendations.summary || 
          `Found ${savedRecommendations.length} new flight deals matching your preferences!`;

        console.log('Sending email with data:', {
          userEmail: user.email,
          userName: user.name,
          dealsCount: dealsForEmail.length,
          summary
        });

        console.log('About to call sendBatchDealAlert...');
        const emailResult = await sendBatchDealAlert(
          user.email,
          user.name || undefined,
          dealsForEmail,
          summary
        );

        console.log(`Email send result: ${emailResult}`);
        console.log(`Deal notification email sent to ${user.email} for ${savedRecommendations.length} deals`);
      } catch (emailError) {
        console.error('Failed to send deal notification email:', emailError);
        console.error('Email error details:', emailError);
        // Don't fail the entire request if email fails
      }
    } else {
      console.log('No deals found, skipping email notification');
    }

    return NextResponse.json({ 
      success: true, 
      message: `Found ${savedRecommendations.length} new flight deals`,
      count: savedRecommendations.length 
    });

  } catch (error) {
    console.error('Error refreshing recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to refresh recommendations. Please try again.' },
      { status: 500 }
    );
  }
}
