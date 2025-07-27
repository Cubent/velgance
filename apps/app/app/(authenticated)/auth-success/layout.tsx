import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Cubent Workspace',
  description: 'Authentication successful - redirecting to your workspace',
};

type AuthSuccessLayoutProps = {
  readonly children: ReactNode;
};

const AuthSuccessLayout = ({ children }: AuthSuccessLayoutProps) => {
  return <>{children}</>;
};

export default AuthSuccessLayout;
