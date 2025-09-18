import { NextRequest, NextResponse } from 'next/server';

// This endpoint is now deprecated - use the new event-driven system instead
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: false,
    message: 'This endpoint is deprecated. Use the new event-driven system at /api/events/process-scheduled',
    migration: {
      oldEndpoint: '/api/deals/generate-scheduled',
      newEndpoint: '/api/events/process-scheduled',
      reason: 'Event-driven architecture provides better scalability and reliability'
    }
  }, { status: 410 }); // 410 Gone
}

export async function POST(request: NextRequest) {
  return GET(request);
}
