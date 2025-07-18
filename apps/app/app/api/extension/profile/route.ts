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

    // Get subscription data ONLY from Stripe - ignore Clerk metadata
    let subscriptionTier = 'free_trial';
    let subscriptionStatus = 'trial';

    // Get Stripe customer ID from Clerk metadata
    const privateMetadata = user.privateMetadata;
    const stripeCustomerId = privateMetadata.stripeCustomerId as string | null;
    const stripeSubscriptionId = privateMetadata.stripeSubscriptionId as string | null;

    if (stripeCustomerId && stripeSubscriptionId) {
      try {
        // Get subscription from Stripe
        const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        subscriptionStatus = subscription.status;

        // Only set paid plan if subscription is actually active
        if (subscription.status === 'active' || subscription.status === 'trialing') {
          // Get plan type ONLY from Stripe price lookup key - ignore Clerk metadata
          if (subscription.items.data.length > 0) {
            const priceId = subscription.items.data[0].price.id;
            const price = await stripe.prices.retrieve(priceId);

            if (price.lookup_key) {
              subscriptionTier = price.lookup_key;
            } else {
              // If no lookup key, stay as free_trial
              subscriptionTier = 'free_trial';
              subscriptionStatus = 'trial';
            }
          } else {
            // No subscription items, stay as free_trial
            subscriptionTier = 'free_trial';
            subscriptionStatus = 'trial';
          }
        } else {
          // Subscription exists but is not active (canceled, past_due, etc.)
          subscriptionTier = 'free_trial';
          subscriptionStatus = 'trial';
        }
      } catch (error) {
        console.error('Error fetching Stripe subscription:', error);
        // If Stripe fails, default to free trial
        subscriptionTier = 'free_trial';
        subscriptionStatus = 'trial';
      }
    }
    // If no Stripe data at all, keep default free_trial values

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
