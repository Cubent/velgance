// Type-safe Prisma logging configuration
export const createPrismaLogConfig = (isDevelopment: boolean): ('query' | 'error' | 'warn')[] => {
  if (isDevelopment) {
    return ['query', 'error', 'warn'];
  }
  return ['error'];
};

// Pre-configured log levels for different environments
export const prismaLogLevels = {
  development: ['query', 'error', 'warn'] as const,
  production: ['error'] as const,
} as const;
