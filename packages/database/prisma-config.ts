// Prisma configuration for Vercel deployment
export const prismaConfig = {
  // Environment-specific configuration
  ...(process.env.VERCEL && {
    // Vercel-specific settings
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  }),
};
