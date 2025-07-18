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

    // Get subscription data ONLY from Stripe - ignore Clerk metadata
    let subscriptionTier = 'free_trial';
    let subscriptionStatus = 'trial';

    // Get user from Clerk to access metadata
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    // Get Stripe customer ID from Clerk metadata
    const privateMetadata = clerkUser.privateMetadata;
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

    return NextResponse.json({
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.picture,
        subscriptionTier,
        subscriptionStatus,
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
