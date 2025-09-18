import { NextRequest, NextResponse } from 'next/server';
import { database as db } from '@repo/database';
import { scheduleEvent, calculateFirstDealDate } from '../../../../lib/event-scheduler';
import { stripe } from '@repo/payments';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('📊 Webhook event received:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
        
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: any) {
  try {
    console.log('🛒 Checkout completed for session:', session.id);
    
    const customerId = session.customer;
    const subscriptionId = session.subscription;
    
    if (!customerId || !subscriptionId) {
      console.log('❌ No customer or subscription ID in session');
      return;
    }

    // Get customer details
    const customer = await stripe.customers.retrieve(customerId);
    
    if (customer.deleted) {
      console.log('❌ Customer is deleted');
      return;
    }
    
    const email = customer.email;

    if (!email) {
      console.log('❌ No email found for customer');
      return;
    }

    // Find or create user
    let user = await db.user.findUnique({
      where: { email },
      include: { travelPreferences: true }
    });

    if (!user) {
      console.log('❌ User not found for email:', email);
      return;
    }

    // Create or update StripeSubscription record
    await db.stripeSubscription.upsert({
      where: { userId: user.id },
      update: {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        status: 'active',
        currentPeriodStart: new Date(session.subscription_details?.current_period_start * 1000),
        currentPeriodEnd: new Date(session.subscription_details?.current_period_end * 1000),
      },
      create: {
        userId: user.id,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        status: 'active',
        currentPeriodStart: new Date(session.subscription_details?.current_period_start * 1000),
        currentPeriodEnd: new Date(session.subscription_details?.current_period_end * 1000),
        amount: 99.00,
        currency: 'USD',
        interval: 'year'
      }
    });

    // Schedule first deal generation if user has preferences
    if (user.travelPreferences?.deliveryFrequency) {
      const firstDealDate = calculateFirstDealDate(user.travelPreferences.deliveryFrequency);
      
      await scheduleEvent('generate-deals', {
        userId: user.id,
        frequency: user.travelPreferences.deliveryFrequency
      }, firstDealDate);
      
      console.log(`✅ Scheduled first deal for user ${user.id} on ${firstDealDate.toISOString()}`);
    }

  } catch (error) {
    console.error('Error handling checkout completed:', error);
  }
}

async function handleSubscriptionCreated(subscription: any) {
  try {
    console.log('📅 Subscription created:', subscription.id);
    
    const customerId = subscription.customer;
    const customer = await stripe.customers.retrieve(customerId);
    
    if (customer.deleted) {
      console.log('❌ Customer is deleted');
      return;
    }
    
    const email = customer.email;

    if (!email) {
      console.log('❌ No email found for customer');
      return;
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email },
      include: { travelPreferences: true }
    });

    if (!user) {
      console.log('❌ User not found for email:', email);
      return;
    }

    // Create StripeSubscription record
    await db.stripeSubscription.upsert({
      where: { userId: user.id },
      update: {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
      create: {
        userId: user.id,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        amount: 99.00,
        currency: 'USD',
        interval: 'year'
      }
    });

    // Schedule first deal generation if user has preferences
    if (user.travelPreferences?.deliveryFrequency) {
      const firstDealDate = calculateFirstDealDate(user.travelPreferences.deliveryFrequency);
      
      await scheduleEvent('generate-deals', {
        userId: user.id,
        frequency: user.travelPreferences.deliveryFrequency
      }, firstDealDate);
      
      console.log(`✅ Scheduled first deal for user ${user.id} on ${firstDealDate.toISOString()}`);
    }

  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  try {
    console.log('📅 Subscription updated:', subscription.id);
    
    // Update subscription status
    await db.stripeSubscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      }
    });

  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  try {
    console.log('📅 Subscription deleted:', subscription.id);
    
    // Cancel all scheduled events for this user
    const stripeSub = await db.stripeSubscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
      include: { user: true }
    });

    if (stripeSub) {
      await db.scheduledEvent.updateMany({
        where: {
          userId: stripeSub.userId,
          eventName: 'generate-deals',
          processed: false
        },
        data: { processed: true }
      });
      
      console.log(`❌ Cancelled scheduled events for user ${stripeSub.userId}`);
    }

  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}
