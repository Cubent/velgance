'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { ChevronDown, User, LayoutDashboard, LogOut, Search, Menu } from 'lucide-react';
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
  
  // Debug authentication state
  if (typeof window !== 'undefined') {
    console.log('[HEADER] Auth state:', { isLoaded, hasUser: !!user, user: user?.id });
    console.log('[HEADER] Should show Entra:', !isLoaded || !user);
  }
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isModelliDropdownOpen, setIsModelliDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnnouncementClosed, setIsAnnouncementClosed] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const modelliDropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isPricing = isPricingPage || pathname.includes('/pricing') || pathname.includes('/dashboard') || pathname.includes('/profile') || pathname.includes('/onboarding');

  // Search functionality
  useEffect(() => {
    const searchModels = async () => {
      if (searchQuery.trim()) {
        try {
          const response = await fetch(`/api/models?search=${encodeURIComponent(searchQuery)}`);
          const data = await response.json();
          setSearchResults(data);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(searchModels, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close user menu, search, mobile menu, and modelli dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (modelliDropdownRef.current && !modelliDropdownRef.current.contains(event.target as Node)) {
        setIsModelliDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Top Announcement Banner - Sticky */}
      {!isAnnouncementClosed && (
        <div className="sticky top-0 z-50 w-full text-[#212121] px-4 text-center flex items-center justify-center" style={{ backgroundColor: '#fcf7ed', position: 'sticky', top: 0, zIndex: 50, width: '100%', minHeight: '40px' }}>
          <div className="max-w-7xl mx-auto flex items-center justify-center relative">
            <Link href="/magazine/i-100-modelli-piu-influenti-europa-2025" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
                <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                  I 100 modelli più influenti d'Europa - Classifica 2025
                </span>
              <svg className="w-4 h-4 flex-shrink-0 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}
      
      <header className={`sticky z-40 w-full ${!isAnnouncementClosed ? 'top-[40px]' : 'top-0'}`} style={{ position: 'sticky', zIndex: 40, top: !isAnnouncementClosed ? '40px' : '0', width: '100%' }}>
        <div className="w-full bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="relative w-full max-w-[98%] mx-auto flex min-h-12 flex-row items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <p className="whitespace-nowrap font-normal text-lg text-black" style={{ fontFamily: 'Raleway, sans-serif' }}>Velgance Agency</p>
            </Link>
          </div>

          {/* Navigation Menu - Centered */}
          <div className="hidden sm:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            <div 
              className="relative"
              ref={modelliDropdownRef}
              onMouseEnter={() => setIsModelliDropdownOpen(true)}
              onMouseLeave={() => setIsModelliDropdownOpen(false)}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (isModelliDropdownOpen) {
                    router.push('/models');
                  } else {
                    setIsModelliDropdownOpen(true);
                  }
                }}
                className="text-sm text-black hover:text-gray-600 transition-colors whitespace-nowrap py-4 bg-transparent border-none cursor-pointer"
              >
                Modelli
              </button>
              
              {/* Dropdown Menu */}
              <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[600px] transition-all duration-300 z-50 ${isModelliDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Female Models Card */}
                    <Link
                      href="/female-models"
                      className="cursor-pointer block hover:scale-105 transition-transform duration-300"
                      onClick={() => setIsModelliDropdownOpen(false)}
                    >
                      <div className="relative overflow-hidden rounded-lg aspect-[4/3] mb-3" style={{ minHeight: '200px' }}>
                        <img 
                          src="https://i.postimg.cc/kXskQ6Z7/Full-Body-Picture-3.png"
                          alt="Talento Femminile"
                          className="w-full h-full object-cover"
                          style={{ minHeight: '200px' }}
                        />
                        <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <h3 className="text-xl font-light text-white mb-3 italic" style={{ fontFamily: 'serif' }}>
                              Talento Femminile
                            </h3>
                            <p className="text-base text-white">
                              Scopri i talenti femminili
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Male Models Card */}
                    <Link
                      href="/male-models"
                      className="cursor-pointer block hover:scale-105 transition-transform duration-300"
                      onClick={() => setIsModelliDropdownOpen(false)}
                    >
                      <div className="relative overflow-hidden rounded-lg aspect-[4/3] mb-3" style={{ minHeight: '200px' }}>
                        <img 
                          src="https://i.postimg.cc/fLq97LMk/Full-Body-Picture-2.png"
                          alt="Talento Maschile"
                          className="w-full h-full object-cover"
                          style={{ minHeight: '200px' }}
                        />
                        <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <h3 className="text-xl font-light text-white mb-3 italic" style={{ fontFamily: 'serif' }}>
                              Talento Maschile
                            </h3>
                            <p className="text-base text-white">
                              Scopri i talenti maschili
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <Link 
              href="/magazine" 
              className="text-sm text-black hover:text-gray-600 transition-colors whitespace-nowrap"
            >
              Magazine
            </Link>
            <Link 
              href="/portfolio" 
              className="text-sm text-black hover:text-gray-600 transition-colors whitespace-nowrap"
            >
              Portfolio
            </Link>
            <Link 
              href="/contact" 
              className="text-sm text-black hover:text-gray-600 transition-colors whitespace-nowrap"
            >
              Contatti
            </Link>
          </div>

          {/* Mobile Search Icon */}
          <div className="sm:hidden ml-auto">
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setShowSearchResults(!showSearchResults)}
                className="p-2 text-black hover:text-gray-600 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              {showSearchResults && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-3">
                    <input
                      type="text"
                      placeholder="Cerca modelli..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 text-sm border-b border-black focus:outline-none focus:border-gray-400 bg-transparent text-black"
                    />
                    {searchQuery && searchResults.length > 0 && (
                      <div className="mt-2 max-h-48 overflow-y-auto">
                        {searchResults.slice(0, 3).map((model) => (
                          <Link
                            key={model.id}
                            href={`/models/${model.id}`}
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded"
                            onClick={() => setShowSearchResults(false)}
                          >
                            <img
                              src={model.image}
                              alt={`${model.firstName} ${model.lastName}`}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="text-sm text-black">
                              {model.firstName} {model.lastName}
                            </span>
                          </Link>
                        ))}
                        {searchResults.length > 3 && (
                          <Link
                            href={`/models?search=${encodeURIComponent(searchQuery)}`}
                            className="block p-2 text-sm text-gray-600 hover:bg-gray-100 rounded mt-1"
                            onClick={() => setShowSearchResults(false)}
                          >
                            Vedi tutti i risultati ({searchResults.length})
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Desktop and Mobile */}
          <div className="flex items-center gap-2">
            {/* User Profile - Only show when authenticated */}
            {user && (
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
            )}

            {/* Desktop Search Bar - Right side */}
            <div className="hidden sm:block mr-6">
              <div className="relative w-48" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Cerca modelli..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchResults(true)}
                  className="w-full px-3 py-2 pl-10 text-sm border-b border-black focus:outline-none focus:border-gray-400 bg-transparent text-black"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                {showSearchResults && searchQuery && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <>
                        {searchResults.slice(0, 5).map((model) => (
                          <Link
                            key={model.id}
                            href={`/models/${model.id}`}
                            className="flex items-center gap-3 p-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                            onClick={() => setShowSearchResults(false)}
                          >
                            <img
                              src={model.image}
                              alt={`${model.firstName} ${model.lastName}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-sm text-black">
                                {model.firstName} {model.lastName}
                              </p>
                            </div>
                          </Link>
                        ))}
                        {searchResults.length > 5 && (
                          <Link 
                            href={`/models?search=${encodeURIComponent(searchQuery)}`}
                            className="block p-3 text-sm text-gray-600 hover:bg-gray-100 border-t border-gray-100"
                            onClick={() => setShowSearchResults(false)}
                          >
                            Vedi tutti i risultati ({searchResults.length})
                          </Link>
                        )}
                      </>
                    ) : (
                      <div className="p-3 text-sm text-gray-500">
                        Nessun modello trovato
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Candidati button */}
            <Link 
              href="/models/application"
              className="bg-black text-white px-3 py-1 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-gray-700 shadow-lg h-6 sm:h-10 inline-flex items-center justify-center text-xs sm:text-sm"
              style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' }}
            >
              Candidati
            </Link>
            
            {/* Mobile Hamburger Menu */}
            <div className="sm:hidden" ref={mobileMenuRef}>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-black hover:text-gray-600 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 animate-in fade-in-0 duration-300 bg-white" style={{ backgroundColor: 'white !important' }}>
                  {/* Header */}
                  <div className="flex justify-between items-center p-6 border-b border-gray-300" style={{ backgroundColor: '#fafafa' }}>
                    <h2 className="text-2xl font-medium text-black" style={{ fontFamily: 'Raleway, sans-serif' }}>
                      Menu
                    </h2>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-3 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Menu Items - Centered */}
                  <div className="flex flex-col justify-center items-center h-[calc(100vh-120px)] p-6 space-y-2 bg-white" style={{ backgroundColor: 'white !important' }}>
                    <Link
                      href="/models"
                      className="flex items-center px-6 py-6 text-2xl text-black hover:bg-gray-100/50 rounded-xl transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ fontFamily: 'Raleway, sans-serif' }}
                    >
                      Modelli
                    </Link>
                    
                    <div className="h-px bg-gray-300 my-2 w-48"></div>
                    
                    <Link
                      href="/magazine"
                      className="flex items-center px-6 py-6 text-2xl text-black hover:bg-gray-100/50 rounded-xl transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ fontFamily: 'Raleway, sans-serif' }}
                    >
                      Magazine
                    </Link>
                    
                    <div className="h-px bg-gray-300 my-2 w-48"></div>
                    
                    <Link
                      href="/portfolio"
                      className="flex items-center px-6 py-6 text-2xl text-black hover:bg-gray-100/50 rounded-xl transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ fontFamily: 'Raleway, sans-serif' }}
                    >
                      Portfolio
                    </Link>
                    
                    <div className="h-px bg-gray-300 my-4 w-48"></div>
                    
                    {!isLoaded ? (
                      <div className="px-6 py-6">
                        <div className="h-8 w-24 animate-pulse bg-gray-200 rounded"></div>
                      </div>
                    ) : user ? (
                      <Link
                        href="/dashboard"
                        className="flex items-center px-6 py-6 text-2xl text-black hover:bg-gray-100/50 rounded-xl transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{ fontFamily: 'Raleway, sans-serif' }}
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/sign-in"
                          className="flex items-center px-6 py-6 text-2xl text-black hover:bg-gray-100/50 rounded-xl transition-all duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                          style={{ fontFamily: 'Raleway, sans-serif' }}
                        >
                          Entra
                        </Link>
                        
                        <div className="h-px bg-gray-300 my-2 w-48"></div>
                        
                        <Link
                          href="/contact"
                          className="flex items-center px-6 py-6 text-2xl text-black hover:bg-gray-100/50 rounded-xl transition-all duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                          style={{ fontFamily: 'Raleway, sans-serif' }}
                        >
                          Contattaci
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  );
};