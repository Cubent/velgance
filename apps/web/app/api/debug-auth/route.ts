import { env } from '../../env';

export async function GET() {
  try {
    return Response.json({
      // Environment variables check
      hasClerkSecret: !!env.CLERK_SECRET_KEY,
      hasClerkPublishable: !!env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      signInUrl: env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
      signUpUrl: env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
      afterSignInUrl: env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
      afterSignUpUrl: env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
      clerkDomain: env.NEXT_PUBLIC_CLERK_DOMAIN,
      environment: process.env.NODE_ENV,
      
      // Raw environment variables (for debugging)
      rawEnv: {
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? 'SET' : 'NOT SET',
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'SET' : 'NOT SET',
        NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
        NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
        NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
        NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
        NEXT_PUBLIC_CLERK_DOMAIN: process.env.NEXT_PUBLIC_CLERK_DOMAIN,
      },
      
      // Build info
      buildTime: new Date().toISOString(),
      vercelEnv: process.env.VERCEL_ENV,
      vercelUrl: process.env.VERCEL_URL,
    });
  } catch (error) {
    return Response.json({
      error: 'Failed to check auth configuration',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}