import { env } from '@/env';

import { withToolbar } from '@repo/feature-flags/lib/toolbar';
import { config, withAnalyzer } from '@repo/next-config';
import { withLogging, withSentry } from '@repo/observability/next-config';
import type { NextConfig } from 'next';

let nextConfig: NextConfig = withToolbar(withLogging(config));

// Prisma configuration for Vercel
// Prisma configuration for Vercel
nextConfig.serverExternalPackages = ['@prisma/client', 'prisma'];

// Webpack configuration for Prisma
nextConfig.webpack = (config, { isServer }) => {
  if (isServer) {
    // Externalize Prisma for server-side rendering
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push('@prisma/client');
    } else if (typeof config.externals === 'function') {
      const originalExternals = config.externals;
      config.externals = (context: any, request: string, callback: any) => {
        if (request === '@prisma/client') {
          return callback(null, 'commonjs @prisma/client');
        }
        return originalExternals(context, request, callback);
      };
    }
  }
  return config;
};

// Image optimization - AVIF first for maximum compression
nextConfig.images = {
  ...nextConfig.images,
  formats: ['image/avif', 'image/webp'], // AVIF first for best compression
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  dangerouslyAllowSVG: true,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
};

nextConfig.images?.remotePatterns?.push({
  protocol: 'https',
  hostname: 'assets.basehub.com',
});

// Performance optimizations
nextConfig.experimental = {
  ...nextConfig.experimental,
  optimizePackageImports: ['lucide-react', '@repo/design-system'],
};

// Turbopack configuration disabled temporarily due to FlightClientEntryPlugin issues
// nextConfig.turbopack = {
//   rules: {
//     '*.svg': {
//       loaders: ['@svgr/webpack'],
//       as: '*.js',
//     },
//   },
// };

// Compression and caching
nextConfig.compress = true;
nextConfig.poweredByHeader = false;

if (process.env.NODE_ENV === 'production') {
  const redirects: NextConfig['redirects'] = async () => [
    {
      source: '/legal',
      destination: '/legal/privacy',
      statusCode: 301,
    },
  ];

  nextConfig.redirects = redirects;
}

if (env.VERCEL) {
  nextConfig = withSentry(nextConfig);
}

if (env.ANALYZE === 'true') {
  nextConfig = withAnalyzer(nextConfig);
}

export default nextConfig;
