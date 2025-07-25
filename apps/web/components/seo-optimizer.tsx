import { Metadata } from 'next';

type SEOOptimizerProps = {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: Record<string, any>;
};

export const generateSEOMetadata = ({
  title = 'Cubent – Lightning-Fast AI Code Assistant',
  description = 'Cubent is your AI-native coding assistant, purpose-built for developers. From full-code generation to codebase-aware autocomplete and terminal-ready actions.',
  keywords = ['AI code assistant', 'code generation', 'autocomplete', 'developer tools', 'artificial intelligence', 'programming assistant', 'VS Code extension'],
  canonicalUrl = 'https://cubent.dev',
  ogImage = 'https://cubent.dev/og-image.png',
  structuredData
}: SEOOptimizerProps = {}): Metadata => {
  const baseMetadata: Metadata = {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'Cubent Team' }],
    creator: 'Cubent',
    publisher: 'Cubent',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://cubent.dev'),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Cubent',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@cubent',
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };

  return baseMetadata;
};

export const generateStructuredData = (type: 'Organization' | 'WebSite' | 'Article' | 'Product', data: Record<string, any>) => {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  switch (type) {
    case 'Organization':
      return {
        ...baseStructuredData,
        name: 'Cubent',
        description: 'Lightning-Fast AI Code Assistant for developers',
        url: 'https://cubent.dev',
        logo: 'https://cubent.dev/favicon.svg',
        sameAs: [
          'https://twitter.com/cubent',
          'https://github.com/cubent',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          url: 'https://cubent.dev/contact',
        },
        foundingDate: '2024',
        industry: 'Software Development Tools',
        keywords: 'AI code assistant, code generation, autocomplete, developer tools',
        ...data,
      };

    case 'WebSite':
      return {
        ...baseStructuredData,
        name: 'Cubent',
        url: 'https://cubent.dev',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://cubent.dev/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
        ...data,
      };

    case 'Article':
      return {
        ...baseStructuredData,
        headline: data.title,
        description: data.description,
        author: {
          '@type': 'Organization',
          name: 'Cubent Team',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Cubent',
          logo: {
            '@type': 'ImageObject',
            url: 'https://cubent.dev/favicon.svg',
          },
        },
        datePublished: data.publishedAt,
        dateModified: data.updatedAt || data.publishedAt,
        ...data,
      };

    case 'Product':
      return {
        ...baseStructuredData,
        name: 'Cubent AI Code Assistant',
        description: 'AI-native coding assistant for developers with full-code generation and autocomplete',
        brand: {
          '@type': 'Brand',
          name: 'Cubent',
        },
        category: 'Software Development Tools',
        offers: {
          '@type': 'Offer',
          url: 'https://cubent.dev/pricing',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        ...data,
      };

    default:
      return { ...baseStructuredData, ...data };
  }
};

// Component for injecting structured data
export const StructuredData = ({ data }: { data: Record<string, any> }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
};

// Performance hints for critical resources
export const PerformanceHints = () => {
  return (
    <>
      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      
      {/* Preconnect to critical domains */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Resource hints */}
      <link rel="prefetch" href="/api/health" />
      
      {/* Critical CSS preload */}
      <link
        rel="preload"
        href="/fonts/inter-var.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    </>
  );
};
