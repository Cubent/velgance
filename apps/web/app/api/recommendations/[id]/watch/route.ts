import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@repo/database';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const recommendationId = params.id;

    // Find the user by Clerk ID
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the recommendation and verify it belongs to the user
    const recommendation = await db.flightRecommendation.findFirst({
      where: {
        id: recommendationId,
        userId: user.id,
      },
    });

    if (!recommendation) {
      return NextResponse.json({ error: 'Recommendation not found' }, { status: 404 });
    }

    // Toggle the watch status
    const updatedRecommendation = await db.flightRecommendation.update({
      where: { id: recommendationId },
      data: { isWatched: !recommendation.isWatched },
    });

    return NextResponse.json({ 
      success: true, 
      isWatched: updatedRecommendation.isWatched 
    });

  } catch (error) {
    console.error('Error updating watch status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
