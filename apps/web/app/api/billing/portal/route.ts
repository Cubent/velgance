import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    // Get the authenticated user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    if (!STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }

    // Initialize Stripe
    const stripe = new Stripe(STRIPE_SECRET_KEY);

    // Get user from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    // Get Stripe customer ID from user metadata
    let stripeCustomerId = user.privateMetadata?.stripeCustomerId as string;

    // If no Stripe customer exists, create one
    if (!stripeCustomerId) {
      console.log('No Stripe customer found, creating one for user:', userId);

      const customerData: any = {
        email: user.emailAddresses[0]?.emailAddress,
        metadata: {
          clerkUserId: userId,
        },
      };

      // Add name if available
      if (user.firstName || user.lastName) {
        customerData.name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      }

      // Create Stripe customer
      const customer = await stripe.customers.create(customerData);
      stripeCustomerId = customer.id;

      // Update Clerk user metadata with new Stripe customer ID
      await client.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          stripeCustomerId: customer.id,
        },
      });

      console.log('Created Stripe customer:', customer.id);
    }

    // Get the request URL to determine the return URL
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    // Create billing portal session
    const billingPortalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${baseUrl}/dashboard`, // Redirect back to dashboard
    });

    if (billingPortalSession.url) {
      return NextResponse.json({ url: billingPortalSession.url });
    }

    return NextResponse.json({ error: 'Failed to create billing portal session' }, { status: 500 });

  } catch (error) {
    console.error('Error creating billing portal session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
