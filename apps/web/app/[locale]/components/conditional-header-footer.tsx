'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';
import type { ReactNode } from 'react';

interface ConditionalHeaderFooterProps {
  children: ReactNode;
  dictionary: any;
  isPricingPage: boolean;
}

export function ConditionalHeaderFooter({ children, dictionary, isPricingPage }: ConditionalHeaderFooterProps) {
  const pathname = usePathname();
  const isDashboardPage = pathname.includes('/dashboard');
  const isAuthPage = pathname.includes('/sign-in') || pathname.includes('/sign-up');
  const isOnboardingPage = pathname.includes('/onboarding');
  const isMailingListPage = pathname.includes('/mailing-list');

  return (
    <>
      {!isAuthPage && !isOnboardingPage && !isMailingListPage && <Header dictionary={dictionary} isPricingPage={isPricingPage} />}
      {children}
      {!isAuthPage && !isOnboardingPage && !isMailingListPage && <Footer />}
    </>
  );
}
