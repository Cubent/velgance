'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

import type { Dictionary } from '@repo/internationalization';
import Image from 'next/image';

type HeaderProps = {
  dictionary: Dictionary;
  isPricingPage?: boolean;
};

export const Header = ({ dictionary, isPricingPage = false }: HeaderProps) => {
  const { user, isLoaded } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isPricing = isPricingPage || pathname.includes('/pricing') || pathname.includes('/dashboard') || pathname.includes('/profile') || pathname.includes('/onboarding');


  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className={`w-full ${isPricing ? 'bg-[#045530]' : 'bg-[#f0e8d4]/80'} backdrop-blur-md px-3 py-1`}>
        <div className="relative w-full flex min-h-12 flex-row items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image 
              src={isPricing ? "/Travira-light.svg" : "/Travira-logo.svg"} 
              alt="Travira Logo" 
              width={40} 
              height={40} 
            />
            <p className={`whitespace-nowrap font-bold text-2xl ${isPricing ? 'text-[#d5e27b]' : 'text-[#045530]'}`}>Travira</p>
          </Link>
          {/* Center nav removed */}
          <div className="hidden lg:flex"></div>
          {/* Right side - Desktop and Mobile */}
          <div className="flex items-center gap-2">
            {/* Sign In / User Profile */}
            <div className="flex justify-end">
              {!isLoaded ? (
                <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full"></div>
              ) : user ? (
              <div className="flex items-center gap-2">
                {/* Active Deals Button - only show when logged in */}
                <Link
                  href="/dashboard"
                  className="bg-[#d5e27b] text-[#045530] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#c4d16a] transition-colors"
                >
                  Active Deals
                </Link>
                <div 
                  className="relative" 
                  ref={userMenuRef}
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <button
                    className={`flex items-center gap-2 p-1 rounded-full transition-colors ${
                      isUserMenuOpen ? 'bg-[#fff0d2]' : 'hover:bg-[#fff0d2]'
                    }`}
                  >
                    <img
                      src={user.imageUrl}
                      alt={user.fullName || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#fff0d2] rounded-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.fullName || user.firstName}</p>
                        <p className="text-xs text-gray-600">{user.primaryEmailAddress?.emailAddress}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#d5e27b] hover:text-[#045530] transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile & Settings
                      </Link>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#d5e27b] hover:text-[#045530] transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <div className="border-t border-gray-100 mt-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            // Add sign out functionality here
                            window.location.href = '/sign-out';
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#d5e27b] hover:text-[#045530] transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild className="text-gray-600 hover:text-green-600 h-10">
                  <Link href="/sign-in">
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="bg-[#d5e27b] text-[#045530] hover:bg-[#c4d16a] h-10 rounded-lg px-4 font-semibold">
                  <Link href="/sign-up?redirect_url=/pricing">
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
