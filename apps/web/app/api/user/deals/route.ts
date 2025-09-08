import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, return mock data since we don't have actual flight deals yet
    // In a real implementation, this would fetch from a flight deals table
    const mockDeals = [
      {
        id: '1',
        origin: 'LAX - Los Angeles',
        destination: 'Tokyo, Japan',
        price: 450,
        originalPrice: 850,
        savings: 400,
        airline: 'Japan Airlines',
        departureDate: '2024-03-15',
        returnDate: '2024-03-25',
        bookingUrl: 'https://example.com/book/1',
        createdAt: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        origin: 'JFK - New York',
        destination: 'Paris, France',
        price: 320,
        originalPrice: 650,
        savings: 330,
        airline: 'Air France',
        departureDate: '2024-04-10',
        returnDate: '2024-04-20',
        bookingUrl: 'https://example.com/book/2',
        createdAt: '2024-01-14T15:30:00Z',
      },
      {
        id: '3',
        origin: 'SFO - San Francisco',
        destination: 'London, United Kingdom',
        price: 380,
        originalPrice: 720,
        savings: 340,
        airline: 'British Airways',
        departureDate: '2024-05-05',
        returnDate: '2024-05-15',
        bookingUrl: 'https://example.com/book/3',
        createdAt: '2024-01-13T09:15:00Z',
      },
    ];

    return NextResponse.json(mockDeals);
  } catch (error) {
    console.error('Error fetching user deals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
