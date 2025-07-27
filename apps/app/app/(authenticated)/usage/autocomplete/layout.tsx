import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Cubent Workspace',
  description: 'Autocomplete usage tracking and analytics for your coding assistant',
};

type AutocompleteLayoutProps = {
  readonly children: ReactNode;
};

const AutocompleteLayout = ({ children }: AutocompleteLayoutProps) => {
  return <>{children}</>;
};

export default AutocompleteLayout;
