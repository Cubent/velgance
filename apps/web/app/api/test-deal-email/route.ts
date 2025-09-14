import { NextRequest, NextResponse } from 'next/server';
import { sendSingleDealAlert, sendBatchDealAlert } from '@/services/deal-email';

/**
 * Test endpoint for deal email notifications
 * This is for development/testing purposes only
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, testType = 'single' } = body;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'userEmail is required' },
        { status: 400 }
      );
    }

    // Sample deal data for testing
    const sampleDeal = {
      origin: 'LAX',
      destination: 'JFK',
      departureDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      returnDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString(), // 37 days from now
      price: 299,
      currency: 'USD',
      airline: 'Delta Airlines',
      dealQuality: 'excellent' as const,
      bookingUrl: 'https://example.com/book',
    };

    const sampleDeals = [
      sampleDeal,
      {
        origin: 'SFO',
        destination: 'LHR',
        departureDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        returnDate: new Date(Date.now() + 52 * 24 * 60 * 60 * 1000).toISOString(),
        price: 599,
        currency: 'USD',
        airline: 'British Airways',
        dealQuality: 'good' as const,
        bookingUrl: 'https://example.com/book2',
      },
    ];

    let success = false;

    if (testType === 'single') {
      success = await sendSingleDealAlert(
        userEmail,
        'Test User',
        sampleDeal,
        'Test single deal notification - Great deal found!'
      );
    } else {
      success = await sendBatchDealAlert(
        userEmail,
        'Test User',
        sampleDeals,
        'Test batch deal notification - Multiple great deals found!'
      );
    }

    if (success) {
      return NextResponse.json({
        success: true,
        message: `${testType} deal email sent successfully to ${userEmail}`,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send test email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending test deal email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
