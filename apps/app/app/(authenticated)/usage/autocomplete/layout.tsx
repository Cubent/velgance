import { createAppMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';

const title = 'Autocomplete Usage';
const description = 'View your AI autocomplete performance and statistics.';

export const metadata: Metadata = createAppMetadata({ title, description });

export default function AutocompleteUsageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
