import { database as db } from '@repo/database';
import { scheduleEvent, calculateFirstDealDate } from '../lib/event-scheduler';

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

        // Calculate first deal date based on their preferences
        const firstDealDate = calculateFirstDealDate(
          user.travelPreferences!.deliveryFrequency,
          user.travelPreferences!.timezone
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
