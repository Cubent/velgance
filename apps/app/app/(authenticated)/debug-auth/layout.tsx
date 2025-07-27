import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Cubent Workspace',
  description: 'Debug authentication flows and test extension connections',
};

type DebugAuthLayoutProps = {
  readonly children: ReactNode;
};

const DebugAuthLayout = ({ children }: DebugAuthLayoutProps) => {
  return <>{children}</>;
};

export default DebugAuthLayout;
