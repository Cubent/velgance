import { eventBus } from './event-bus';
import { scheduleEvent, cancelScheduledEvents, calculateNextDealDate } from './event-scheduler';

// Event handler for when a user is created
async function onUserCreated(user: any) {
  console.log(`👤 User created: ${user.id}`);
  
  const { id, travelPreferences } = user;
  
  if (travelPreferences?.deliveryFrequency) {
    const firstDealDate = calculateNextDealDate(
      travelPreferences.deliveryFrequency,
      travelPreferences.timezone
    );
    
    await scheduleEvent('generate-deals', {
      userId: id,
      frequency: travelPreferences.deliveryFrequency
    }, firstDealDate);
    
    console.log(`📅 Scheduled first deal generation for user ${id} on ${firstDealDate.toISOString()}`);
  }
}

// Event handler for when user preferences are updated
async function onPreferencesUpdated(data: { userId: string; frequency: string }) {
  console.log(`⚙️ Preferences updated for user ${data.userId}: ${data.frequency}`);
  
  const { userId, frequency } = data;
  
  // Cancel old scheduled events
  await cancelScheduledEvents(userId, 'generate-deals');
  
  // Schedule new events
  const nextDealDate = calculateNextDealDate(frequency);
  await scheduleEvent('generate-deals', {
    userId,
    frequency
  }, nextDealDate);
  
  console.log(`📅 Rescheduled deal generation for user ${userId} on ${nextDealDate.toISOString()}`);
}

// Event handler for when subscription is cancelled
async function onSubscriptionCancelled(data: { userId: string }) {
  console.log(`🚫 Subscription cancelled for user ${data.userId}`);
  
  const { userId } = data;
  
  // Cancel all future deal generations
  await cancelScheduledEvents(userId, 'generate-deals');
  
  console.log(`❌ Cancelled all scheduled deal generations for user ${userId}`);
}

// Event handler for when it's time to generate deals
async function onGenerateDeals(data: { userId: string; frequency: string; user: any }) {
  console.log(`🎯 Generating deals for user ${data.userId} (${data.frequency})`);
  
  const { userId, user } = data;
  
  try {
    // Check if user has active subscription
    const hasActiveSubscription = await checkUserSubscription(user);
    
    if (!hasActiveSubscription) {
      console.log(`❌ User ${userId} does not have active subscription, skipping deal generation`);
      return;
    }
    
    // Generate deals by calling our existing API
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/recommendations/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CRON_SECRET_TOKEN || 'internal'}`
      },
      body: JSON.stringify({ userId })
    });
    
    if (!response.ok) {
      throw new Error(`Deal generation failed: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log(`✅ Generated ${result.deals?.length || 0} deals for user ${userId}`);
    
    // Schedule next deal generation
    const nextDealDate = calculateNextDealDate(data.frequency);
    await scheduleEvent('generate-deals', {
      userId,
      frequency: data.frequency
    }, nextDealDate);
    
    console.log(`📅 Scheduled next deal generation for user ${userId} on ${nextDealDate.toISOString()}`);
    
  } catch (error) {
    console.error(`❌ Error generating deals for user ${userId}:`, error);
    
    // Still schedule next attempt (with some delay)
    const retryDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Retry in 24 hours
    await scheduleEvent('generate-deals', {
      userId,
      frequency: data.frequency
    }, retryDate);
    
    console.log(`🔄 Scheduled retry for user ${userId} on ${retryDate.toISOString()}`);
  }
}

// Helper function to check user subscription
async function checkUserSubscription(user: any): Promise<boolean> {
  try {
    // Check Stripe directly for active subscription
    const stripe = require('@repo/payments').stripe;
    
    if (!stripe) {
      console.error('Stripe not available');
      return false;
    }
    
    // Get customer by email
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    });
    
    if (customers.data.length === 0) {
      return false;
    }
    
    const customer = customers.data[0];
    
    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1
    });
    
    return subscriptions.data.length > 0;
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
}

// Register all event handlers
export function setupEventHandlers() {
  console.log('🔧 Setting up event handlers...');
  
  eventBus.on('user.created', onUserCreated);
  eventBus.on('preferences.updated', onPreferencesUpdated);
  eventBus.on('subscription.cancelled', onSubscriptionCancelled);
  eventBus.on('generate-deals', onGenerateDeals);
  
  console.log('✅ Event handlers registered');
}

// Initialize event handlers when this module is imported
setupEventHandlers();

