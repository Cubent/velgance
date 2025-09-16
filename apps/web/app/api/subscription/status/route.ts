import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { database } from '@repo/database';
import { createBillingPortalSession } from '@repo/payments';

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
        stripeSubscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const subscription = user.stripeSubscription;

    // Determine if user is in trial
    const isInTrial = subscription?.status === 'trialing';
    let trialEndDate = null;
    let daysRemaining = 0;

    if (isInTrial && subscription?.currentPeriodEnd) {
      trialEndDate = subscription.currentPeriodEnd;
      const now = new Date();
      const timeDiff = trialEndDate.getTime() - now.getTime();
      daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if (daysRemaining < 0) daysRemaining = 0;
    }

    return NextResponse.json({ 
      success: true,
      tier: user.subscriptionTier,
      status: user.subscriptionStatus,
      subscription: subscription ? {
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        amount: subscription.amount,
        currency: subscription.currency,
        interval: subscription.interval,
      } : null,
      hasActiveSubscription: subscription?.status === 'active' || subscription?.status === 'trialing',
      isInTrial: isInTrial,
      trialEndDate: trialEndDate,
      daysRemaining: daysRemaining,
    });

  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, returnUrl } = body;

    // Find the user by Clerk ID
    const user = await database.user.findUnique({
      where: { clerkId: userId },
      include: {
        stripeSubscription: true,
      },
    });

    if (!user || !user.stripeSubscription) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    if (action === 'manage') {
      // Create billing portal session
      const session = await createBillingPortalSession(
        user.stripeSubscription.stripeCustomerId,
        returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
      );

      return NextResponse.json({ 
        success: true,
        url: session.url 
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Error managing subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
