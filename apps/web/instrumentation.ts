import { initializeSentry } from '@repo/observability/instrumentation';
import * as Sentry from '@sentry/nextjs';

export const register = initializeSentry();

export function onRequestError(err: unknown, request: { url?: string }) {
  Sentry.captureRequestError(err, request);
}
