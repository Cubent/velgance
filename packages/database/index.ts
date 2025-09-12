import 'server-only';

import { PrismaClient, Prisma } from './generated/client';
import { keys } from './keys';

// Import Neon serverless driver as fallback
let neon: any = null;
if (process.env.VERCEL) {
  try {
    neon = require('@neondatabase/serverless');
  } catch (e) {
    console.log('Neon serverless driver not available');
  }
}

// Create a unique global key for each deployment to avoid conflicts
const globalKey = process.env.VERCEL ? `prisma_${process.env.VERCEL_ENV || 'production'}` : 'prisma';
const globalForPrisma = global as unknown as { [key: string]: PrismaClient };

// Ensure Prisma can find the engine binary
if (process.env.VERCEL) {
  console.log('Vercel environment detected, searching for Prisma engine...');
  console.log('Current working directory:', process.cwd());
  console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
  console.log('VERCEL_URL:', process.env.VERCEL_URL);
  
  // Try different possible locations for the Prisma engine
  const possiblePaths = [
    // Primary locations
    '/var/task/packages/database/generated/client/query-engine-rhel-openssl-3.0.x',
    '/var/task/packages/database/generated/client/libquery_engine-rhel-openssl-3.0.x.so.node',
    '/vercel/path0/packages/database/generated/client/query-engine-rhel-openssl-3.0.x',
    '/vercel/path0/packages/database/generated/client/libquery_engine-rhel-openssl-3.0.x.so.node',
    // App-specific locations
    '/var/task/apps/web/.prisma/client/query-engine-rhel-openssl-3.0.x',
    '/var/task/apps/web/generated/client/query-engine-rhel-openssl-3.0.x',
    '/var/task/apps/web/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node',
    '/var/task/apps/web/generated/client/libquery_engine-rhel-openssl-3.0.x.so.node',
    '/var/task/apps/app/.prisma/client/query-engine-rhel-openssl-3.0.x',
    '/var/task/apps/app/generated/client/query-engine-rhel-openssl-3.0.x',
    '/var/task/apps/app/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node',
    '/var/task/apps/app/generated/client/libquery_engine-rhel-openssl-3.0.x.so.node',
  ];
  
  // Set the first available path
  let engineFound = false;
  for (const path of possiblePaths) {
    try {
      const fs = require('fs');
      if (fs.existsSync(path)) {
        process.env.PRISMA_QUERY_ENGINE_BINARY = path;
        console.log(`Found Prisma engine at: ${path}`);
        engineFound = true;
        break;
      }
    } catch (e) {
      // Continue to next path
    }
  }
  
  if (!engineFound) {
    console.log('No Prisma engine found in any of the expected locations');
    console.log('Available paths checked:', possiblePaths);
    console.log('This may cause database connection issues in production');
  }
}

// Create Prisma client with proper error handling for Vercel
let database: PrismaClient;

try {
  // Create client with proper configuration for Vercel
  const clientConfig: any = {
    datasources: {
      db: {
        url: keys().DATABASE_URL,
      },
    },
  };

  // Add adapter configuration for Vercel
  if (process.env.VERCEL) {
    if (neon) {
      // Use Neon serverless driver as fallback
      clientConfig.adapter = new neon.NeonHttpDatabaseAdapter(neon.neon(keys().DATABASE_URL));
    }
  }

  database = globalForPrisma[globalKey] || new PrismaClient(clientConfig);
} catch (error) {
  console.error('Failed to create Prisma client:', error);
  // Fallback: create client with minimal configuration
  try {
    database = new PrismaClient({
      datasources: {
        db: {
          url: keys().DATABASE_URL,
        },
      },
    });
  } catch (fallbackError) {
    console.error('Failed to create Prisma client fallback:', fallbackError);
    // Last resort: create client with minimal configuration
    database = new PrismaClient();
  }
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma[globalKey] = database;
}

export { database };

export * from './generated/client';

// Re-export PrismaClient for easier imports
export { PrismaClient } from './generated/client';
