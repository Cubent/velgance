import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { referralSource } = body;

    if (!referralSource) {
      return NextResponse.json({ error: 'Referral source is required' }, { status: 400 });
    }

    // Get the Clerk client
    const client = await clerkClient();
    
    // Get current user metadata
    const user = await client.users.getUser(userId);
    const currentMetadata = user.publicMetadata || {};
    
    // Add referral source to metadata
    const updatedMetadata = {
      ...currentMetadata,
      referralSource: referralSource,
      referralDate: new Date().toISOString()
    };

    // Update user metadata
    await client.users.updateUserMetadata(userId, {
      publicMetadata: updatedMetadata
    });

    // Increment signup count for the influencer
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/influencers/increment-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referralCode: referralSource
        }),
      });
    } catch (error) {
      console.error('Failed to increment influencer signup count:', error);
      // Don't fail the main request if this fails
    }

    console.log('✅ Referral source added to user metadata:', {
      userId,
      referralSource,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Referral source tracked successfully',
      referralSource 
    });

  } catch (error) {
    console.error('Error tracking referral source:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to track referral source' 
      }, 
      { status: 500 }
    );
  }
}
