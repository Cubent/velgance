import { initializeSentry } from '@repo/observability/instrumentation';
import * as Sentry from '@sentry/nextjs';

export const register = initializeSentry();

export function onRequestError(err: unknown, request: { url?: string }) {
  // Convert request to the format expected by Sentry
  const requestInfo = {
    path: request.url || '/',
    method: 'GET', // Default method since it's not provided
    headers: {},
  };
  Sentry.captureRequestError(err, requestInfo, {});
}
