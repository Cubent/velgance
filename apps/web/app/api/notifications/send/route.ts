import { NextRequest, NextResponse } from 'next/server';
import { database as db } from '@repo/database';
import { sendFlightDealsEmail } from '@/services/email';
// Removed AI dependency - using simple summary generation

// Define User type based on the Prisma query result
type User = {
  id: string;
  email: string;
  name: string | null;
  travelPreferences: any;
  flightRecommendations: any[];
};

// This endpoint should be called by a cron job or scheduled task
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from an authorized source (e.g., cron job)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;
    
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { frequency } = body; // 'daily', 'every_3_days', 'weekly', 'bi_weekly', 'monthly'

    if (!frequency) {
      return NextResponse.json({ error: 'Frequency is required' }, { status: 400 });
    }

    // Find users who should receive notifications for this frequency
    const users = await db.user.findMany({
      where: {
        travelPreferences: {
          deliveryFrequency: frequency,
        },
        stripeSubscription: {
          status: 'active', // Only send to active subscribers
        },
      },
      include: {
        travelPreferences: true,
        stripeSubscription: true,
        flightRecommendations: {
          where: {
            isActive: true,
            createdAt: {
              gte: getDateThreshold(frequency), // Only recent recommendations
            },
          },
          orderBy: {
            price: 'asc', // Best deals first
          },
          take: 10, // Limit to top 10 deals per user
        },
      },
    });

    console.log(`Found ${users.length} users for ${frequency} notifications`);

    let successCount = 0;
    let errorCount = 0;

    // Process users in batches to avoid overwhelming the email service
    const batchSize = 10;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (user: User) => {
        try {
          if (!user.travelPreferences || user.flightRecommendations.length === 0) {
            console.log(`Skipping user ${user.id}: no travel preferences or recommendations`);
            return;
          }

          // Transform recommendations to email format
          const deals = user.flightRecommendations.map(rec => ({
            origin: rec.origin,
            destination: rec.destination,
            departureDate: rec.departureDate.toISOString(),
            returnDate: rec.returnDate?.toISOString(),
            price: rec.price,
            currency: rec.currency,
            airline: rec.airline,
            dealQuality: (rec.dealQuality as 'excellent' | 'good' | 'fair') || 'good',
            bookingUrl: rec.bookingUrl || undefined,
            layovers: (rec.layovers as Array<{ airport: string; duration: string }>) || [],
            duration: rec.duration || 'N/A',
            baggageInfo: (rec.baggageInfo as { carry_on: string; checked: string }) || {
              carry_on: 'Standard',
              checked: 'Standard'
            },
            confidenceScore: rec.confidenceScore || 0.8,
          }));

          // Generate simple summary for this user's deals
          const summary = generateSimpleEmailSummary(deals, {
            dreamDestinations: user.travelPreferences.dreamDestinations as string[],
            maxBudget: user.travelPreferences.maxBudget || undefined,
          });

          // Send email
          const emailData = {
            userEmail: user.email,
            userName: user.name || undefined,
            deals,
            summary,
            unsubscribeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?token=${generateUnsubscribeToken(user.id)}`,
          };

          const emailSent = await sendFlightDealsEmail(emailData);

          if (emailSent) {
            // Log the notification in the database
            await db.emailNotification.create({
              data: {
                userId: user.id,
                subject: `✈️ ${deals.length} New Flight Deal${deals.length > 1 ? 's' : ''} Found!`,
                content: summary,
                recipientEmail: user.email,
                notificationType: 'flight_deals',
                flightCount: deals.length,
                status: 'sent',
                sentAt: new Date(),
              },
            });

            successCount++;
            console.log(`Email sent successfully to ${user.email}`);
          } else {
            errorCount++;
            
            // Log failed notification
            await db.emailNotification.create({
              data: {
                userId: user.id,
                subject: `✈️ ${deals.length} New Flight Deal${deals.length > 1 ? 's' : ''} Found!`,
                content: summary,
                recipientEmail: user.email,
                notificationType: 'flight_deals',
                flightCount: deals.length,
                status: 'failed',
                failedAt: new Date(),
                errorMessage: 'Failed to send email',
              },
            });
          }
        } catch (error) {
          console.error(`Error processing user ${user.id}:`, error);
          errorCount++;
        }
      });

      await Promise.all(batchPromises);
      
      // Add delay between batches to respect rate limits
      if (i + batchSize < users.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json({
      success: true,
      message: `Notification batch completed for ${frequency}`,
      stats: {
        totalUsers: users.length,
        successCount,
        errorCount,
      },
    });

  } catch (error) {
    console.error('Error sending notifications:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}

/**
 * Get the date threshold for filtering recent recommendations
 */
function getDateThreshold(frequency: string): Date {
  const now = new Date();
  
  switch (frequency) {
    case 'daily':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
    case 'every_3_days':
      return new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
    case 'weekly':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 1 week ago
    case 'bi_weekly':
      return new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000); // 2 weeks ago
    case 'monthly':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    default:
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Default to 1 week
  }
}

/**
 * Generate a simple unsubscribe token (in production, use proper JWT or similar)
 */
function generateUnsubscribeToken(userId: string): string {
  // This is a simple implementation - in production, use proper token generation
  return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
}

/**
 * Generate a simple email summary without AI
 */
function generateSimpleEmailSummary(
  deals: any[],
  userPreferences: { dreamDestinations: string[]; maxBudget?: number }
): string {
  if (deals.length === 0) {
    return "We're working hard to find great flight deals for you. Check back soon!";
  }

  const { dreamDestinations, maxBudget } = userPreferences;
  const bestDeal = deals[0];
  const averagePrice = deals.reduce((sum, deal) => sum + deal.price, 0) / deals.length;
  const excellentDeals = deals.filter(deal => deal.dealQuality === 'excellent').length;

  let summary = `We found ${deals.length} amazing flight deals for your dream destinations: ${dreamDestinations.join(', ')}! `;
  
  if (excellentDeals > 0) {
    summary += `${excellentDeals} of these are exceptional deals with significant savings. `;
  }
  
  summary += `Our top pick is ${bestDeal.airline} from ${bestDeal.origin} to ${bestDeal.destination} for just $${bestDeal.price} on ${new Date(bestDeal.departureDate).toLocaleDateString()}. `;
  
  if (maxBudget) {
    const withinBudget = deals.filter(deal => deal.price <= maxBudget).length;
    summary += `${withinBudget} deals are within your budget of $${maxBudget}. `;
  }
  
  summary += `Average price is $${Math.round(averagePrice)}. These deals won't last long - book now to secure your savings!`;

  return summary;
}
