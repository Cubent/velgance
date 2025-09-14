import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { database as db } from '@repo/database';
import { getFlightRecommendations, FlightSearchParams } from '@/services/amadeus';
import { sendBatchDealAlert } from '@/services/deal-email';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { preferences, count } = await request.json();

    if (!preferences) {
      return NextResponse.json(
        { success: false, error: 'Preferences are required' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Convert user preferences to Amadeus flight search parameters
    const searchParams: FlightSearchParams = {
      homeAirports: preferences.homeAirports || [],
      dreamDestinations: preferences.dreamDestinations || [],
      travelFlexibility: 3, // Reduced from 7 to 3 days flexibility
      maxBudget: preferences.maxBudget,
      preferredAirlines: preferences.preferredAirlines || [],
      currency: preferences.currency || 'USD', // Use user's preferred currency
      // Remove departureMonth to use 30-day logic instead of current month
    };

    // Use the Amadeus service to get flight recommendations
    console.log('Calling Amadeus with params:', searchParams);
    const amadeusResponse = await getFlightRecommendations(searchParams);
    console.log('Amadeus response:', amadeusResponse);

    // Clear old recommendations
    await db.flightRecommendation.updateMany({
      where: { userId: user.id },
      data: { isActive: false },
    });

    // Save new recommendations to database (5-10 deals)
    const dealsToSave = amadeusResponse.deals.slice(0, 10); // Get up to 10 deals
    const savedRecommendations = await Promise.all(
      dealsToSave.map(async (deal) => {
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
            aiSummary: amadeusResponse.summary,
            bookingUrl: deal.bookingUrl,
            otaUrl: deal.bookingUrl,
            cityImageUrl: deal.cityImageUrl,
            isActive: true,
            isWatched: false,
          },
        });
      })
    );

    // Send email notification if deals were found
    console.log(`=== GENERATE ENDPOINT: Found ${savedRecommendations.length} deals, user email: ${user.email}`);
    
    if (savedRecommendations.length > 0) {
      console.log('GENERATE: Attempting to send email notification...');
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

        const summary = amadeusResponse.summary || 
          `Found ${savedRecommendations.length} new flight deals matching your preferences!`;

        console.log('GENERATE: Sending email with data:', {
          userEmail: user.email,
          userName: user.name,
          dealsCount: dealsForEmail.length,
          summary
        });

        const emailResult = await sendBatchDealAlert(
          user.email,
          user.name || undefined,
          dealsForEmail,
          summary
        );

        console.log(`GENERATE: Email send result: ${emailResult}`);
        console.log(`GENERATE: Deal notification email sent to ${user.email} for ${savedRecommendations.length} deals`);
      } catch (emailError) {
        console.error('GENERATE: Failed to send deal notification email:', emailError);
        console.error('GENERATE: Email error details:', emailError);
        // Don't fail the entire request if email fails
      }
    } else {
      console.log('GENERATE: No deals found, skipping email notification');
    }

    return NextResponse.json({
      success: true,
      recommendations: savedRecommendations,
      summary: amadeusResponse.summary,
      metadata: amadeusResponse.searchMetadata,
      message: `Generated and saved ${savedRecommendations.length} flight deals using Amadeus API (optimized for 5-10 results)`
    });

  } catch (error) {
    console.error('Error generating Amadeus recommendations:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate flight recommendations',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
