'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const pathname = usePathname();
  
  // Check if we're on the homepage
  const isHomepage = pathname === '/' || pathname === '/en' || pathname.match(/^\/[a-z]{2}$/);
  
  return (
    <div className="min-h-screen">
      {/* Background for header area on non-homepage */}
      {!isHomepage && (
        <div className="fixed top-0 left-0 right-0 h-20 bg-white z-30" />
      )}
      
      {/* Main content */}
      <div className="relative z-40">
        {children}
      </div>
    </div>
  );
}
