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

  return createMetadata(dictionary.web.pricing.meta);
};

const PricingLayout = ({ children }: PricingLayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
};

export default PricingLayout;
