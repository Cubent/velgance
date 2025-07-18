'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { UserButton } from '@repo/auth/client';
import { NotificationsTrigger } from '@repo/notifications/components/trigger';
import { useSidebar } from '@repo/design-system/components/ui/sidebar';
import { Menu, CreditCard } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { CompactTrialBadge } from '../../../components/CompactTrialBadge';

import Logo from './logo.svg';

export const AppHeader = () => {
  const { toggleSidebar } = useSidebar();
  const [isLoading, setIsLoading] = useState(false);

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
      });

      if (response.ok) {
        const { url } = await response.json();
        window.open(url, '_blank');
      } else {
        const errorData = await response.json();
        console.error('Failed to create billing portal session:', errorData);
        alert(`Failed to open billing portal: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <header className="sticky top-0 left-0 z-50 w-full bg-sidebar backdrop-blur-sm border-b border-sidebar-border supports-[backdrop-filter]:bg-sidebar/95">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left side - Mobile Menu Button + Logo */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Button - Only visible on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden shrink-0"
            onClick={toggleSidebar}
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <Link href="/dashboard" className="md:hidden flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src={Logo}
              alt="Cubent Logo"
              width={32}
              height={32}
              className="dark:invert"
            />
            <span className="font-medium text-base">Cubent</span>
          </Link>
        </div>

        {/* Right side - Trial badge, manage subscription, notifications, and user menu */}
        <div className="flex items-center gap-3">
          {/* Compact Trial Badge */}
          <CompactTrialBadge />

          {/* Manage Subscription Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleManageSubscription}
            disabled={isLoading}
            className="hidden sm:flex items-center gap-2 text-xs px-3 py-1 h-8 border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
          >
            <CreditCard className="h-3 w-3" />
            {isLoading ? 'Loading...' : 'Manage Subscription'}
          </Button>

          {/* Notifications */}
          <div className="shrink-0">
            <NotificationsTrigger />
          </div>

          {/* User Button */}
          <UserButton
            showName
            appearance={{
              elements: {
                rootBox: 'flex overflow-hidden',
                userButtonBox: 'flex-row-reverse',
                userButtonOuterIdentifier: 'truncate pl-0 !text-white',
                userButtonTrigger: '!text-white',
                // Remove hardcoded white colors for dropdown content
                // Let Clerk use default colors for dropdown text
              },
            }}
          />
        </div>
      </div>
    </header>
  );
};
