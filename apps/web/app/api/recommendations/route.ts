import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { database } from '@repo/database';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user by Clerk ID
    const user = await database.user.findUnique({
      where: { clerkId: userId },
      include: {
        flightRecommendations: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Transform database records to match frontend interface
    const recommendations = user.flightRecommendations.map(rec => ({
      id: rec.id,
      origin: rec.origin,
      destination: rec.destination,
      departureDate: rec.departureDate.toISOString(),
      returnDate: rec.returnDate?.toISOString(),
      price: rec.price,
      currency: rec.currency,
      airline: rec.airline,
      flightNumber: rec.flightNumber,
      layovers: rec.layovers as Array<{ airport: string; duration: string }>,
      duration: rec.duration,
      baggageInfo: rec.baggageInfo as { carry_on: string; checked: string },
      aiSummary: rec.aiSummary,
      confidenceScore: rec.confidenceScore,
      dealQuality: rec.dealQuality,
      bookingUrl: rec.bookingUrl,
      otaUrl: rec.otaUrl,
      isWatched: rec.isWatched,
    }));

    return NextResponse.json({ 
      success: true, 
      recommendations 
    });

  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
