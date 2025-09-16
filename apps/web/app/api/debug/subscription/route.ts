import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { database } from '@repo/database';
import { stripe } from '@repo/payments';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await database.user.findUnique({
      where: { clerkId: userId },
      include: {
        stripeSubscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let stripeSubscriptionData = null;
    if (user.stripeSubscription?.stripeSubscriptionId) {
      try {
        const stripeSub = await stripe.subscriptions.retrieve(user.stripeSubscription.stripeSubscriptionId);
        stripeSubscriptionData = {
          id: stripeSub.id,
          status: stripeSub.status,
          currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
          currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
          items: stripeSub.items.data.map(item => ({
            priceId: item.price.id,
            lookupKey: item.price.lookup_key,
            amount: item.price.unit_amount,
            currency: item.price.currency,
          })),
        };
      } catch (error) {
        console.error('Error fetching Stripe subscription:', error);
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        subscriptionTier: user.subscriptionTier,
        subscriptionStatus: user.subscriptionStatus,
      },
      stripeSubscription: user.stripeSubscription,
      stripeData: stripeSubscriptionData,
    });

  } catch (error) {
    console.error('Debug subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
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
      return NextResponse.json({ error: 'No Stripe subscription found' }, { status: 404 });
    }

    // Get subscription from Stripe
    const stripeSub = await stripe.subscriptions.retrieve(user.stripeSubscription.stripeSubscriptionId);
    
    // Determine subscription tier
    const priceId = stripeSub.items.data[0]?.price.id;
    let subscriptionTier = 'PRO';
    
    if (priceId) {
      try {
        const price = await stripe.prices.retrieve(priceId);
        if (price.lookup_key === 'member_plan') {
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
        subscriptionStatus: stripeSub.status === 'trialing' ? 'TRIALING' : 'ACTIVE',
      },
    });

    await database.stripeSubscription.update({
      where: { id: user.stripeSubscription.id },
      data: {
        status: stripeSub.status,
        currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription synced successfully',
      subscriptionTier: subscriptionTier,
      status: stripeSub.status,
    });

  } catch (error) {
    console.error('Sync subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
