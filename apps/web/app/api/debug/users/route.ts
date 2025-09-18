import { NextResponse } from 'next/server';
import { database as db } from '@repo/database';

export async function GET() {
  try {
    // Find all users with travel preferences
    const users = await db.user.findMany({
      where: {
        travelPreferences: {
          isNot: null
        }
      },
      include: {
        travelPreferences: true,
        stripeSubscription: true
      }
    });

    // Check existing scheduled events
    const existingEvents = await db.scheduledEvent.findMany({
      where: {
        eventName: 'generate-deals',
        processed: false
      }
    });

    return NextResponse.json({
      totalUsers: users.length,
      usersWithPreferences: users.length,
      existingScheduledEvents: existingEvents.length,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        hasPreferences: !!user.travelPreferences,
        deliveryFrequency: user.travelPreferences?.deliveryFrequency,
        hasStripeSubscription: !!user.stripeSubscription,
        stripeStatus: user.stripeSubscription?.status
      })),
      scheduledEvents: existingEvents.map(event => ({
        id: event.id,
        userId: event.userId,
        eventName: event.eventName,
        scheduledFor: event.scheduledFor,
        processed: event.processed
      }))
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to debug users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
