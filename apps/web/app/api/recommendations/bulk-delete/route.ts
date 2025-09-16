import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { database } from '@repo/database';

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { dealIds } = body;

    if (!dealIds || !Array.isArray(dealIds) || dealIds.length === 0) {
      return NextResponse.json({ error: 'No deal IDs provided' }, { status: 400 });
    }

    // Find the user by Clerk ID
    const user = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete the specified deals
    const result = await database.flightRecommendation.deleteMany({
      where: {
        id: {
          in: dealIds
        },
        userId: user.id
      }
    });

    return NextResponse.json({ 
      success: true, 
      deletedCount: result.count 
    });

  } catch (error) {
    console.error('Error deleting deals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
