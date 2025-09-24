'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { ChevronDown, User, LayoutDashboard, LogOut, Search } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';

import type { Dictionary } from '@repo/internationalization';
import Image from 'next/image';

type HeaderProps = {
  dictionary: Dictionary;
  isPricingPage?: boolean;
};

export const Header = ({ dictionary, isPricingPage = false }: HeaderProps) => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
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
      <div className="w-full bg-white/90 backdrop-blur-sm px-4 py-3">
        <div className="relative w-full max-w-[98%] mx-auto flex min-h-12 flex-row items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <p className="whitespace-nowrap font-normal text-lg text-black" style={{ fontFamily: 'Raleway, sans-serif' }}>Velgance Agency</p>
            </Link>
            <Link 
              href="/models" 
              className="hidden sm:block text-sm text-black hover:text-gray-600 transition-colors"
            >
              Modelli
            </Link>
          </div>
          {/* Center Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                placeholder="Cerca modelli..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                className="w-full px-3 py-2 pl-10 text-sm border-b border-black focus:outline-none focus:border-gray-400 bg-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              {showSearchResults && searchQuery && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  <div className="p-2 text-xs text-gray-500">
                    Risultati per "{searchQuery}"
                  </div>
                  <div className="p-2 text-sm text-gray-500">
                    <Link 
                      href={`/models?search=${encodeURIComponent(searchQuery)}`}
                      className="block hover:bg-gray-100 p-2 rounded"
                      onClick={() => setShowSearchResults(false)}
                    >
                      Vedi tutti i risultati
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
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
                  className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-black hover:text-black h-6 px-2 py-1 sm:h-10 sm:px-4 sm:py-2 sm:text-sm hover:bg-transparent"
                >
                  Entra
                </Link>
                <Link 
                  href="/dashboard"
                  className="bg-black text-white px-3 py-1 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-gray-700 shadow-lg h-6 sm:h-10 inline-flex items-center justify-center text-xs sm:text-sm"
                  style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' }}
                >
                  Contattaci
                </Link>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
