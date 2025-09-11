import 'server-only';

import { PrismaClient } from './generated/client';
import { keys } from './keys';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Prisma client configuration optimized for Vercel
const logLevels = process.env.NODE_ENV === 'development' 
  ? ['query', 'error', 'warn'] as ('query' | 'error' | 'warn')[]
  : ['error'] as ('error')[];

// Create Prisma client with proper error handling for Vercel
let database: PrismaClient;

try {
  // Create client without adapter for now to fix build issues
  database = globalForPrisma.prisma || new PrismaClient({
    log: logLevels,
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
      log: logLevels,
    });
  } catch (fallbackError) {
    console.error('Failed to create Prisma client fallback:', fallbackError);
    // Last resort: create client with minimal configuration
    database = new PrismaClient({
      log: ['error'] as ('error')[],
    });
  }
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = database;
}

export { database };

export * from './generated/client';
