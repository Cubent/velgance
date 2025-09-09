import { getDictionary } from '@repo/internationalization';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

type PricingLayoutProps = {
  readonly children: ReactNode;
  readonly params: Promise<{
    locale: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: PricingLayoutProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return {
    title: 'Pricing | Travira',
    description: 'Choose the perfect plan for your travel needs. Save 50-90% on flights with Travira.',
    icons: {
      icon: '/favicon.png',
      shortcut: '/favicon.png',
      apple: '/favicon.png',
    },
  };
};

const PricingLayout = ({ children }: PricingLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#fff0d2]">
      {children}
    </div>
  );
};

export default PricingLayout;
