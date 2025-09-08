import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@repo/database';
import { getFlightRecommendations } from '@/services/o3';

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
      travelFlexibility: user.travelPreferences.travelFlexibility || 7,
      maxBudget: user.travelPreferences.maxBudget || undefined,
      preferredAirlines: user.travelPreferences.preferredAirlines as string[],
    };

    // Get new recommendations from OpenAI o3
    const aiRecommendations = await getFlightRecommendations(searchParams);

    // Clear old recommendations
    await db.flightRecommendation.updateMany({
      where: { userId: user.id },
      data: { isActive: false },
    });

    // Save new recommendations to database
    const savedRecommendations = await Promise.all(
      aiRecommendations.deals.map(async (deal) => {
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
            aiSummary: aiRecommendations.summary,
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
