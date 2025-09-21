import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { database } from '@repo/database';
import { stripe } from '@repo/payments';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user in database
    const user = await database.user.findUnique({
      where: { clerkId: userId },
      include: {
        stripeSubscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.stripeSubscription?.stripeSubscriptionId) {
      return NextResponse.json({ 
        error: 'No Stripe subscription found',
        message: 'User does not have an active Stripe subscription'
      }, { status: 404 });
    }

    // Get current subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscription.stripeSubscriptionId);
    
    // Determine subscription tier based on price lookup key
    const priceId = subscription.items.data[0]?.price.id;
    let subscriptionTier = 'PRO'; // Default to PRO
    
    if (priceId) {
      try {
        const price = await stripe.prices.retrieve(priceId);
        if (price.lookup_key === 'member_plan_annual') {
          subscriptionTier = 'MEMBER';
        }
      } catch (error) {
        console.error('Error retrieving price details:', error);
      }
    }

    // Update database
    await database.user.update({
      where: { id: user.id },
      data: {
        subscriptionTier: subscriptionTier,
        subscriptionStatus: subscription.status === 'trialing' ? 'TRIALING' : 
                           subscription.status === 'active' ? 'ACTIVE' : 
                           subscription.status === 'canceled' ? 'CANCELED' : 'INACTIVE',
      },
    });

    // Update Clerk metadata
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        stripeCustomerId: user.stripeSubscription.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscription.stripeSubscriptionId,
        subscriptionStatus: subscription.status,
        planType: subscriptionTier.toLowerCase(),
        subscriptionTier: subscriptionTier,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription status synced successfully',
      subscriptionTier: subscriptionTier,
      subscriptionStatus: subscription.status,
    });

  } catch (error) {
    console.error('Error syncing subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to sync subscription status' },
      { status: 500 }
    );
  }
}
