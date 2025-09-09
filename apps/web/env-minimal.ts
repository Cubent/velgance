import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().default('https://travira-web.vercel.app'),
    NEXT_PUBLIC_WEB_URL: z.string().url().default('https://travira-web.vercel.app'),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
  },
});
