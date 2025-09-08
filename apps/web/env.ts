import { keys as cms } from '@repo/cms/keys';
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
    cms(),
    core(),
    email(),
    observability(),
    flags(),
    security(),
    rateLimit(),
    payments(),
  ],
  server: {
    // OpenAI Configuration
    OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),

    // SendGrid Configuration
    SENDGRID_API_KEY: z.string().min(1, 'SendGrid API key is required'),
    SENDGRID_FROM_EMAIL: z.string().email('Valid SendGrid from email is required').default('deals@travira.net'),

    // Stripe Configuration (additional to payments package)
    STRIPE_TRAVIRA_PRICE_ID: z.string().min(1, 'Stripe price ID for Travira subscription is required'),

    // Cron Job Security
    CRON_SECRET_TOKEN: z.string().min(32, 'Cron secret token must be at least 32 characters'),

    // App Configuration
    // NEXT_PUBLIC_ variables should only be in client schema
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url('Valid app URL is required').default('https://www.travira.net'),
    NEXT_PUBLIC_WEB_URL: z.string().url('Valid web URL is required').default('https://www.travira.net'),
  },
  runtimeEnv: {
    // Server-side environment variables
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
    STRIPE_TRAVIRA_PRICE_ID: process.env.STRIPE_TRAVIRA_PRICE_ID,
    CRON_SECRET_TOKEN: process.env.CRON_SECRET_TOKEN,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
  },
});
