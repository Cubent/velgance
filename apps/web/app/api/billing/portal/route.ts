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

    // If no Stripe customer ID in metadata, check if customer exists by email
    if (!stripeCustomerId) {
      const userEmail = user.emailAddresses[0]?.emailAddress;
      
      if (!userEmail) {
        return NextResponse.json({ error: 'No email found' }, { status: 400 });
      }

      // Search for existing customer by email
      const existingCustomers = await stripe.customers.list({
        email: userEmail,
        limit: 1
      });

      if (existingCustomers.data.length > 0) {
        // Use existing customer
        stripeCustomerId = existingCustomers.data[0].id;
        
        // Update Clerk metadata with existing customer ID
        await client.users.updateUserMetadata(userId, {
          privateMetadata: {
            ...user.privateMetadata,
            stripeCustomerId: stripeCustomerId,
          },
        });
        
        console.log('Found existing Stripe customer:', stripeCustomerId);
      } else {
        // No customer exists, redirect to pricing
        return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
      }
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
