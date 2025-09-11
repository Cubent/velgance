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
  log: process.env.NODE_ENV === 'development' ? (['query', 'error', 'warn'] as ('query' | 'error' | 'warn')[]) : (['error'] as ('error')[]),
};

// Create Prisma client with proper error handling for Vercel
let database: PrismaClient;

try {
  database = globalForPrisma.prisma || new PrismaClient(prismaOptions);
} catch (error) {
  console.error('Failed to create Prisma client:', error);
  // Fallback: create client without adapter for Vercel
  database = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? (['query', 'error', 'warn'] as ('query' | 'error' | 'warn')[]) : (['error'] as ('error')[]),
  });
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = database;
}

export { database };

export * from './generated/client';
