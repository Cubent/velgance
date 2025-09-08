'use client';

import { env } from '@/env';

import { Button } from '@repo/design-system/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@repo/design-system/components/ui/navigation-menu';
import { Menu, MoveRight, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import type { Dictionary } from '@repo/internationalization';
import Image from 'next/image';

import Logo from './logo.svg';
import { UserProfile } from './user-profile';
import { useAuthStatus } from '../../hooks/useAuthStatus';

type HeaderProps = {
  dictionary: Dictionary;
};

export const Header = ({ dictionary }: HeaderProps) => {
  const { isAuthenticated, user, isLoading } = useAuthStatus();
  const pathname = usePathname();

  const navigationItems = [
    {
      title: 'Pricing',
      href: '/pricing',
      description: '',
    },
    {
      title: 'How It Works',
      href: '/#how-it-works',
      description: '',
    },
    {
      title: 'Contact',
      href: '/contact',
      description: '',
    },
  ];

  // Helper function to check if a navigation item is active
  const isActiveItem = (href: string) => {
    if (href === '/pricing') return pathname === '/pricing';
    if (href === '/contact') return pathname === '/contact';
    if (href === '/#how-it-works') return pathname === '/';
    return false;
  };

  const [isOpen, setOpen] = useState(false);
  const [isCompanyExpanded, setCompanyExpanded] = useState(false);
  return (
    <header className="sticky top-1 z-40 w-full flex justify-center">
      <div className="mx-auto w-[92%] max-w-5xl rounded-full bg-white shadow-md px-3 py-1">



        <div className="relative w-full max-w-none flex min-h-12 flex-row items-center justify-between" style={{paddingInline: 'clamp(0.5rem, 2%, 1rem)'}}>
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">✈️</span>
          <p className="whitespace-nowrap font-bold text-xl text-green-600">Travira</p>
        </Link>
        {/* Center nav removed */}
        <div className="hidden lg:flex"></div>
        {/* Right side - Desktop and Mobile */}
        <div className="flex items-center gap-2">
          {/* Sign In / User Profile */}
          <div className="flex justify-end">
            {isLoading ? (
              <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full"></div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Signed in as {user.firstName || user.emailAddresses[0]?.emailAddress}</span>
                </div>
                <UserProfile user={user} />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild className="text-gray-600 hover:text-green-600 h-10">
                  <Link href="/sign-in">
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="bg-green-600 hover:bg-green-700 text-white h-10 rounded-full px-6">
                  <Link href="/pricing">
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>



          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
          {isOpen && (
            <div className="container absolute top-16 right-0 flex w-full flex-col gap-6 py-3 shadow-md px-4 sm:px-6 lg:px-8 bg-white">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  <div className="flex flex-col gap-2">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={`flex items-center justify-between ${
                          isActiveItem(item.href) ? 'bg-muted/30 text-foreground rounded px-2 py-1' : ''
                        }`}
                        target={
                          item.href.startsWith('http') ? '_blank' : undefined
                        }
                        rel={
                          item.href.startsWith('http')
                            ? 'noopener noreferrer'
                            : undefined
                        }
                        onClick={() => setOpen(false)}
                      >
                        <span className="text-lg">{item.title}</span>
                        <MoveRight className="h-4 w-4 stroke-1 text-muted-foreground" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => setCompanyExpanded(!isCompanyExpanded)}
                        className={`text-lg ${isCompanyActive() ? 'text-foreground' : ''} flex items-center justify-between w-full text-left`}
                      >
                        <span>{item.title}</span>
                        <MoveRight className={`h-4 w-4 stroke-1 text-muted-foreground transition-transform ${isCompanyExpanded ? 'rotate-90' : ''}`} />
                      </button>
                    )}
                    {!item.href && isCompanyExpanded && item.sections?.map((section) => (
                      <div key={section.title} className="ml-4 flex flex-col gap-2">
                        <p className="text-sm font-medium text-muted-foreground">{section.title}</p>
                        {section.items?.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className="flex items-center justify-between ml-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="text-muted-foreground text-sm">
                              {subItem.title}
                            </span>
                            <MoveRight className="h-3 w-3 stroke-1" />
                          </Link>
                        ))}
                      </div>
                    ))}
                    {('items' in item && item.items) && (item as any).items.map((subItem: any) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="flex items-center justify-between"
                      >
                        <span className="text-muted-foreground">
                          {subItem.title}
                        </span>
                        <MoveRight className="h-4 w-4 stroke-1" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
