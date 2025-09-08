'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import RecommendationCard from '../../../components/RecommendationCard';

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
}

interface UserPreferences {
  homeAirports: string[];
  dreamDestinations: string[];
  deliveryFrequency: string;
  maxBudget?: number;
  preferredAirlines: string[];
}

type SortOption = 'price' | 'destination' | 'date' | 'quality';
type FilterOption = 'all' | 'watched' | 'excellent' | 'good';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<FlightRecommendation[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('price');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchTerm, setSearchTerm] = useState('');

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
      const preferencesData = await preferencesResponse.json();
      
      if (!preferencesData.preferences) {
        // User hasn't completed onboarding
        router.push('/onboarding');
        return;
      }
      
      setPreferences(preferencesData.preferences);
      
      // Fetch flight recommendations
      const recommendationsResponse = await fetch('/api/recommendations');
      const recommendationsData = await recommendationsResponse.json();
      
      if (recommendationsData.success) {
        setRecommendations(recommendationsData.recommendations || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
          return new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime();
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your flight deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Flight Deals Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Personalized recommendations for {preferences?.dreamDestinations.join(', ')}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Refreshing...' : 'Refresh Deals'}
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by destination, origin, or airline..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            {/* Sort */}
            <div className="sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="price">Sort by Price</option>
                <option value="destination">Sort by Destination</option>
                <option value="date">Sort by Date</option>
                <option value="quality">Sort by Deal Quality</option>
              </select>
            </div>
            
            {/* Filter */}
            <div className="sm:w-48">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Deals</option>
                <option value="watched">Watched</option>
                <option value="excellent">Excellent Deals</option>
                <option value="good">Good Deals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-green-600">{recommendations.length}</div>
            <div className="text-sm text-gray-600">Total Deals</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-green-600">
              {recommendations.filter(r => r.isWatched).length}
            </div>
            <div className="text-sm text-gray-600">Watched</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-green-600">
              ${recommendations.length > 0 ? Math.min(...recommendations.map(r => r.price)).toLocaleString() : '0'}
            </div>
            <div className="text-sm text-gray-600">Best Price</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-green-600">
              {recommendations.filter(r => r.dealQuality === 'excellent').length}
            </div>
            <div className="text-sm text-gray-600">Excellent Deals</div>
          </div>
        </div>

        {/* Recommendations Grid */}
        {filteredAndSortedRecommendations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No flight deals found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterBy !== 'all' 
                ? 'Try adjusting your search or filters.'
                : 'We\'re working on finding great deals for you. Check back soon!'}
            </p>
            {!searchTerm && filterBy === 'all' && (
              <button
                onClick={handleRefresh}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Search for Deals
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedRecommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                onWatch={handleWatch}
                onBook={handleBook}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
