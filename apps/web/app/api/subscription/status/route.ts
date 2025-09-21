import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { database } from '@repo/database';
import { createBillingPortalSession, stripe } from '@repo/payments';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user email from Clerk to search Stripe directly
    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    
    const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
    

    let hasActiveSubscription = false;
    let subscriptionTier = 'FREE';
    let subscriptionStatus = 'inactive';
    let isInTrial = false;
    let trialEndDate = null;
    let daysRemaining = 0;
    let stripeSubscriptionData = null;

    if (userEmail) {
      try {
        // Search for customer by email in Stripe
        const customers = await stripe.customers.list({
          email: userEmail,
          limit: 1
        });

        if (customers.data.length > 0) {
          const customer = customers.data[0];

          // Get all subscriptions for this customer
          const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'all',
            limit: 10
          });

          // Find the most recent active/trialing subscription
          const activeSubscription = subscriptions.data.find(sub => 
            sub.status === 'active' || sub.status === 'trialing'
          );

          if (activeSubscription) {

            stripeSubscriptionData = activeSubscription;
            hasActiveSubscription = true;
            subscriptionStatus = activeSubscription.status;
            
            // Determine tier based on price lookup key
            const priceId = activeSubscription.items.data[0]?.price.id;
            if (priceId) {
              try {
                const price = await stripe.prices.retrieve(priceId);
                if (price.lookup_key === 'member_plan_annual') {
                  subscriptionTier = 'MEMBER';
                } else {
                  subscriptionTier = 'PRO'; // Default for other paid plans
                }
              } catch (error) {
                console.error('Error retrieving price details:', error);
                subscriptionTier = 'PRO'; // Default if price lookup fails
              }
            }
            
            // Check if in trial
            if (activeSubscription.status === 'trialing') {
              isInTrial = true;
              trialEndDate = new Date((activeSubscription as any).current_period_end * 1000);
              const now = new Date();
              const timeDiff = trialEndDate.getTime() - now.getTime();
              daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
              if (daysRemaining < 0) daysRemaining = 0;
            }
          }
        }
      } catch (error) {
        console.error('Error checking Stripe subscriptions:', error);
      }
    }

    const response = { 
      success: true,
      tier: subscriptionTier,
      status: subscriptionStatus,
      subscription: stripeSubscriptionData ? {
        status: stripeSubscriptionData.status,
        currentPeriodStart: new Date((stripeSubscriptionData as any).current_period_start * 1000),
        currentPeriodEnd: new Date((stripeSubscriptionData as any).current_period_end * 1000),
        cancelAtPeriodEnd: (stripeSubscriptionData as any).cancel_at_period_end,
      } : null,
      hasActiveSubscription: hasActiveSubscription,
      isInTrial: isInTrial,
      trialEndDate: trialEndDate,
      daysRemaining: daysRemaining,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, returnUrl } = body;

    // Find the user by Clerk ID
    const user = await database.user.findUnique({
      where: { clerkId: userId },
      include: {
        stripeSubscription: true,
      },
    });

    if (!user || !user.stripeSubscription) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    if (action === 'manage') {
      // Create billing portal session
      const session = await createBillingPortalSession(
        user.stripeSubscription.stripeCustomerId,
        returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
      );

      return NextResponse.json({ 
        success: true,
        url: session.url 
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Error managing subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
