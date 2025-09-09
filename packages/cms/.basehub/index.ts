// Temporary dummy BaseHub client for development
// Replace this with actual generated client when BaseHub token is configured

export const basehub = (config?: any) => ({
  query: async (query: any) => {
    console.warn('BaseHub client not configured. Using dummy data.');
    return {};
  },
});

export const fragmentOn = Object.assign(
  (type: string, fragment: any) => fragment,
  {
    infer: <T>(fragment: T): any => null as any,
  }
);

// Export types for compatibility
export type * from './types';
