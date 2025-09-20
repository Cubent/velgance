'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { ChevronDown, User, LayoutDashboard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

import type { Dictionary } from '@repo/internationalization';
import Image from 'next/image';

type HeaderProps = {
  dictionary: Dictionary;
  isPricingPage?: boolean;
};

export const Header = ({ dictionary, isPricingPage = false }: HeaderProps) => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
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
      <div className={`w-full ${isPricing ? 'bg-[#045530]' : 'bg-[#f0e8d4]'} backdrop-blur-none px-1 py-1`}>
        <div className="relative w-full max-w-7xl mx-auto flex min-h-12 flex-row items-center justify-between px-2">
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
                  onMouseLeave={(e) => {
                    // Only close if mouse is moving far away from the entire dropdown area
                    const rect = userMenuRef.current?.getBoundingClientRect();
                    if (rect) {
                      const { left, right, top, bottom } = rect;
                      const { clientX, clientY } = e;
                      
                      // Add some buffer zone - only close if mouse is significantly outside
                      const buffer = 20;
                      if (clientX < left - buffer || clientX > right + buffer || 
                          clientY < top - buffer || clientY > bottom + buffer) {
                        setIsUserMenuOpen(false);
                      }
                    }
                  }}
                >
                  <button
                    className="flex items-center p-0.5 rounded-full transition-colors border-2 border-[#fff0d2] bg-[#fff0d2] hover:bg-[#fff0d2]/80"
                  >
                    <img
                      src={user.imageUrl}
                      alt={user.fullName || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 py-1 z-50 shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-[#045530]">{user.fullName || user.firstName}</p>
                        <p className="text-xs text-gray-600">{user.primaryEmailAddress?.emailAddress}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-[#045530] hover:bg-[#d5e27b] hover:text-[#045530] transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-[#045530] hover:bg-[#d5e27b] hover:text-[#045530] transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile & Settings
                      </Link>
                      <div className="border-t border-gray-100 mt-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            // Directly sign out using Clerk
                            signOut({ redirectUrl: '/' });
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-[#045530] hover:bg-[#d5e27b] hover:text-[#045530] transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/sign-in"
                  className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${isPricing ? 'text-[#d5e27b] hover:text-[#d5e27b]' : 'text-[#045530] hover:text-[#045530]'} h-10 px-4 py-2 hover:bg-transparent`}
                >
                  Sign In
                </Link>
                <Button asChild className="bg-[#d5e27b] text-[#045530] hover:bg-[#c4d16a] h-10 rounded-lg px-4 font-semibold">
                  <Link href="/dashboard">
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
