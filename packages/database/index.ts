import 'server-only';

import { PrismaClient, Prisma } from './generated/client';
import { keys } from './keys';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Ensure Prisma can find the engine binary
if (process.env.VERCEL) {
  // Try different possible locations for the Prisma engine
  const possiblePaths = [
    '/var/task/apps/web/.prisma/client/query-engine-rhel-openssl-3.0.x',
    '/var/task/apps/web/generated/client/query-engine-rhel-openssl-3.0.x',
    '/var/task/apps/web/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node',
    '/var/task/apps/web/generated/client/libquery_engine-rhel-openssl-3.0.x.so.node',
    '/vercel/path0/packages/database/generated/client/query-engine-rhel-openssl-3.0.x',
    '/vercel/path0/packages/database/generated/client/libquery_engine-rhel-openssl-3.0.x.so.node',
  ];
  
  // Set the first available path
  for (const path of possiblePaths) {
    try {
      const fs = require('fs');
      if (fs.existsSync(path)) {
        process.env.PRISMA_QUERY_ENGINE_BINARY = path;
        console.log(`Found Prisma engine at: ${path}`);
        break;
      }
    } catch (e) {
      // Continue to next path
    }
  }
}

// Create Prisma client with proper error handling for Vercel
let database: PrismaClient;

try {
  // Create client with proper configuration for Vercel
  database = globalForPrisma.prisma || new PrismaClient({
    datasources: {
      db: {
        url: keys().DATABASE_URL,
      },
    },
  });
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
  globalForPrisma.prisma = database;
}

export { database };

export * from './generated/client';

// Re-export PrismaClient for easier imports
export { PrismaClient } from './generated/client';
