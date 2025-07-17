'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { UserButton } from '@repo/auth/client';
import { NotificationsTrigger } from '@repo/notifications/components/trigger';
import { useSidebar } from '@repo/design-system/components/ui/sidebar';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CompactTrialBadge } from '../../../components/CompactTrialBadge';

import Logo from './logo.svg';

export const AppHeader = () => {
  const { toggleSidebar } = useSidebar();
  
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

        {/* Right side - Trial badge, notifications, and user menu */}
        <div className="flex items-center gap-3">
          {/* Compact Trial Badge */}
          <CompactTrialBadge />

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
                userPreviewMainIdentifier: '!text-white',
                userPreviewSecondaryIdentifier: '!text-white/90',
                userButtonTrigger: '!text-white',
              },
            }}
          />
        </div>
      </div>
    </header>
  );
};
