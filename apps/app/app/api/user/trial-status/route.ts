import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    const privateMetadata = user.privateMetadata;
    const trialEndDateStr = privateMetadata.trialEndDate as string | null;
    const subscriptionStatus = privateMetadata.subscriptionStatus as string | null;
    
    if (!trialEndDateStr || subscriptionStatus !== 'trial') {
      return NextResponse.json({ 
        isInTrial: false,
        trialExpired: false,
        daysRemaining: 0,
        trialEndDate: null,
        subscriptionStatus: subscriptionStatus || 'unknown'
      });
    }

    const now = new Date();
    const trialEndDate = new Date(trialEndDateStr);
    const daysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const isInTrial = daysRemaining > 0;
    const trialExpired = daysRemaining === 0;
    
    return NextResponse.json({
      isInTrial,
      trialExpired,
      daysRemaining,
      trialEndDate: trialEndDateStr,
      subscriptionStatus
    });

  } catch (error) {
    console.error('Error fetching trial status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
