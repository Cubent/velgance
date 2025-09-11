import 'server-only';

import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import { PrismaClient } from './generated/client';
import { keys } from './keys';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: keys().DATABASE_URL });
const adapter = new PrismaNeon(pool);

// Prisma client configuration optimized for Vercel
const prismaOptions = {
  adapter,
  log: process.env.NODE_ENV === 'development' ? (['query', 'error', 'warn'] as const) : (['error'] as const),
  // Ensure proper engine configuration for Vercel
  datasources: {
    db: {
      url: keys().DATABASE_URL,
    },
  },
};

// Create Prisma client with proper error handling for Vercel
let database: PrismaClient;

try {
  database = globalForPrisma.prisma || new PrismaClient(prismaOptions);
} catch (error) {
  console.error('Failed to create Prisma client with adapter:', error);
  // Fallback: create client without adapter for Vercel
  try {
    database = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? (['query', 'error', 'warn'] as const) : (['error'] as const),
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
      log: (['error'] as const),
    });
  }
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = database;
}

export { database };

export * from './generated/client';
