import './[locale]/styles.css';
import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import { cn } from '@repo/design-system/lib/utils';
import type { ReactNode } from 'react';

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
      <body style={{ backgroundColor: '#e0fce9' }}>
        <DesignSystemProvider>
          {children}
        </DesignSystemProvider>
      </body>
    </html>
  );
}
