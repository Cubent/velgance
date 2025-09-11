// Vercel-specific Prisma configuration
export const vercelPrismaConfig = {
  // Ensure Prisma uses the correct engine for Vercel
  binaryTargets: ['rhel-openssl-3.0.x'],
  engineType: 'binary' as const,
  
  // Environment-specific configuration
  ...(process.env.VERCEL && {
    // Vercel-specific settings
    log: ['error'] as const,
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  }),
};
