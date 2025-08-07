import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { SignUp } from '@repo/auth/components/sign-up';
import { redirect } from 'next/navigation';

const title = 'Create an account';
const description = 'Enter your details to get started.';

export const metadata: Metadata = createMetadata({ title, description });

type SignUpPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const SignUpPage = async ({ searchParams }: SignUpPageProps) => {
  const params = await searchParams;

  // Handle device OAuth flow - redirect to login page with device parameters
  if (params.device_id && params.state) {
    redirect(`/login?device_id=${params.device_id}&state=${params.state}`);
  }

  // Handle redirect_url parameter by updating the fallback redirect URL
  let fallbackRedirectUrl = '/auth-success';
  if (params.redirect_url) {
    fallbackRedirectUrl = `/auth-success?redirect_url=${encodeURIComponent(params.redirect_url)}`;
  }

  return (
  <>
    <div className="flex flex-col space-y-3 text-center">
      <div className="space-y-2">
        <h1 className="font-semibold text-2xl tracking-tight text-white">
          {title}
        </h1>
        <p className="text-white text-sm leading-relaxed">{description}</p>
      </div>

    </div>
    <SignUp fallbackRedirectUrl={fallbackRedirectUrl} />
    {/* Privacy and Terms text */}
    <div className="text-center text-xs text-muted-foreground mt-4">
      By creating an account, you agree to our{' '}
      <a
        href="/legal/terms"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium no-underline"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #f97316 50%, #1e40af 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        Terms of Service
      </a>{' '}
      and{' '}
      <a
        href="/legal/privacy"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium no-underline"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #f97316 50%, #1e40af 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        Privacy Policy
      </a>
      .
    </div>
  </>
  );
};

export default SignUpPage;
