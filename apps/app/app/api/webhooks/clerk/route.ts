import { NextResponse } from 'next/server';

// Simple GET method for testing webhook endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Clerk webhook endpoint is accessible and ready for POST requests',
    timestamp: new Date().toISOString(),
    methods: ['GET', 'POST'],
    status: 'ACTIVE',
    route: '/api/webhooks/clerk'
  });
}

// Simple POST method for webhook testing
export async function POST(request: Request) {
  try {
    console.log('🔔 Webhook POST received');
    return NextResponse.json({
      message: 'Webhook received successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
