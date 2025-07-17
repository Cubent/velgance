import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { stripe } from '@repo/payments';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const privateMetadata = user.privateMetadata;
    const stripeCustomerId = privateMetadata.stripeCustomerId as string | null;
    const stripeSubscriptionId = privateMetadata.stripeSubscriptionId as string | null;

    if (!stripeCustomerId || !stripeSubscriptionId) {
      return NextResponse.json({
        isInTrial: false,
        trialExpired: false,
        daysRemaining: 0,
        trialEndDate: null,
        subscriptionStatus: 'no_subscription',
        planType: null
      });
    }

    // Get subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

    const now = new Date();
    const isInTrial = subscription.status === 'trialing';
    const trialEndDate = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null;
    const daysRemaining = trialEndDate ? Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;
    const trialExpired = subscription.status === 'active' && subscription.trial_end && subscription.trial_end * 1000 < now.getTime();

    return NextResponse.json({
      isInTrial,
      trialExpired: trialExpired || false,
      daysRemaining,
      trialEndDate: trialEndDate?.toISOString() || null,
      subscriptionStatus: subscription.status,
      planType: privateMetadata.planType || 'byak'
    });

  } catch (error) {
    console.error('Error fetching trial status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
