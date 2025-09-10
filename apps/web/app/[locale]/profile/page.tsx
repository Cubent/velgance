'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserProfile } from '@clerk/nextjs';

interface UserPreferences {
  homeAirports: string[];
  dreamDestinations: string[];
  deliveryFrequency: string;
  maxBudget?: number;
  preferredAirlines: string[];
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

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [deals, setDeals] = useState<FlightDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'deals'>('deals');

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in?redirect_url=/profile');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user preferences
      const preferencesResponse = await fetch('/api/user/preferences');
      if (preferencesResponse.ok) {
        const preferencesData = await preferencesResponse.json();
        setPreferences(preferencesData);
      }

      // Fetch user deals
      const dealsResponse = await fetch('/api/user/deals');
      if (dealsResponse.ok) {
        const dealsData = await dealsResponse.json();
        setDeals(dealsData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

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
            {/* Suitcase Icon */}
            <div className="absolute inset-0 flex items-center justify-center icon-3" style={{opacity: 0}}>
              <svg className="w-20 h-20 text-[#045530]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 6h-2V3c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v3H5c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 3h6v3H9V3zm8 15H5V8h14v10z"/>
              </svg>
            </div>
          </div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fff0d2] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={user.imageUrl}
              alt={user.fullName || 'User'}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.fullName || user.firstName || 'Welcome'}
              </h1>
              <p className="text-gray-600">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('deals')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'deals'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Saved Deals
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'preferences'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Travel Preferences
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Account Settings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* My Deals Tab */}
            {activeTab === 'deals' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Saved Flight Deals</h2>
                {deals.length > 0 ? (
                  <div className="space-y-4">
                    {deals.map((deal) => (
                      <div key={deal.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {deal.origin} → {deal.destination}
                            </h3>
                            <p className="text-sm text-gray-600">{deal.airline}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(deal.departureDate).toLocaleDateString()}
                              {deal.returnDate && ` - ${new Date(deal.returnDate).toLocaleDateString()}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">${deal.price}</div>
                            <div className="text-sm text-gray-500 line-through">${deal.originalPrice}</div>
                            <div className="text-sm text-green-600 font-medium">Save ${deal.savings}</div>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            Found {new Date(deal.createdAt).toLocaleDateString()}
                          </span>
                          <a
                            href={deal.bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            Book Now
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No flight deals found yet.</p>
                    <p className="text-sm text-gray-500">
                      Complete your travel preferences to start receiving personalized deals.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Travel Preferences Tab */}
            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Travel Preferences</h2>
                {preferences ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-2">Home Airports</h3>
                      <div className="flex flex-wrap gap-2">
                        {preferences.homeAirports.map((airport) => (
                          <span
                            key={airport}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                          >
                            {airport}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-2">Dream Destinations</h3>
                      <div className="flex flex-wrap gap-2">
                        {preferences.dreamDestinations.map((destination) => (
                          <span
                            key={destination}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                          >
                            {destination}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-2">Delivery Frequency</h3>
                      <p className="text-gray-600 capitalize">{preferences.deliveryFrequency.replace('_', ' ')}</p>
                    </div>

                    {preferences.maxBudget && (
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-2">Max Budget</h3>
                        <p className="text-gray-600">${preferences.maxBudget}</p>
                      </div>
                    )}

                    {preferences.preferredAirlines.length > 0 && (
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-2">Preferred Airlines</h3>
                        <div className="flex flex-wrap gap-2">
                          {preferences.preferredAirlines.map((airline) => (
                            <span
                              key={airline}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                            >
                              {airline}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <button
                        onClick={() => router.push('/onboarding')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Update Preferences
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No travel preferences set yet.</p>
                    <button
                      onClick={() => router.push('/onboarding')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Set Up Preferences
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
                <UserProfile />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
