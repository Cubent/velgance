// Type-safe Prisma logging configuration
export const createPrismaLogConfig = (isDevelopment: boolean) => {
  if (isDevelopment) {
    return ['query', 'error', 'warn'] as const;
  }
  return ['error'] as const;
};

// Pre-configured log levels for different environments
export const prismaLogLevels = {
  development: ['query', 'error', 'warn'] as const,
  production: ['error'] as const,
} as const;
