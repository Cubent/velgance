import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { database as db } from '@repo/database';

export async function GET() {
  try {
    const { userId } = await auth();

    // Test database connection
    const userCount = await db.user.count();

    let userInfo = null;
    let clerkUserInfo = null;

    if (userId) {
      // Check if user exists in our database
      const dbUser = await db.user.findUnique({
        where: { clerkId: userId },
        include: {
          travelPreferences: true,
        },
      });

      // Get Clerk user info
      try {
        const clerkUser = await clerkClient.users.getUser(userId);
        clerkUserInfo = {
          id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
        };
      } catch (clerkError) {
        clerkUserInfo = { error: 'Failed to fetch from Clerk' };
      }

      userInfo = {
        existsInDb: !!dbUser,
        dbUser: dbUser ? {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          hasPreferences: !!dbUser.travelPreferences,
        } : null,
      };
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      totalUsers: userCount,
      currentUser: {
        clerkId: userId,
        clerkInfo: clerkUserInfo,
        dbInfo: userInfo,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Database connection failed',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
