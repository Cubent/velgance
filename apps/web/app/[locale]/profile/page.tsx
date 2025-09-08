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
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'deals'>('profile');

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Account Settings
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
                onClick={() => setActiveTab('deals')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'deals'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Deals
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Account Settings Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
                <UserProfile />
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

            {/* My Deals Tab */}
            {activeTab === 'deals' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">My Flight Deals</h2>
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
                            <p className="text-sm text-gray-600">
                              {new Date(deal.departureDate).toLocaleDateString()}
                              {deal.returnDate && ` - ${new Date(deal.returnDate).toLocaleDateString()}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">${deal.price}</div>
                            <div className="text-sm text-gray-500 line-through">${deal.originalPrice}</div>
                            <div className="text-sm text-green-600">Save ${deal.savings}</div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <a
                            href={deal.bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block"
                          >
                            Book Now
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No flight deals yet. We'll notify you when we find great deals!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
