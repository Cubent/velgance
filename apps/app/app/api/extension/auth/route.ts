import { auth, currentUser, clerkClient } from '@repo/auth/server';
import { database } from '@repo/database';
import { stripe } from '@repo/payments';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const authRequestSchema = z.object({
  extensionVersion: z.string(),
  sessionId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { extensionVersion, sessionId } = authRequestSchema.parse(body);

    // Find or create user in database
    let dbUser = await database.user.findUnique({
      where: { clerkId: userId },
      include: {
        extensionSessions: {
          where: { isActive: true },
        },
      },
    });

    if (!dbUser) {
      // Create new user
      dbUser = await database.user.create({
        data: {
          clerkId: userId,
          email: user.emailAddresses[0]?.emailAddress || '',
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
          picture: user.imageUrl,
        },
        include: {
          extensionSessions: {
            where: { isActive: true },
          },
        },
      });
    }

    // Check if user has accepted terms
    if (!dbUser.termsAccepted) {
      return NextResponse.json(
        { 
          error: 'Terms not accepted',
          requiresTermsAcceptance: true,
          redirectUrl: '/terms'
        },
        { status: 403 }
      );
    }

    // Create or update extension session
    await database.extensionSession.upsert({
      where: {
        userId_sessionId: {
          userId: dbUser.id,
          sessionId,
        },
      },
      update: {
        isActive: true,
        lastActiveAt: new Date(),
      },
      create: {
        userId: dbUser.id,
        sessionId,
        isActive: true,
        lastActiveAt: new Date(),
      },
    });

    // Update last extension sync
    await database.user.update({
      where: { id: dbUser.id },
      data: { lastExtensionSync: new Date() },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.picture,
        subscriptionTier: dbUser.subscriptionTier,
        subscriptionStatus: dbUser.subscriptionStatus,
        extensionSettings: dbUser.extensionSettings,
        preferences: dbUser.preferences,
      },
      extensionApiKey: dbUser.extensionApiKey,
    });

  } catch (error) {
    console.error('Extension auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check for Bearer token in Authorization header
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      // Extension is using custom token (Clerk session ID)
      const token = authHeader.substring(7);

      // Find the pending login with this token to get the user
      const pendingLogin = await database.pendingLogin.findFirst({
        where: {
          token,
          expiresAt: { gt: new Date() }, // Not expired
        },
      });

      if (pendingLogin) {
        // Token is valid, get the user ID from the pending login record
        userId = pendingLogin.userId;
      } else {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
    } else {
      // Fallback to regular Clerk auth for web requests
      const authResult = await auth();
      userId = authResult.userId;
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
      include: {
        extensionSessions: {
          where: { isActive: true },
          orderBy: { lastActiveAt: 'desc' },
        },
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get subscription data ONLY from Stripe - search for active subscriptions
    let subscriptionTier = 'free';
    let subscriptionStatus = 'inactive';
    let trialEndDate: Date | null = null;
    let daysLeftInTrial: number | null = null;

    // Get user from Clerk to access metadata
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    // Get Stripe customer ID from Clerk metadata
    const privateMetadata = clerkUser.privateMetadata;
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
              subscriptionTier = price.lookup_key; // This should be 'pro', 'byok', etc.
            } else {
              // Fallback: try to determine from price amount or product name
              const product = await stripe.products.retrieve(price.product as string);
              console.log('No lookup key found, product name:', product.name);

              // Try to map product name to tier
              const productName = product.name.toLowerCase();
              if (productName.includes('pro')) {
                subscriptionTier = 'pro';
              } else if (productName.includes('byok')) {
                subscriptionTier = 'byok';
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

    return NextResponse.json({
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.picture,
        subscriptionTier,
        subscriptionStatus,
        trialEndDate: trialEndDate?.toISOString() || null,
        daysLeftInTrial,
        termsAccepted: dbUser.termsAccepted,
        lastExtensionSync: dbUser.lastExtensionSync,
      },
      activeSessions: dbUser.extensionSessions.length,
      isExtensionConnected: dbUser.extensionSessions.length > 0,
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
