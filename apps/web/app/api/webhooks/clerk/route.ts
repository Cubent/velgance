import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import Stripe from 'stripe';
import { clerkClient } from '@clerk/nextjs/server';

// Add GET method for testing webhook endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Clerk webhook endpoint is accessible and ready for POST requests',
    timestamp: new Date().toISOString(),
    methods: ['GET', 'POST'],
    status: 'ACTIVE'
  });
}

export async function POST(request: Request) {
  console.log('🔔 Clerk webhook received');
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  if (!STRIPE_SECRET_KEY) {
    throw new Error('Please add STRIPE_SECRET_KEY to .env');
  }

  // Get the headers
  const svixId = request.headers.get('svix-id');
  const svixTimestamp = request.headers.get('svix-timestamp');
  const svixSignature = request.headers.get('svix-signature');

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
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
    console.error('🔍 Webhook verification failed - check CLERK_WEBHOOK_SECRET');
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
      console.log('🔧 Environment check:', {
        hasClerkSecret: !!CLERK_SECRET_KEY,
        hasStripeSecret: !!STRIPE_SECRET_KEY
      });
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
      const customer = await stripe.customers.create(customerProps);

      // Get the free plan price using lookup key
      console.log('🔍 Looking for Stripe price with lookup_key "free"...');
      const {
        data: [price],
      } = await stripe.prices.list({ lookup_keys: ['free'] });

      if (!price) {
        console.error('❌ Free plan price not found. Make sure you have a price with lookup_key "free" in Stripe.');
        return NextResponse.json({ error: 'Free plan not configured - missing Stripe price with lookup_key "free"' }, { status: 500 });
      }

      console.log('✅ Found Stripe price:', price.id);

      // Create subscription with free plan
      await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
      });

      // Calculate trial end date (7 days from now)
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);

      // Store Stripe customer ID and trial info in Clerk user metadata
      await client.users.updateUserMetadata(newUserId, {
        privateMetadata: {
          stripeCustomerId: customer.id,
          trialStartDate: new Date().toISOString(),
          trialEndDate: trialEndDate.toISOString(),
          subscriptionStatus: 'trial',
        },
      });

      console.log(`✅ Created free trial for user ${newUserId} with Stripe customer ${customer.id}`);

      // Return success with trial info for debugging
      return NextResponse.json({
        message: 'Trial created successfully',
        userId: newUserId,
        customerId: customer.id,
        trialEndDate: trialEndDate.toISOString()
      });
    } else if (evt.type === 'user.deleted') {
      const deletedUserId = evt.data.id;

      if (!deletedUserId) {
        throw new Error('User ID not found in deletion event');
      }

      // Find Stripe customer by Clerk user ID
      const searchResult = await stripe.customers.search({
        query: `metadata['clerk_user_id']:'${deletedUserId}'`,
      });

      if (searchResult.data && searchResult.data.length > 0) {
        const stripeCustomer = searchResult.data.find(
          (customer) => customer.metadata.clerk_user_id === deletedUserId
        );

        if (stripeCustomer) {
          await stripe.customers.del(stripeCustomer.id);
          console.log(`Deleted Stripe customer ${stripeCustomer.id} for user ${deletedUserId}`);
        }
      }
    }

    return NextResponse.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('🚨 Error processing webhook:', error);
    console.error('🔍 Full error details:', JSON.stringify(error, null, 2));
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
