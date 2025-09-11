import 'server-only';

import { PrismaClient } from './generated/client';
import { keys } from './keys';
import { prismaConfig } from './prisma-config';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Prisma client configuration optimized for Vercel
const logLevels: ('query' | 'error' | 'warn')[] = process.env.NODE_ENV === 'development' 
  ? ['query', 'error', 'warn'].slice()
  : ['error'].slice();

// Create Prisma client with proper error handling for Vercel
let database: PrismaClient;

try {
  // Create client with proper configuration for Vercel
  database = globalForPrisma.prisma || new PrismaClient({
    log: logLevels,
    datasources: {
      db: {
        url: keys().DATABASE_URL,
      },
    },
    // Use Vercel-specific configuration
    ...prismaConfig,
  });
} catch (error) {
  console.error('Failed to create Prisma client:', error);
  // Fallback: create client with minimal configuration
  try {
    database = new PrismaClient({
      log: logLevels,
      datasources: {
        db: {
          url: keys().DATABASE_URL,
        },
      },
    });
  } catch (fallbackError) {
    console.error('Failed to create Prisma client fallback:', fallbackError);
    // Last resort: create client with minimal configuration
    database = new PrismaClient({
      log: ['error'],
    });
  }
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = database;
}

export { database };

export * from './generated/client';

// Re-export PrismaClient for easier imports
export { PrismaClient } from './generated/client';
