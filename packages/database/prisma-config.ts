// Prisma configuration for Vercel deployment
export const prismaConfig = {
  // Ensure proper engine configuration for Vercel
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
