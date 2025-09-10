import { NextResponse } from 'next/server';
import { database } from '@repo/database';

export async function GET() {
  try {
    // Test database connection
    const userCount = await database.user.count();
    const users = await database.user.findMany({
      take: 5,
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Database connection working',
      totalUsers: userCount,
      recentUsers: users,
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

export async function POST() {
  try {
    // Test webhook endpoint accessibility
    return NextResponse.json({
      success: true,
      message: 'Webhook endpoint is accessible',
      timestamp: new Date().toISOString(),
      environment: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasClerkWebhookSecret: !!process.env.CLERK_WEBHOOK_SECRET,
        hasClerkSecretKey: !!process.env.CLERK_SECRET_KEY,
      },
    });
  } catch (error) {
    console.error('Webhook test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Webhook test failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
