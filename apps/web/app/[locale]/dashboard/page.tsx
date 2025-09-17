'use client';

import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Heart, Settings, Sparkles } from 'lucide-react';
import RecommendationCard from '../../../components/RecommendationCard';
import { PreferencesModal } from './components/PreferencesModal';

interface FlightRecommendation {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  price: number;
  currency: string;
  airline: string;
  flightNumber?: string;
  layovers: Array<{ airport: string; duration: string }>;
  duration: string;
  baggageInfo: { carry_on: string; checked: string };
  aiSummary?: string;
  confidenceScore?: number;
  dealQuality?: string;
  bookingUrl?: string;
  otaUrl?: string;
  isWatched: boolean;
  isAlternative?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserPreferences {
  homeAirports: string[];
  dreamDestinations: string[];
  deliveryFrequency: string;
  maxBudget?: number;
  preferredAirlines: string[];
  currency: string;
}

interface FlightDeal {
  id: string;
  origin: string;
  destination: string;
  price: number;
  originalPrice: number;
  savings: number;
  airline: string;
  departureDate: string;
  returnDate?: string;
  bookingUrl: string;
  createdAt: string;
}

type SortOption = 'price' | 'destination' | 'date' | 'quality';
type FilterOption = 'all' | 'watched' | 'excellent' | 'good';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<FlightRecommendation[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [savedDeals, setSavedDeals] = useState<FlightDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGeneratingDeals, setIsGeneratingDeals] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [selectedDeals, setSelectedDeals] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    tier: string;
    status: string;
    isInTrial: boolean;
    trialEndDate?: Date;
    daysRemaining?: number;
  } | null>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
      return;
    }

    if (isLoaded && user) {
      fetchData();
    }
  }, [isLoaded, user, router]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch user preferences
      const preferencesResponse = await fetch('/api/onboarding');

      if (!preferencesResponse.ok) {
        if (preferencesResponse.status === 401) {
          router.push('/sign-in');
          return;
        }
        throw new Error(`Failed to fetch preferences: ${preferencesResponse.status}`);
      }

      const preferencesData = await preferencesResponse.json();

      if (!preferencesData.preferences) {
        // User hasn't completed onboarding
        router.push('/onboarding');
        return;
      }

      setPreferences(preferencesData.preferences);

      // Fetch subscription status
      try {
        const subscriptionResponse = await fetch('/api/subscription/status');
        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json();
          console.log('🔍 SUBSCRIPTION DATA FROM API:', subscriptionData);
          setSubscriptionStatus(subscriptionData);
        } else {
          console.error('❌ Subscription API error:', subscriptionResponse.status, await subscriptionResponse.text());
        }
      } catch (subError) {
        console.error('❌ Error fetching subscription status:', subError);
        // Continue without subscription status - don't block the page
      }

      // Fetch flight recommendations
      try {
        const recommendationsResponse = await fetch('/api/recommendations');
        if (recommendationsResponse.ok) {
          const recommendationsData = await recommendationsResponse.json();
          if (recommendationsData.success) {
            setRecommendations(recommendationsData.recommendations || []);
          }
        }
      } catch (recError) {
        console.error('Error fetching recommendations:', recError);
        // Continue without recommendations - don't block the page
      }

      // Fetch saved deals
      try {
        const savedDealsResponse = await fetch('/api/user/deals');
        if (savedDealsResponse.ok) {
          const savedDealsData = await savedDealsResponse.json();
          setSavedDeals(savedDealsData || []);
        }
      } catch (savedDealsError) {
        console.error('Error fetching saved deals:', savedDealsError);
        // Continue without saved deals - don't block the page
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Show a user-friendly error instead of blocking
      setPreferences(null);
    } finally {
      setLoading(false);
    }
  };

  const handleWatch = async (recommendationId: string) => {
    try {
      const response = await fetch(`/api/recommendations/${recommendationId}/watch`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setRecommendations(prev => 
          prev.map(rec => 
            rec.id === recommendationId 
              ? { ...rec, isWatched: !rec.isWatched }
              : rec
          )
        );
      }
    } catch (error) {
      console.error('Error updating watch status:', error);
    }
  };

  const handleBook = (url: string) => {
    window.open(url, '_blank');
  };

  const handleRefresh = async () => {
    if (!preferences) return;
    
    try {
      setLoading(true);
      const response = await fetch('/api/recommendations/refresh', {
        method: 'POST',
      });
      
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDeals = async () => {
    if (!preferences) return;
    
    try {
      setIsGeneratingDeals(true);
      const response = await fetch('/api/recommendations/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: preferences,
          count: 6
        }),
      });
      
      if (response.ok) {
        await fetchData();
      } else {
        const errorData = await response.json();
        if (errorData.requiresSubscription) {
          // Redirect to pricing if subscription is required
          router.push('/pricing');
        } else {
          console.error('Failed to generate deals:', errorData);
        }
      }
    } catch (error) {
      console.error('Error generating deals:', error);
    } finally {
      setIsGeneratingDeals(false);
    }
  };

  const handleSavePreferences = async (updatedPreferences: UserPreferences) => {
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPreferences),
      });
      
      if (response.ok) {
        setPreferences(updatedPreferences);
        // Refresh recommendations with new preferences
        await fetchData();
      } else {
        console.error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const handleSelectDeal = (dealId: string) => {
    setSelectedDeals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dealId)) {
        newSet.delete(dealId);
      } else {
        newSet.add(dealId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedDeals.size === filteredAndSortedRecommendations.length) {
      setSelectedDeals(new Set());
    } else {
      setSelectedDeals(new Set(filteredAndSortedRecommendations.map(rec => rec.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDeals.size === 0) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch('/api/recommendations/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dealIds: Array.from(selectedDeals) }),
      });
      
      if (response.ok) {
        // Remove deleted deals from state
        setRecommendations(prev => 
          prev.filter(rec => !selectedDeals.has(rec.id))
        );
        setSelectedDeals(new Set());
      } else {
        console.error('Failed to delete deals');
      }
    } catch (error) {
      console.error('Error deleting deals:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter and sort recommendations
  const filteredAndSortedRecommendations = recommendations
    .filter(rec => {
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!rec.destination.toLowerCase().includes(searchLower) &&
            !rec.origin.toLowerCase().includes(searchLower) &&
            !rec.airline.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      // Apply category filter
      switch (filterBy) {
        case 'watched':
          return rec.isWatched;
        case 'excellent':
          return rec.dealQuality === 'excellent';
        case 'good':
          return rec.dealQuality === 'good';
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'destination':
          return a.destination.localeCompare(b.destination);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
        case 'quality':
          const qualityOrder = { excellent: 3, good: 2, fair: 1 };
          return (qualityOrder[b.dealQuality as keyof typeof qualityOrder] || 0) - 
                 (qualityOrder[a.dealQuality as keyof typeof qualityOrder] || 0);
        default:
          return 0;
      }
    });

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#f9f7ee] flex items-center justify-center">
        <div className="text-center">
          <style jsx>{`
            @keyframes iconFade {
              0%, 30% { opacity: 1; }
              31%, 100% { opacity: 0; }
            }
            .icon-1 { animation: iconFade 0.9s infinite; }
            .icon-2 { animation: iconFade 0.9s infinite 0.3s; }
            .icon-3 { animation: iconFade 0.9s infinite 0.6s; }
          `}</style>
          <div className="relative h-32 w-32 mx-auto mb-4">
            {/* Plane Icon */}
            <div className="absolute inset-0 flex items-center justify-center icon-1">
              <svg className="w-20 h-20 text-[#045530]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            </div>
            {/* Cloud Icon */}
            <div className="absolute inset-0 flex items-center justify-center icon-2" style={{opacity: 0}}>
              <svg className="w-20 h-20 text-[#045530]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
              </svg>
            </div>
            {/* Bag Icon */}
            <div className="absolute inset-0 flex items-center justify-center icon-3" style={{opacity: 0}}>
              <svg className="w-20 h-20 text-[#045530]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
              </svg>
            </div>
          </div>
          <p className="text-gray-600">Loading your flight deals...</p>
        </div>
      </div>
    );
  }

  // Show error state if preferences failed to load
  if (!preferences && !loading) {
    return (
      <div className="min-h-screen bg-[#fff0d2] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load preferences</h3>
            <p className="text-gray-600 mb-4">
              We're having trouble loading your travel preferences. Please complete your onboarding to get started.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => router.push('/onboarding')}
                className="bg-[#d5e27b] text-[#045530] px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#c4d16a] transition-colors"
              >
                Complete Onboarding
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffef7]">
      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <div className="bg-[#f9f7ee] pt-4">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-4xl md:ml-48">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-bold text-[#045530]">
                    Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
                  </h1>
                  {preferences?.dreamDestinations && preferences.dreamDestinations.length > 0 && (
                  <p className="text-gray-600 mt-1">
                      Personalized recommendations for {preferences.dreamDestinations.join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex items-center">
                  {/* User profile hidden */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Status Banner */}
        {subscriptionStatus && (
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="max-w-4xl md:ml-48">
              {subscriptionStatus.tier === 'FREE' ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 text-sm">⚠️</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800">Subscription Required</h3>
                        <p className="text-xs text-yellow-700">
                          Start your 7-day free trial to generate personalized flight deals
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push('/pricing')}
                      className="bg-[#045530] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#034a2a] transition-colors"
                    >
                      Start Free Trial
                    </button>
                  </div>
                </div>
              ) : subscriptionStatus.isInTrial ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">🎉</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-blue-800">Free Trial Active</h3>
                        <p className="text-xs text-blue-700">
                          {subscriptionStatus.daysRemaining} days remaining in your trial
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                      {subscriptionStatus.tier} Plan
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">✅</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-green-800">Subscription Active</h3>
                        <p className="text-xs text-green-700">
                          You have full access to all features
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      {subscriptionStatus.tier} Plan
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tot Saved Section - REMOVED */}

        {/* Generate Deals Button */}
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="max-w-4xl md:ml-48">
            <div className="text-center">
              <button
                onClick={handleGenerateDeals}
                disabled={isGeneratingDeals || !preferences}
                className="bg-[#045530] text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-[#034a2a] transition-colors flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4" />
                {isGeneratingDeals ? 'Generating Deals...' : 'Generate 6 AI Deals'}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Generate personalized flight deals based on your preferences
              </p>
            </div>
          </div>
        </div>


        {/* Bulk Actions */}
        {filteredAndSortedRecommendations.length > 0 && (
          <div className="px-4 sm:px-6 lg:px-8 mb-4">
            <div className="max-w-4xl md:ml-48">
              <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={handleSelectAll}
                      className={`w-4 h-4 border border-gray-200 rounded cursor-pointer flex items-center justify-center ${
                        selectedDeals.size === filteredAndSortedRecommendations.length && filteredAndSortedRecommendations.length > 0 
                          ? 'bg-gray-400' 
                          : 'bg-[#f0eeea]'
                      }`}
                    >
                      {selectedDeals.size === filteredAndSortedRecommendations.length && filteredAndSortedRecommendations.length > 0 && (
                        <svg className="w-3 h-3 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Select All ({selectedDeals.size} selected)
                    </span>
                  </label>
                </div>
                {selectedDeals.size > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    disabled={isDeleting}
                    className="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {isDeleting ? 'Deleting...' : `Delete ${selectedDeals.size} Deals`}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Grid */}
        {filteredAndSortedRecommendations.length === 0 ? (
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl md:ml-48">
              <div className="p-12 text-center">
            <img src="https://i.postimg.cc/3NsB1kwt/Travira-7.png" alt="Travira" className="w-32 h-32 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No flight deals found</h3>
              <p className="text-lg text-gray-600 mb-4">
                Your next favorite deal is coming soon. We will send you deals to your inbox {preferences?.deliveryFrequency ? (
                  <>
                    <span className="text-[#d5e27b] font-semibold">
                      {preferences.deliveryFrequency.replace('_', ' ')}
                    </span>
                  </>
                ) : (
                  <>
                    every <span className="text-[#d5e27b] font-semibold">3 days</span>
                  </>
                )}.
              </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl md:ml-48">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedRecommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                onWatch={handleWatch}
                onBook={handleBook}
                isSelected={selectedDeals.has(recommendation.id)}
                onSelect={handleSelectDeal}
              />
            ))}
            </div>
            </div>
          </div>
        )}

        {/* Your Preferences Section */}
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="max-w-4xl md:ml-48">
            <div className="p-6">
            <h3 className="text-xl font-semibold text-[#045530] mb-4">Your Preferences</h3>
            
            {preferences ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Home Airports</h4>
                  <div className="flex flex-wrap gap-2">
                    {preferences.homeAirports.map((airport) => (
                      <span key={airport} className="bg-[#d5e27b] text-[#045530] px-3 py-1 rounded-full text-sm font-medium">
                        {airport}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Dream Destinations</h4>
                  <div className="flex flex-wrap gap-2">
                    {preferences.dreamDestinations.map((destination) => (
                      <span key={destination} className="bg-[#d5e27b] text-[#045530] px-3 py-1 rounded-full text-sm font-medium">
                        {destination}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Delivery Frequency</h4>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {preferences.deliveryFrequency.replace('_', ' ')}
                  </span>
                </div>

                {/* Max Budget - HIDDEN */}
                {/* {preferences.maxBudget && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Max Budget</h4>
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {preferences.currency} ${preferences.maxBudget}
                    </span>
                  </div>
                )} */}

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Preferred Currency</h4>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {preferences.currency}
                  </span>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setIsPreferencesModalOpen(true)}
                    className="bg-[#d5e27b] text-[#045530] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#c4d16a] transition-colors flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Edit Preferences
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No preferences set</p>
                <button
                  onClick={() => router.push('/onboarding')}
                  className="mt-2 bg-[#d5e27b] text-[#045530] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#c4d16a] transition-colors"
                >
                  Set Up Preferences
                </button>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Recent Saved Deals Section */}
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="max-w-4xl md:ml-48">
            <div className="p-6">
            <h3 className="text-xl font-semibold text-[#045530] mb-4">Recent Saved Deals</h3>
            
            {savedDeals.length > 0 ? (
              <div className="space-y-3">
                {savedDeals.slice(0, 3).map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{deal.origin} → {deal.destination}</div>
                      <div className="text-sm text-gray-500">{deal.airline} • Available in Multiple Dates</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-[#045530]">${deal.price}</div>
                      <div className="text-sm text-gray-500">Save ${deal.savings}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-500">No saved deals yet</p>
                </div>
                <p className="text-xs text-gray-400">Watch deals to save them here</p>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        preferences={preferences}
        onSave={handleSavePreferences}
      />
    </div>
  );
}
