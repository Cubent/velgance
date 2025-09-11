import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { database as db } from '@repo/database';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: recommendationId } = await params;

    if (!recommendationId) {
      return NextResponse.json({ error: 'Recommendation ID is required' }, { status: 400 });
    }

    // Find the user by Clerk ID first
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the recommendation to ensure it belongs to the user
    const recommendation = await db.flightRecommendation.findFirst({
      where: {
        id: recommendationId,
        userId: user.id, // Use the database user ID, not Clerk ID
      },
    });

    if (!recommendation) {
      return NextResponse.json({ error: 'Recommendation not found' }, { status: 404 });
    }

    // Delete the recommendation
    await db.flightRecommendation.delete({
      where: {
        id: recommendationId,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Recommendation deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to delete recommendation' },
      { status: 500 }
    );
  }
}
