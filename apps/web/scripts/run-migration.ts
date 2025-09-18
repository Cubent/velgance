#!/usr/bin/env tsx

import { migrateExistingUsers } from './migrate-existing-users';

async function main() {
  console.log('🚀 Running one-time migration for existing users...');
  console.log('This will schedule deal generation events for all existing users with active subscriptions.');
  console.log('');

  try {
    await migrateExistingUsers();
    console.log('\n🎉 Migration completed successfully!');
    console.log('Existing users will now receive deals according to their preferences.');
  } catch (error) {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  }
}

main();
