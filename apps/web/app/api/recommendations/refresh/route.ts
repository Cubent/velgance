import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { database as db } from '@repo/database';
import { getFlightRecommendations } from '@/services/amadeus';
import { sendBatchDealAlert } from '@/services/deal-email';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user and their travel preferences
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        travelPreferences: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.travelPreferences) {
      return NextResponse.json({ error: 'User travel preferences not found. Please complete onboarding.' }, { status: 400 });
    }

    // Prepare search parameters
    const searchParams = {
      homeAirports: user.travelPreferences.homeAirports as string[],
      dreamDestinations: user.travelPreferences.dreamDestinations as string[],
      travelFlexibility: user.travelPreferences.travelFlexibility || 3, // Reduced from 7 to 3
      maxBudget: user.travelPreferences.maxBudget || undefined,
      preferredAirlines: user.travelPreferences.preferredAirlines as string[],
    };

    // Get new recommendations from Amadeus API
    const amadeusRecommendations = await getFlightRecommendations(searchParams);

    // Clear old recommendations
    await db.flightRecommendation.updateMany({
      where: { userId: user.id },
      data: { isActive: false },
    });

    // Save new recommendations to database
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

    // Send email notification if deals were found
    if (savedRecommendations.length > 0) {
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

        await sendBatchDealAlert(
          user.email,
          user.name || undefined,
          dealsForEmail,
          summary
        );

        console.log(`Deal notification email sent to ${user.email} for ${savedRecommendations.length} deals`);
      } catch (emailError) {
        console.error('Failed to send deal notification email:', emailError);
        // Don't fail the entire request if email fails
      }
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
