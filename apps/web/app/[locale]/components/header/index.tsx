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
      title: 'Enterprise',
      href: '/enterprise',
      description: '',
    },
    {
      title: 'Pricing',
      href: '/pricing',
      description: '',
    },
    {
      title: dictionary.web.header.docs,
      href: 'https://docs.cubent.dev/',
      description: '',
    },
    {
      title: dictionary.web.header.blog,
      href: '/blog',
      description: '',
    },
    {
      title: 'Company',
      description: 'Learn more about Cubent',
      sections: [
        {
          title: '',
          items: [
            {
              title: 'About Us',
              href: '/about',
              description: 'Learn about our mission and team'
            },
          ]
        },
        {
          title: '',
          items: [
            {
              title: 'Contact',
              href: '/contact',
              description: 'Get in touch with our team'
            },
          ]
        }
      ],
    },
  ];

  // Helper function to check if a navigation item thing is active 
  const isActiveItem = (href: string) => {
    if (href === '/enterprise') return pathname === '/enterprise';
    if (href === '/pricing') return pathname === '/pricing';
    if (href === '/blog') return pathname.startsWith('/blog');
    return false;
  };

  // Helper function to check if Company dropdown should be highlighted
  const isCompanyActive = () => {
    return pathname === '/about' || pathname === '/contact';
  };

  const [isOpen, setOpen] = useState(false);
  const [isCompanyExpanded, setCompanyExpanded] = useState(false);
  return (
    <header className="sticky top-0 left-0 z-40 w-full bg-background/20 backdrop-blur-md supports-[backdrop-filter]:bg-background/10">
      {/* Early Access Banner */}
      <div
        className="w-full border-b border-gray-600/20 text-gray-200 py-2.5 px-4 text-center text-sm relative overflow-hidden"
        style={{ backgroundColor: '#161616' }}
      >
        {/* Small radial gradient points */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle 80px at 15% 50%, rgba(255, 255, 255, 0.04) 0%, transparent 70%),
              radial-gradient(circle 60px at 85% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 70%),
              radial-gradient(circle 70px at 50% 20%, rgba(255, 255, 255, 0.02) 0%, transparent 70%)
            `
          }}
        />
        <div className="relative z-10">
          <span className="font-medium">Early Access:</span> We released the Byok plan -
          <Button variant="link" className="p-0 ml-1 h-auto font-medium text-sm" asChild>
            <Link href="https://app.cubent.dev/sign-in" className="bg-gradient-to-r from-blue-600 via-orange-500 to-blue-400 bg-clip-text text-transparent hover:text-transparent underline">
              Start your free trial
            </Link>
          </Button>
        </div>
      </div>

      <div className="border-b">
        <div className="relative w-full max-w-none flex min-h-20 flex-row items-center justify-between" style={{paddingInline: 'clamp(1rem, 2.5%, 2rem)'}}>
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image
            src={Logo}
            alt="Cubent Logo"
            width={39}
            height={39}
            className="dark:invert"
          />
          <p className="whitespace-nowrap font-medium text-lg">Cubent</p>
        </Link>
        <div className="hidden flex-row items-center justify-center gap-3 lg:flex absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
          <NavigationMenu className="flex items-center justify-center">
            <NavigationMenuList className="flex flex-row justify-center gap-3">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.href ? (
                    <>
                      <NavigationMenuLink asChild>
                        <Button
                          variant="ghost"
                          asChild
                          className={isActiveItem(item.href) ? 'bg-muted/30 text-foreground hover:bg-muted/40' : 'hover:bg-muted/20'}
                        >
                          <Link
                            href={item.href}
                            target={item.href.startsWith('http') ? '_blank' : undefined}
                            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {item.title}
                          </Link>
                        </Button>
                      </NavigationMenuLink>
                    </>
                  ) : (
                    <>
                      <NavigationMenuTrigger className={`font-medium text-sm bg-transparent hover:bg-muted/20 data-[state=open]:bg-muted/30 ${isCompanyActive() ? 'text-foreground bg-muted/30' : ''}`}>
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="!w-[400px] p-8 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl supports-[backdrop-filter]:bg-[#161616]/90" style={{ backgroundColor: '#161616' }}>
                        <div className="grid grid-cols-2 gap-0 relative">
                          {/* Vertical divider line */}
                          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 transform -translate-x-1/2"></div>

                          {item.sections?.map((section, sectionIdx) => (
                            <div key={sectionIdx} className={`flex flex-col gap-4 ${sectionIdx === 0 ? 'pr-6' : 'pl-6'}`}>
                              {section.items?.map((subItem, idx) => (
                                <NavigationMenuLink
                                  href={subItem.href}
                                  key={idx}
                                  className="flex flex-col gap-2 rounded-lg p-4 hover:bg-white/5 transition-all duration-200 group"
                                >
                                  <span className="text-base font-medium text-foreground group-hover:text-white">{subItem.title}</span>
                                  <span className="text-sm text-muted-foreground group-hover:text-gray-300">{subItem.description}</span>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {/* Right side - Desktop and Mobile */}
        <div className="flex items-center gap-2">
          {/* Sign In / User Profile */}
          <div className="flex justify-end">
            {isLoading ? (
              <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full"></div>
            ) : isAuthenticated && user ? (
              <UserProfile user={user} />
            ) : (
              <Button variant="outline" asChild className="text-white hover:text-white hover:bg-white/10 h-10 flex items-center border border-white/20 rounded-full px-6">
                <Link href="https://app.cubent.dev/sign-in">
                  Sign In
                </Link>
              </Button>
            )}
          </div>

          {/* Download Button - Hidden on mobile */}
          <Button asChild className="hidden md:inline-flex h-10 bg-white hover:bg-gray-100 text-black border-0 rounded-full px-6">
            <Link href="https://marketplace.visualstudio.com/items?itemName=cubent.cubent" className="flex flex-row items-center gap-2 whitespace-nowrap">
              <span className="shrink-0 text-sm font-medium">Download Cubent</span>
            </Link>
          </Button>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
          {isOpen && (
            <div className="container absolute top-20 right-0 flex w-full flex-col gap-8 border-t py-4 shadow-lg px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#161616' }}>
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
