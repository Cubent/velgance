import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { database as db } from '@repo/database';
import { getFlightRecommendations, FlightSearchParams } from '@/services/o3';

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

    // Convert user preferences to O3 flight search parameters
    const searchParams: FlightSearchParams = {
      homeAirports: preferences.homeAirports || [],
      dreamDestinations: preferences.dreamDestinations || [],
      travelFlexibility: 7, // Default 7 days flexibility
      maxBudget: preferences.maxBudget,
      preferredAirlines: preferences.preferredAirlines || [],
      departureMonth: new Date().toISOString().slice(0, 7), // Current month
    };

    // Use the existing O3 service to get flight recommendations
    console.log('Calling O3 with params:', searchParams);
    const o3Response = await getFlightRecommendations(searchParams);
    console.log('O3 response:', o3Response);

    // Clear old recommendations
    await db.flightRecommendation.updateMany({
      where: { userId: user.id },
      data: { isActive: false },
    });

    // Save new recommendations to database (exactly 6 deals)
    const dealsToSave = o3Response.deals.slice(0, 6); // Always get exactly 6 deals
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
            aiSummary: `Great non-stop flight deal found`,
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
      summary: o3Response.summary,
      metadata: o3Response.searchMetadata,
      message: `Generated and saved ${savedRecommendations.length} AI-powered flight deals using O3`
    });

  } catch (error) {
    console.error('Error generating O3 recommendations:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate AI recommendations',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
