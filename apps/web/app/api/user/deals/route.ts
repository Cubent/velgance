import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { database } from '@repo/database';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user by Clerk ID
    const user = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch watched flight recommendations
    const watchedDeals = await database.flightRecommendation.findMany({
      where: {
        userId: user.id,
        isWatched: true,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to match the expected format
    const deals = watchedDeals.map((deal: any) => ({
      id: deal.id,
      origin: deal.origin,
      destination: deal.destination,
      price: deal.price,
      originalPrice: Math.round(deal.price * 1.8), // Estimate original price
      savings: Math.round(deal.price * 0.8), // Estimate savings
      airline: deal.airline,
      departureDate: deal.departureDate.toISOString(),
      returnDate: deal.returnDate?.toISOString(),
      bookingUrl: deal.bookingUrl,
      createdAt: deal.createdAt.toISOString(),
    }));

    return NextResponse.json(deals);
  } catch (error) {
    console.error('Error fetching user deals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
