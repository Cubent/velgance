import { auth, currentUser } from '@repo/auth/server';
import { database } from '@repo/database';
import { stripe } from '@repo/payments';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Get extension user profile
 * Returns user information and extension connection status
 */
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user profile from database
    let userProfile = await database.userProfile.findUnique({
      where: { userId },
    });

    // Get extension sessions and usage analytics separately
    const extensionSessions = await database.extensionSession.findMany({
      where: { userId, isActive: true },
      orderBy: { lastActiveAt: 'desc' },
    });

    const usageAnalytics = await database.usageAnalytics.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    // Create profile if it doesn't exist
    if (!userProfile) {
      userProfile = await database.userProfile.create({
        data: {
          userId,
          email: user.emailAddresses[0]?.emailAddress || '',
          name: user.fullName || '',
          subscriptionTier: 'FREE',
          subscriptionStatus: 'ACTIVE',
          termsAccepted: false,
        },
      });
    }

    // Get usage statistics
    const usageStats = await database.usageAnalytics.aggregate({
      where: { userId },
      _sum: {
        tokensUsed: true,
        requestsMade: true,
        costAccrued: true,
      },
    });

    // Get subscription data ONLY from Stripe - search for active subscriptions
    let subscriptionTier = 'free';
    let subscriptionStatus = 'inactive';
    let trialEndDate: Date | null = null;
    let daysLeftInTrial: number | null = null;

    // Get Stripe customer ID from Clerk metadata
    const privateMetadata = user.privateMetadata;
    const stripeCustomerId = privateMetadata.stripeCustomerId as string | null;

    if (stripeCustomerId) {
      try {
        // Search for ALL subscriptions for this customer directly from Stripe
        const subscriptions = await stripe.subscriptions.list({
          customer: stripeCustomerId,
          status: 'all',
          limit: 10
        });

        // Find the most recent active or trialing subscription
        const activeSubscription = subscriptions.data.find(sub =>
          sub.status === 'active' || sub.status === 'trialing'
        );

        if (activeSubscription) {
          subscriptionStatus = activeSubscription.status;

          // Handle trial information
          if (activeSubscription.status === 'trialing' && activeSubscription.trial_end) {
            trialEndDate = new Date(activeSubscription.trial_end * 1000);
            const now = new Date();
            const timeDiff = trialEndDate.getTime() - now.getTime();
            daysLeftInTrial = Math.ceil(timeDiff / (1000 * 3600 * 24));

            // Ensure we don't show negative days
            if (daysLeftInTrial < 0) {
              daysLeftInTrial = 0;
            }
          }

          // Get plan type from Stripe price lookup key
          if (activeSubscription.items.data.length > 0) {
            const priceId = activeSubscription.items.data[0].price.id;
            const price = await stripe.prices.retrieve(priceId);

            if (price.lookup_key) {
              subscriptionTier = price.lookup_key; // This should be 'pro', 'byak', etc.
            } else {
              // Fallback: try to determine from price amount or product name
              const product = await stripe.products.retrieve(price.product as string);
              console.log('No lookup key found, product name:', product.name);

              // Try to map product name to tier
              const productName = product.name.toLowerCase();
              if (productName.includes('pro')) {
                subscriptionTier = 'pro';
              } else if (productName.includes('byak')) {
                subscriptionTier = 'byak';
              } else if (productName.includes('enterprise')) {
                subscriptionTier = 'enterprise';
              } else {
                subscriptionTier = 'pro'; // Default to pro for paid plans
              }
            }
          }
        } else {
          // No active subscription found
          subscriptionTier = 'free';
          subscriptionStatus = 'inactive';
        }
      } catch (error) {
        console.error('Error fetching Stripe subscriptions:', error);
        // If Stripe fails, default to free
        subscriptionTier = 'free';
        subscriptionStatus = 'inactive';
      }
    }
    // If no Stripe customer ID, keep default free values

    const response = {
      user: {
        id: userId,
        name: user.fullName,
        email: user.emailAddresses[0]?.emailAddress,
        imageUrl: user.imageUrl,
      },
      profile: {
        subscriptionTier,
        subscriptionStatus,
        trialEndDate: trialEndDate?.toISOString() || null,
        daysLeftInTrial,
        termsAccepted: userProfile.termsAccepted,
        extensionEnabled: userProfile.extensionEnabled,
        settings: userProfile.settings,
      },
      usage: {
        tokensUsed: usageStats._sum.tokensUsed || 0,
        requestsMade: usageStats._sum.requestsMade || 0,
        costAccrued: usageStats._sum.costAccrued || 0,
      },
      extensionSessions: extensionSessions.length,
      lastActiveSession: extensionSessions[0]?.lastActiveAt || null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Extension profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update extension user profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { settings, extensionEnabled } = body;

    const updatedProfile = await database.userProfile.update({
      where: { userId },
      data: {
        ...(settings && { settings }),
        ...(typeof extensionEnabled === 'boolean' && { extensionEnabled }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('Extension profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
