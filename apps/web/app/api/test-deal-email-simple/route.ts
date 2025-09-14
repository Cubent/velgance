import { NextRequest, NextResponse } from 'next/server';
import { sendBatchDealAlert } from '@/services/deal-email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail } = body;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'userEmail is required' },
        { status: 400 }
      );
    }

    console.log('Testing deal email with:', userEmail);

    const testDeal = {
      origin: 'LAX',
      destination: 'JFK',
      departureDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      returnDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString(),
      price: 299,
      currency: 'USD',
      airline: 'Delta Airlines',
      dealQuality: 'excellent' as const,
      bookingUrl: 'https://example.com/book',
    };

    const result = await sendBatchDealAlert(
      userEmail,
      'Test User',
      [testDeal],
      'Test deal notification - Great deal found!'
    );

    console.log('Deal email result:', result);

    return NextResponse.json({
      success: result,
      message: result ? 'Deal email sent successfully' : 'Failed to send deal email'
    });
  } catch (error) {
    console.error('Error testing deal email:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send deal email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
