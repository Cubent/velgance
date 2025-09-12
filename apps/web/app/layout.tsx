import './[locale]/styles.css';
import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import { cn } from '@repo/design-system/lib/utils';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travira | Save 50-90% off Flight Deals',
  description: 'Find incredible flight deals with AI-powered search. Save 50-90% on flights worldwide.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html className={cn(fonts, 'scroll-smooth')}>
      <head>
        <link rel="canonical" href="https://cubent.dev" />
      </head>
      <body style={{ backgroundColor: '#f9f7ee' }}>
        <DesignSystemProvider>
          {children}
        </DesignSystemProvider>
      </body>
    </html>
  );
}
