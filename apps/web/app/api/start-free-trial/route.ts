import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Get the authenticated user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId: requestUserId } = body;

    // Verify the user ID matches
    if (userId !== requestUserId) {
      return NextResponse.json({ error: 'User ID mismatch' }, { status: 403 });
    }

    // Calculate trial end date (7 days from now)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);

    // Here you would typically save the trial information to your database
    // For now, we'll use Clerk's user metadata to store trial info
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        trialStartDate: new Date().toISOString(),
        trialEndDate: trialEndDate.toISOString(),
        subscriptionStatus: 'trial',
        plan: 'free_trial'
      }
    });

    return NextResponse.json({ 
      success: true, 
      trialEndDate: trialEndDate.toISOString(),
      message: '7-day free trial started successfully'
    });

  } catch (error) {
    console.error('Error starting free trial:', error);
    return NextResponse.json(
      { error: 'Failed to start free trial' }, 
      { status: 500 }
    );
  }
}
