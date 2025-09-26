// Main layout component for the Cubent website
import './styles.css';
import { AnalyticsProvider } from '@repo/analytics';
import { AuthProvider } from '@repo/auth/provider';

import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import { cn } from '@repo/design-system/lib/utils';
import { Toolbar } from '@repo/feature-flags/components/toolbar';
import { getDictionary } from '@repo/internationalization';
import type { ReactNode } from 'react';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { PageWrapper } from './components/page-wrapper';
import { ConditionalHeaderFooter } from './components/conditional-header-footer';
import { PerformanceOptimizer } from '../../components/performance-optimizer';
import { PerformanceHints } from '../../components/seo-optimizer';
import { ErrorBoundary, ConsoleErrorSuppressor } from '../../components/error-boundary';
import { ReferralTracker } from '../../components/ReferralTracker';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Velgance - Trasformiamo il talento in opportunità',
  description: 'Academy Model Management - Connettiamo talenti unici con le migliori opportunità del settore della moda.',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

type RootLayoutProperties = {
  readonly children: ReactNode;
  readonly params: Promise<{
    locale: string;
  }>;
};

const RootLayout = async ({ children, params }: RootLayoutProperties) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '';
  const isPricingPage = pathname.includes('/pricing') || pathname.includes('/profile') || pathname.includes('/onboarding');
  const isDashboardPage = pathname.includes('/dashboard');

  return (
    <>
      <ConsoleErrorSuppressor />
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Velgance Agency",
            "description": "Dal 1998 trasformiamo il talento in opportunità. Agenzia di modelli professionisti per sfilate, shooting, video commerciali e eventi aziendali.",
            "url": "https://velgance.com",
            "logo": "https://velgance.com/favicon.svg",
            "sameAs": [
              "https://instagram.com/velgance_agency",
              "https://facebook.com/velgance"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "url": "https://velgance.com/contact",
              "email": "info@velgance.com"
            },
            "founder": {
              "@type": "Person",
              "name": "Velgance Founder"
            },
            "foundingDate": "1998",
            "industry": "Entertainment & Fashion",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "IT",
              "addressLocality": "Milano",
              "streetAddress": "Via della Moda, 123"
            },
            "keywords": "agenzia modelli, modelle, casting, sfilate, shooting fotografici, video commerciali, eventi, hostess, steward, influencer marketing, fashion week, milano"
          })
        }}
      />
      <ReferralTracker />
      <ErrorBoundary>
        <AuthProvider>
          <AnalyticsProvider>
            <DesignSystemProvider>
              <PerformanceOptimizer />
              <PageWrapper>
                <ConditionalHeaderFooter dictionary={dictionary} isPricingPage={isPricingPage}>
                  {children}
                </ConditionalHeaderFooter>
              </PageWrapper>
            </DesignSystemProvider>
            <Toolbar />
          </AnalyticsProvider>
        </AuthProvider>
      </ErrorBoundary>
    </>
  );
};

export default RootLayout;
