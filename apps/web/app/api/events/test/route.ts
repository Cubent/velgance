import { NextRequest, NextResponse } from 'next/server';
import { eventBus } from '../../../../lib/event-bus';
import { scheduleEvent } from '../../../../lib/event-scheduler';

export async function POST(request: NextRequest) {
  try {
    const { eventName, userId, data } = await request.json();

    if (!eventName || !userId) {
      return NextResponse.json(
        { error: 'eventName and userId are required' },
        { status: 400 }
      );
    }

    // Emit the event immediately
    await eventBus.emit(eventName, { userId, ...data });

    // If it's a generate-deals event, also schedule it
    if (eventName === 'generate-deals') {
      const scheduledFor = new Date(Date.now() + 1000); // 1 second from now
      await scheduleEvent(eventName, { userId, ...data }, scheduledFor);
    }

    return NextResponse.json({
      success: true,
      message: `Event ${eventName} emitted successfully`,
      data: { userId, ...data }
    });

  } catch (error) {
    console.error('Error in test event API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to emit test event',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Event test API - Use POST to emit events',
    availableEvents: [
      'user.created',
      'preferences.updated', 
      'subscription.cancelled',
      'generate-deals'
    ],
    example: {
      method: 'POST',
      body: {
        eventName: 'generate-deals',
        userId: 'user_id_here',
        data: { frequency: 'weekly' }
      }
    }
  });
}
