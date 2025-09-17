import { NextRequest, NextResponse } from 'next/server';
import { database as db } from '@repo/database';
import { getFlightRecommendations, FlightSearchParams } from '@/services/amadeus';
import { sendBatchDealAlert } from '@/services/deal-email';
import { stripe } from '@repo/payments';
import { clerkClient } from '@clerk/nextjs/server';

// This endpoint should be called by cron jobs based on frequency
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from an authorized source (cron job)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;
    
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get frequency from URL query parameter
    const url = new URL(request.url);
    const frequency = url.searchParams.get('frequency');

    if (!frequency) {
      return NextResponse.json({ error: 'Frequency is required' }, { status: 400 });
    }

    console.log(`Starting scheduled deal generation for frequency: ${frequency}`);

    // Find users who should receive deals for this frequency
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
      },
    });

    console.log(`Found ${users.length} users for ${frequency} deal generation`);

    let successCount = 0;
    let errorCount = 0;

    // Process users in batches to avoid overwhelming the system
    const batchSize = 5;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (user) => {
        try {
          if (!user.travelPreferences) {
            console.log(`Skipping user ${user.id}: no travel preferences`);
            return;
          }

          // Check if user has valid Stripe subscription
          const client = await clerkClient();
          const clerkUser = await client.users.getUser(user.clerkId);
          const userEmail = clerkUser.emailAddresses[0]?.emailAddress;

          let hasValidSubscription = false;
          if (userEmail) {
            try {
              const customers = await stripe.customers.list({
                email: userEmail,
                limit: 1
              });

              if (customers.data.length > 0) {
                const customer = customers.data[0];
                const subscriptions = await stripe.subscriptions.list({
                  customer: customer.id,
                  status: 'all',
                  limit: 10
                });

                const activeSubscription = subscriptions.data.find(sub => 
                  sub.status === 'active' || sub.status === 'trialing'
                );

                if (activeSubscription) {
                  hasValidSubscription = true;
                }
              }
            } catch (error) {
              console.error(`Error checking Stripe subscription for user ${user.id}:`, error);
            }
          }

          if (!hasValidSubscription) {
            console.log(`Skipping user ${user.id}: no valid subscription`);
            return;
          }

          // Convert user preferences to flight search parameters
          const searchParams: FlightSearchParams = {
            homeAirports: user.travelPreferences.homeAirports as string[] || [],
            dreamDestinations: user.travelPreferences.dreamDestinations as string[] || [],
            travelFlexibility: user.travelPreferences.travelFlexibility || 3,
            currency: user.travelPreferences.currency || 'USD',
          };

          console.log(`Generating deals for user ${user.id} with params:`, searchParams);

          // Generate flight recommendations
          const amadeusResponse = await getFlightRecommendations(searchParams, user.id);
          
          if (!amadeusResponse.deals || amadeusResponse.deals.length === 0) {
            console.log(`No deals found for user ${user.id}`);
            return;
          }

          // Save new recommendations to database (5-10 deals)
          const dealsToSave = amadeusResponse.deals.slice(0, 10);
          const savedRecommendations = await Promise.all(
            dealsToSave.map(async (deal) => {
              const destinationActivities = amadeusResponse.cityData[deal.destination]?.activities || [];
              
              const finalActivities = destinationActivities.length > 0 ? destinationActivities : [
                `Explore the vibrant culture of ${deal.destination}`,
                `Discover historic landmarks and modern attractions`,
                `Indulge in authentic local cuisine`,
                `Experience the unique local lifestyle`,
                `Create unforgettable travel memories`
              ];
              
              return await db.flightRecommendation.create({
                data: {
                  userId: user.id,
                  origin: deal.origin,
                  destination: deal.destination,
                  departureDate: new Date(deal.departureDate),
                  returnDate: deal.returnDate ? new Date(deal.returnDate) : null,
                  price: deal.price,
                  currency: deal.currency,
                  airline: deal.airline,
                  flightNumber: deal.flightNumber,
                  layovers: deal.layovers,
                  duration: deal.duration,
                  baggageInfo: deal.baggageInfo,
                  aiSummary: amadeusResponse.summary,
                  bookingUrl: deal.bookingUrl,
                  otaUrl: deal.bookingUrl,
                  cityImageUrl: deal.cityImageUrl,
                  cityActivities: finalActivities,
                  isActive: true,
                  isWatched: false,
                },
              });
            })
          );

          // Send email notification
          if (savedRecommendations.length > 0) {
            try {
              const dealsForEmail = savedRecommendations.map(deal => ({
                origin: deal.origin,
                destination: deal.destination,
                departureDate: deal.departureDate.toISOString(),
                returnDate: deal.returnDate?.toISOString(),
                price: deal.price,
                currency: deal.currency,
                airline: deal.airline,
                dealQuality: deal.dealQuality as 'excellent' | 'good' | 'fair' | undefined,
                bookingUrl: deal.bookingUrl || undefined,
                cityImageUrl: deal.cityImageUrl || undefined,
                cityActivities: Array.isArray(deal.cityActivities) ? deal.cityActivities as string[] : undefined,
              }));

              const summary = amadeusResponse.summary || 
                `Found ${savedRecommendations.length} new flight deals matching your preferences!`;

              await sendBatchDealAlert(
                user.email,
                user.name || undefined,
                dealsForEmail,
                summary,
                amadeusResponse.cityData
              );

              console.log(`✅ Generated and sent ${savedRecommendations.length} deals to ${user.email}`);
              successCount++;
            } catch (emailError) {
              console.error(`Failed to send email to user ${user.id}:`, emailError);
              errorCount++;
            }
          }

        } catch (error) {
          console.error(`Error processing user ${user.id}:`, error);
          errorCount++;
        }
      });

      // Wait for batch to complete before processing next batch
      await Promise.all(batchPromises);
      
      // Add small delay between batches to avoid rate limiting
      if (i + batchSize < users.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`Scheduled deal generation completed for ${frequency}: ${successCount} successful, ${errorCount} errors`);

    return NextResponse.json({
      success: true,
      frequency,
      usersProcessed: users.length,
      successful: successCount,
      errors: errorCount,
      message: `Generated deals for ${successCount} users with ${frequency} frequency`
    });

  } catch (error) {
    console.error('Error in scheduled deal generation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate scheduled deals',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
