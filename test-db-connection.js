#!/usr/bin/env node

// Simple test script to verify database connection
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Has DATABASE_URL:', !!process.env.DATABASE_URL);
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`✅ Query successful - User count: ${userCount}`);

    // Test user creation (if needed)
    const testUser = await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    });
    
    if (testUser) {
      console.log('✅ User query successful');
    } else {
      console.log('ℹ️  No test user found (this is normal)');
    }

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection().catch(console.error);
