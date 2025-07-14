import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { SignUp } from '@repo/auth/components/sign-up';

const title = 'Create an account';
const description = 'Enter your details to get started.';

export const metadata: Metadata = createMetadata({ title, description });

const SignUpPage = () => (
  <>
    <div className="flex flex-col space-y-3 text-center">
      <div className="space-y-2">
        <h1 className="font-semibold text-2xl tracking-tight text-white">
          {title}
        </h1>
        <p className="text-white text-sm leading-relaxed">{description}</p>
      </div>

    </div>
    <SignUp />
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

export default SignUpPage;
