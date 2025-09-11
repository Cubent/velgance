import 'server-only';

import { PrismaClient, Prisma } from './generated/client';
import { keys } from './keys';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

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
