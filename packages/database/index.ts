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

export const database = globalForPrisma.prisma || new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = database;
}

export * from './generated/client';
