import { database as db } from '@repo/database';
import { scheduleEvent, calculateFirstDealDate } from '../lib/event-scheduler';

// Calculate first deal date based on user's signup date and frequency
function calculateFirstDealDateForUser(frequency: string, userCreatedAt: Date): Date {
  const now = new Date();
  const userSignupDate = new Date(userCreatedAt);
  
  // Calculate how many days since user signed up
  const daysSinceSignup = Math.floor((now.getTime() - userSignupDate.getTime()) / (1000 * 60 * 60 * 24));
  
  switch (frequency) {
    case 'every_3_days':
      // Schedule for next 3-day interval from signup
      const next3Day = new Date(userSignupDate);
      const intervalsPassed = Math.floor(daysSinceSignup / 3);
      next3Day.setDate(userSignupDate.getDate() + (intervalsPassed + 1) * 3);
      next3Day.setHours(9, 0, 0, 0);
      return next3Day;
      
    case 'weekly':
      // Schedule for next 7-day interval from signup
      const nextWeekly = new Date(userSignupDate);
      const weeksPassed = Math.floor(daysSinceSignup / 7);
      nextWeekly.setDate(userSignupDate.getDate() + (weeksPassed + 1) * 7);
      nextWeekly.setHours(9, 0, 0, 0);
      return nextWeekly;
      
    case 'bi_weekly':
      // Schedule for next 14-day interval from signup
      const nextBiWeekly = new Date(userSignupDate);
      const biWeeksPassed = Math.floor(daysSinceSignup / 14);
      nextBiWeekly.setDate(userSignupDate.getDate() + (biWeeksPassed + 1) * 14);
      nextBiWeekly.setHours(9, 0, 0, 0);
      return nextBiWeekly;
      
    case 'monthly':
      // Schedule for next month from signup
      const nextMonthly = new Date(userSignupDate);
      const monthsPassed = Math.floor(daysSinceSignup / 30);
      nextMonthly.setMonth(userSignupDate.getMonth() + monthsPassed + 1);
      nextMonthly.setHours(9, 0, 0, 0);
      return nextMonthly;
      
    default:
      // Default to weekly
      const nextDefault = new Date(userSignupDate);
      const weeksPassedDefault = Math.floor(daysSinceSignup / 7);
      nextDefault.setDate(userSignupDate.getDate() + (weeksPassedDefault + 1) * 7);
      nextDefault.setHours(9, 0, 0, 0);
      return nextDefault;
  }
}

async function migrateExistingUsers() {
  console.log('🚀 Starting migration of existing users to event-driven system...');

  try {
    // Find all users with travel preferences and active subscriptions
    const users = await db.user.findMany({
      where: {
        travelPreferences: {
          isNot: null
        }
      },
      include: {
        travelPreferences: true,
        stripeSubscription: true
      }
    });

    console.log(`📊 Found ${users.length} users with travel preferences`);

    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        // Check if user already has scheduled events
        const existingEvents = await db.scheduledEvent.findMany({
          where: {
            userId: user.id,
            eventName: 'generate-deals',
            processed: false
          }
        });

        if (existingEvents.length > 0) {
          console.log(`⏭️  User ${user.id} already has scheduled events, skipping`);
          skippedCount++;
          continue;
        }

        // Check if user has active Stripe subscription
        const hasActiveSubscription = await checkUserSubscription(user);
        
        if (!hasActiveSubscription) {
          console.log(`❌ User ${user.id} has no active subscription, skipping`);
          skippedCount++;
          continue;
        }

        // Calculate first deal date based on their preferences and signup date
        const firstDealDate = calculateFirstDealDateForUser(
          user.travelPreferences!.deliveryFrequency,
          user.createdAt
        );

        // Schedule their first deal generation
        await scheduleEvent('generate-deals', {
          userId: user.id,
          frequency: user.travelPreferences!.deliveryFrequency
        }, firstDealDate);

        console.log(`✅ Migrated user ${user.id} (${user.email}) - first deal scheduled for ${firstDealDate.toISOString()}`);
        migratedCount++;

      } catch (error) {
        console.error(`❌ Error migrating user ${user.id}:`, error);
        errorCount++;
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`✅ Successfully migrated: ${migratedCount} users`);
    console.log(`⏭️  Skipped: ${skippedCount} users`);
    console.log(`❌ Errors: ${errorCount} users`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

async function checkUserSubscription(user: any): Promise<boolean> {
  try {
    const { stripe } = await import('@repo/payments');
    
    if (!stripe) {
      console.error('Stripe not available');
      return false;
    }

    let hasValidSubscription = false;

    if (user.email) {
      try {
        // Search for customer by email in Stripe (EXACT same as generate deals)
        const customers = await stripe.customers.list({
          email: user.email,
          limit: 1
        });

        if (customers.data.length > 0) {
          const customer = customers.data[0];

          // Get all subscriptions for this customer (EXACT same as generate deals)
          const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'all',
            limit: 10
          });

          // Find the most recent active/trialing subscription (EXACT same as generate deals)
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

    return hasValidSubscription;
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateExistingUsers()
    .then(() => {
      console.log('🎉 Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

export { migrateExistingUsers };
