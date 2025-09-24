import { keys as auth } from '@repo/auth/keys';
import { keys as database } from '@repo/database/keys';
import { keys as email } from '@repo/email/keys';
import { keys as flags } from '@repo/feature-flags/keys';
import { keys as core } from '@repo/next-config/keys';
import { keys as observability } from '@repo/observability/keys';
import { keys as rateLimit } from '@repo/rate-limit/keys';
import { keys as security } from '@repo/security/keys';
import { keys as payments } from '@repo/payments/keys';
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  extends: [
    auth(),
    database(),
    core(),
    email(),
    observability(),
    flags(),
    security(),
    rateLimit(),
    payments(),
  ],
  server: {

    // SendGrid Configuration
    SENDGRID_API_KEY: z.string().min(1, 'SendGrid API key is required').optional(),
    SENDGRID_FROM_EMAIL: z.string().email('Valid SendGrid from email is required').default('deals@travira.org').optional(),

    // Stripe Configuration (additional to payments package)
    STRIPE_TRAVIRA_PRICE_ID: z.string().min(1, 'Stripe price ID for Travira subscription is required').optional(),

    // Cron Job Security
    CRON_SECRET_TOKEN: z.string().min(32, 'Cron secret token must be at least 32 characters').optional(),

    // App Configuration
    // NEXT_PUBLIC_ variables should only be in client schema
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url('Valid app URL is required').default('https://travira-web.vercel.app'),
    NEXT_PUBLIC_WEB_URL: z.string().url('Valid web URL is required').default('https://travira-web.vercel.app'),
  },
  runtimeEnv: {
    // Server-side environment variables
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
    STRIPE_TRAVIRA_PRICE_ID: process.env.STRIPE_TRAVIRA_PRICE_ID,
    CRON_SECRET_TOKEN: process.env.CRON_SECRET_TOKEN,

    // Client-side environment variables (must be prefixed with NEXT_PUBLIC_)
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
  },
});
