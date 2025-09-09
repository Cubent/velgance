import { initializeSentry } from '@repo/observability/instrumentation';

export const register = initializeSentry();

export function onRequestError(err: unknown, request: { url?: string }) {
  // Log the error for debugging
  console.error('Request error:', err, 'URL:', request.url);
}
