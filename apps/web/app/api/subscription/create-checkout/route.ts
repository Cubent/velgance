import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { database } from '@repo/database';
import { createTraviraCustomer, createTraviraCheckoutSession } from '@repo/payments';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { successUrl, cancelUrl } = body;

    if (!successUrl || !cancelUrl) {
      return NextResponse.json({ error: 'Success URL and cancel URL are required' }, { status: 400 });
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

    let customerId = user.stripeSubscription?.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await createTraviraCustomer({
        email: user.email,
        name: user.name || undefined,
        userId: user.id,
      });

      customerId = customer.id;

      // Save customer ID to database
      await database.stripeSubscription.upsert({
        where: { userId: user.id },
        update: { stripeCustomerId: customerId },
        create: {
          userId: user.id,
          stripeCustomerId: customerId,
          status: 'inactive',
        },
      });
    }

    // Create checkout session
    const session = await createTraviraCheckoutSession({
      customerId,
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({ 
      success: true, 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
