'use client';

import { cn } from '@repo/design-system/lib/utils';
import { ReactNode } from 'react';

interface AuroraBackgroundAltProps {
  children?: ReactNode;
  className?: string;
  radialGradient?: boolean;
}

export const AuroraBackgroundAlt = ({
  children,
  className,
  radialGradient = true,
}: AuroraBackgroundAltProps) => {
  const styles = {
    '--aurora':
      'repeating-linear-gradient(100deg,#fb923c_10%,#f97316_15%,#ea580c_20%,#dc2626_25%,#f59e0b_30%)',
    '--dark-gradient':
      'repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)',
    '--white-gradient':
      'repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)',
    '--orange-400': '#fb923c',
    '--orange-500': '#f97316',
    '--orange-600': '#ea580c',
    '--red-600': '#dc2626',
    '--amber-500': '#f59e0b',
    '--black': '#000',
    '--white': '#fff',
    '--transparent': 'transparent',
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center transition-all',
        className
      )}
      style={{
        backgroundImage: 'url(/images/cubent-back.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {children}
    </div>
  );
};
