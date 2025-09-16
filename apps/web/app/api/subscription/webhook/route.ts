import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@repo/payments';
import { keys } from '@repo/payments/keys';
import { database } from '@repo/database';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    const webhookSecret = keys().STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Stripe webhook secret not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (!session.customer || !session.subscription) {
    console.error('Missing customer or subscription in checkout session');
    return;
  }

  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  // Find user by Stripe customer ID
  const stripeSubscription = await database.stripeSubscription.findUnique({
    where: { stripeCustomerId: customerId },
    include: { user: true },
  });

  if (!stripeSubscription) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Get subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Determine subscription tier based on price lookup key
  const priceId = subscription.items.data[0]?.price.id;
  let subscriptionTier = 'PRO'; // Default to PRO
  
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

  // Update subscription in database
  await database.stripeSubscription.update({
    where: { id: stripeSubscription.id },
    data: {
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      status: subscription.status,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
    },
  });

  // Update user subscription tier
  await database.user.update({
    where: { id: stripeSubscription.userId },
    data: {
      subscriptionTier: subscriptionTier,
      subscriptionStatus: subscription.status === 'trialing' ? 'TRIALING' : 'ACTIVE',
    },
  });

  console.log(`Subscription created for user ${stripeSubscription.userId} with tier ${subscriptionTier}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const stripeSubscription = await database.stripeSubscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!stripeSubscription) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Determine subscription tier based on price lookup key
  const priceId = subscription.items.data[0]?.price.id;
  let subscriptionTier = 'PRO'; // Default to PRO
  
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

  await database.stripeSubscription.update({
    where: { id: stripeSubscription.id },
    data: {
      status: subscription.status,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
      canceledAt: (subscription as any).canceled_at ? new Date((subscription as any).canceled_at * 1000) : null,
      endedAt: (subscription as any).ended_at ? new Date((subscription as any).ended_at * 1000) : null,
    },
  });

  // Update user subscription tier and status
  await database.user.update({
    where: { id: stripeSubscription.userId },
    data: {
      subscriptionTier: subscriptionTier,
      subscriptionStatus: subscription.status === 'trialing' ? 'TRIALING' : 
                         subscription.status === 'active' ? 'ACTIVE' : 
                         subscription.status === 'canceled' ? 'CANCELED' : 'INACTIVE',
    },
  });

  console.log(`Subscription updated for user ${stripeSubscription.userId}: ${subscription.status} (tier: ${subscriptionTier})`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const stripeSubscription = await database.stripeSubscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!stripeSubscription) {
    console.error('User not found for customer:', customerId);
    return;
  }

  await database.stripeSubscription.update({
    where: { id: stripeSubscription.id },
    data: {
      status: 'canceled',
      endedAt: new Date(),
    },
  });

  // Update user subscription status to inactive
  await database.user.update({
    where: { id: stripeSubscription.userId },
    data: {
      subscriptionTier: 'FREE',
      subscriptionStatus: 'INACTIVE',
    },
  });

  console.log(`Subscription deleted for user ${stripeSubscription.userId}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!(invoice as any).subscription) return;

  const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string);
  await handleSubscriptionUpdated(subscription);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  if (!(invoice as any).subscription) return;

  const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string);
  await handleSubscriptionUpdated(subscription);
}
