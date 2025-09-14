import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { database } from '@repo/database';
import { convertCurrency } from '@/services/currency';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user by Clerk ID
    const user = await database.user.findUnique({
      where: { clerkId: userId },
      include: {
        travelPreferences: true,
        flightRecommendations: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's preferred currency
    const userCurrency = user.travelPreferences?.currency || 'USD';
    
    // Transform database records to match frontend interface with currency conversion
    const recommendations = await Promise.all(
      user.flightRecommendations.map(async (rec: any) => {
        let convertedPrice = rec.price;
        let displayCurrency = rec.currency;
        
        // Convert currency if different from user's preference
        if (rec.currency !== userCurrency) {
          try {
            const conversion = await convertCurrency(rec.price, rec.currency, userCurrency);
            convertedPrice = conversion.convertedPrice;
            displayCurrency = userCurrency;
          } catch (error) {
            console.error('Error converting currency:', error);
            // Keep original price if conversion fails
          }
        }
        
        return {
          id: rec.id,
          origin: rec.origin,
          destination: rec.destination,
          departureDate: rec.departureDate.toISOString(),
          returnDate: rec.returnDate?.toISOString(),
          price: convertedPrice,
          currency: displayCurrency,
          originalPrice: rec.currency !== userCurrency ? rec.price : undefined,
          originalCurrency: rec.currency !== userCurrency ? rec.currency : undefined,
          airline: rec.airline,
          flightNumber: rec.flightNumber,
          layovers: rec.layovers as Array<{ airport: string; duration: string }>,
          duration: rec.duration,
          baggageInfo: rec.baggageInfo as { carry_on: string; checked: string },
          aiSummary: rec.aiSummary,
          confidenceScore: rec.confidenceScore,
          dealQuality: rec.dealQuality,
          bookingUrl: rec.bookingUrl,
          otaUrl: rec.otaUrl,
          cityImageUrl: rec.cityImageUrl,
          isWatched: rec.isWatched,
        };
      })
    );

    return NextResponse.json({ 
      success: true, 
      recommendations 
    });

  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
