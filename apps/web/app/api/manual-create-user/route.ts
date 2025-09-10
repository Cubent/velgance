import { NextResponse } from 'next/server';
import { database } from '@repo/database';

export async function POST() {
  try {
    // Create a user manually to test database connection
    const newUser = await database.user.create({
      data: {
        clerkId: 'manual-test-' + Date.now(),
        email: 'manual-test@example.com',
        name: 'Manual Test User',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'User created manually',
      user: newUser,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 }
    );
  }
}
