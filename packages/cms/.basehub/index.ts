// Temporary dummy BaseHub client for development
// Replace this with actual generated client when BaseHub token is configured

export const basehub = (config?: any) => ({
  query: async (query: any) => {
    console.warn('BaseHub client not configured. Using dummy data.');
    return {};
  },
});

// Create a proper namespace for fragmentOn
function fragmentOnFunction(type: string, fragment: any) {
  return fragment;
}

// Define the namespace with infer method
namespace fragmentOnFunction {
  export function infer<T>(fragment: T): any {
    return null as any;
  }
}

export const fragmentOn = fragmentOnFunction;

// Export types for compatibility
export type * from './types';
