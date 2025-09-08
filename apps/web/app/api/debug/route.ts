import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { database as db } from '@repo/database';

export async function GET() {
  try {
    const { userId } = await auth();
    
    const debugInfo: any = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasUserId: !!userId,
      userId: userId || null,
    };

    // Test database connection
    try {
      const userCount = await db.user.count();
      debugInfo.database = {
        connected: true,
        totalUsers: userCount,
      };
    } catch (dbError) {
      debugInfo.database = {
        connected: false,
        error: dbError instanceof Error ? dbError.message : 'Unknown database error',
      };
    }

    // Test Clerk connection
    if (userId) {
      try {
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);
        debugInfo.clerk = {
          connected: true,
          userExists: true,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
        };
      } catch (clerkError) {
        debugInfo.clerk = {
          connected: false,
          error: clerkError instanceof Error ? clerkError.message : 'Unknown Clerk error',
        };
      }

      // Check if user exists in database
      if (debugInfo.database.connected) {
        try {
          const dbUser = await db.user.findUnique({
            where: { clerkId: userId },
            include: {
              travelPreferences: true,
            },
          });

          debugInfo.userInDb = {
            exists: !!dbUser,
            hasPreferences: !!dbUser?.travelPreferences,
            user: dbUser ? {
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name,
            } : null,
          };
        } catch (userError) {
          debugInfo.userInDb = {
            error: userError instanceof Error ? userError.message : 'Unknown user query error',
          };
        }
      }
    }

    // Test environment variables
    debugInfo.env = {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...',
      hasClerkSecretKey: !!process.env.CLERK_SECRET_KEY,
    };

    return NextResponse.json(debugInfo);

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Debug endpoint failed',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
