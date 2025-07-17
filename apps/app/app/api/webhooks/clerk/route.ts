import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import Stripe from 'stripe';
import { clerkClient } from '@clerk/nextjs/server';

// Simple GET method for testing webhook endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Clerk webhook endpoint is accessible and ready for POST requests',
    timestamp: new Date().toISOString(),
    methods: ['GET', 'POST'],
    status: 'ACTIVE',
    route: '/api/webhooks/clerk'
  });
}

export async function POST(request: Request) {
  console.log('🔔 Clerk webhook received');
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

  if (!CLERK_WEBHOOK_SECRET) {
    console.error('❌ CLERK_WEBHOOK_SECRET not found');
    return NextResponse.json({ error: 'CLERK_WEBHOOK_SECRET not configured' }, { status: 500 });
  }

  if (!STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY not found');
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY not configured' }, { status: 500 });
  }

  // Get the headers
  const svixId = request.headers.get('svix-id');
  const svixTimestamp = request.headers.get('svix-timestamp');
  const svixSignature = request.headers.get('svix-signature');

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error('❌ Missing svix headers');
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('🚨 Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Initialize Stripe
  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const client = await clerkClient();

  try {
    if (evt.type === 'user.created') {
      console.log('👤 User created event received for user:', evt.data.id);
      console.log('📧 User email:', evt.data.email_addresses?.[0]?.email_address);

      const {
        id: newUserId,
        username,
        email_addresses: emailAddresses,
        first_name: firstName,
        last_name: lastName,
      } = evt.data;

      // Create Stripe customer
      const customerProps: Stripe.CustomerCreateParams = {
        metadata: {
          clerk_user_id: newUserId,
        },
      };

      // Set customer name
      if (firstName || lastName) {
        customerProps.name = [firstName, lastName].filter(Boolean).join(' ');
      } else if (username) {
        customerProps.name = username;
      }

      // Set customer email
      if (emailAddresses && emailAddresses.length > 0) {
        customerProps.email = emailAddresses[0].email_address;
      }

      // Create the Stripe customer
      console.log('💳 Creating Stripe customer...');
      const customer = await stripe.customers.create(customerProps);
      console.log('✅ Stripe customer created:', customer.id);

      // Get the free plan price using lookup key
      console.log('🔍 Looking for Stripe price with lookup_key "free"...');
      const {
        data: [price],
      } = await stripe.prices.list({ lookup_keys: ['free'] });

      if (!price) {
        console.error('❌ Free plan price not found. Make sure you have a price with lookup_key "free" in Stripe.');
        return NextResponse.json({ error: 'Free plan not configured' }, { status: 500 });
      }

      console.log('✅ Found Stripe price:', price.id);

      // Create subscription with free plan
      console.log('📋 Creating Stripe subscription...');
      await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
      });
      console.log('✅ Stripe subscription created');

      // Calculate trial end date (7 days from now)
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);

      // Store Stripe customer ID and trial info in Clerk user metadata
      console.log('👤 Updating Clerk user metadata...');
      await client.users.updateUserMetadata(newUserId, {
        privateMetadata: {
          stripeCustomerId: customer.id,
          trialStartDate: new Date().toISOString(),
          trialEndDate: trialEndDate.toISOString(),
          subscriptionStatus: 'trial',
        },
      });

      console.log(`🎉 TRIAL CREATED SUCCESSFULLY for user ${newUserId}`);
      console.log(`💳 Stripe customer: ${customer.id}`);
      console.log(`📅 Trial ends: ${trialEndDate.toISOString()}`);

      return NextResponse.json({
        message: 'Trial created successfully',
        userId: newUserId,
        customerId: customer.id,
        trialEndDate: trialEndDate.toISOString()
      });
    }

    return NextResponse.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('🚨 Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
