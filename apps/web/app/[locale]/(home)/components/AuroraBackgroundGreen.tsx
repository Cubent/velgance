'use client';

import { cn } from '@repo/design-system/lib/utils';
import { ReactNode } from 'react';

interface AuroraBackgroundGreenProps {
  children?: ReactNode;
  className?: string;
  radialGradient?: boolean;
}

export const AuroraBackgroundGreen = ({
  children,
  className,
  radialGradient = true,
}: AuroraBackgroundGreenProps) => {
  const styles = {
    '--aurora':
      'repeating-linear-gradient(100deg,#22c55e_10%,#16a34a_15%,#15803d_20%,#166534_25%,#10b981_30%)',
    '--dark-gradient':
      'repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)',
    '--white-gradient':
      'repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)',
    '--green-500': '#22c55e',
    '--green-600': '#16a34a',
    '--green-700': '#15803d',
    '--green-800': '#166534',
    '--emerald-500': '#10b981',
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
        backgroundImage: 'url(/images/cubent-back-2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {children}
    </div>
  );
};
