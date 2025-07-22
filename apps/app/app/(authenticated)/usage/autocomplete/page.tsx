import { Metadata } from 'next';
import { AutocompleteUsageContent } from './components/autocomplete-usage-content';

export const metadata: Metadata = {
  title: 'Autocomplete Usage - Cubent',
  description: 'View your autocomplete usage statistics and analytics',
};

export default function AutocompletePage() {
  return <AutocompleteUsageContent />;
}
