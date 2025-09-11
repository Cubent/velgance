import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { database as db } from '@repo/database';
import { getFlightRecommendations, FlightSearchParams } from '@/services/amadeus';

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
      travelFlexibility: 7, // Default 7 days flexibility
      maxBudget: preferences.maxBudget,
      preferredAirlines: preferences.preferredAirlines || [],
      departureMonth: new Date().toISOString().slice(0, 7), // Current month
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

    // Save new recommendations to database (exactly 6 deals)
    const dealsToSave = amadeusResponse.deals.slice(0, 6); // Always get exactly 6 deals
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
            isActive: true,
            isWatched: false,
          },
        });
      })
    );

    return NextResponse.json({
      success: true,
      recommendations: savedRecommendations,
      summary: amadeusResponse.summary,
      metadata: amadeusResponse.searchMetadata,
      message: `Generated and saved ${savedRecommendations.length} flight deals using Amadeus API`
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
