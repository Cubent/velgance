// Main layout component for the Cubent website
import './styles.css';
import { AnalyticsProvider } from '@repo/analytics';
import { Toolbar as CMSToolbar } from '@repo/cms/components/toolbar';
import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import { cn } from '@repo/design-system/lib/utils';
import { Toolbar } from '@repo/feature-flags/components/toolbar';
import { getDictionary } from '@repo/internationalization';
import type { ReactNode } from 'react';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { PerformanceOptimizer } from '../../components/performance-optimizer';
import { PerformanceHints } from '../../components/seo-optimizer';
import { ErrorBoundary, ConsoleErrorSuppressor } from '../../components/error-boundary';

type RootLayoutProperties = {
  readonly children: ReactNode;
  readonly params: Promise<{
    locale: string;
  }>;
};

const RootLayout = async ({ children, params }: RootLayoutProperties) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <html
      lang={locale}
      className={cn(fonts, 'scroll-smooth')}
      suppressHydrationWarning
    >
      <head>
        <PerformanceHints />
        <link rel="canonical" href={`https://cubent.dev/${locale === 'en' ? '' : locale}`} />
      </head>
      <body>
        <ConsoleErrorSuppressor />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Cubent",
              "description": "Lightning-Fast AI Code Assistant for developers. Purpose-built for full-code generation, codebase-aware autocomplete and terminal-ready actions.",
              "url": "https://cubent.dev",
              "logo": "https://cubent.dev/favicon.svg",
              "sameAs": [
                "https://twitter.com/cubent",
                "https://github.com/cubent"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "url": "https://cubent.dev/contact"
              },
              "founder": {
                "@type": "Organization",
                "name": "Cubent Team"
              },
              "foundingDate": "2024",
              "industry": "Software Development Tools",
              "keywords": "AI code assistant, code generation, autocomplete, developer tools, artificial intelligence, programming assistant"
            })
          }}
        />
        <ErrorBoundary>
          <AnalyticsProvider>
            <DesignSystemProvider>
              <PerformanceOptimizer />
              <Header dictionary={dictionary} />
              {children}
              <Footer />
            </DesignSystemProvider>
            <Toolbar />
            <CMSToolbar />
          </AnalyticsProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
};

export default RootLayout;
