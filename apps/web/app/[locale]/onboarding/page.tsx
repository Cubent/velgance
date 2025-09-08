'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

interface OnboardingData {
  homeAirports: string[];
  dreamDestinations: string[];
  deliveryFrequency: string;
  maxBudget?: number;
  preferredAirlines: string[];
}

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily', description: 'Get deals every day' },
  { value: 'every_3_days', label: 'Every 3 Days', description: 'Moderate frequency' },
  { value: 'weekly', label: 'Weekly', description: 'Once per week' },
  { value: 'bi_weekly', label: 'Bi-weekly', description: 'Every two weeks' },
  { value: 'monthly', label: 'Monthly', description: 'Once per month' },
];

const POPULAR_AIRPORTS = [
  'LAX', 'JFK', 'ORD', 'DFW', 'DEN', 'SFO', 'SEA', 'LAS', 'PHX', 'IAH',
  'CLT', 'MIA', 'MCO', 'EWR', 'MSP', 'DTW', 'PHL', 'LGA', 'BWI', 'MDW'
];

const POPULAR_DESTINATIONS = [
  'Japan', 'Paris', 'London', 'Iceland', 'Italy', 'Greece', 'Thailand', 
  'Australia', 'New Zealand', 'Spain', 'Portugal', 'Germany', 'Netherlands',
  'Norway', 'Switzerland', 'Croatia', 'Turkey', 'Morocco', 'Egypt', 'India'
];

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    homeAirports: [],
    dreamDestinations: [],
    deliveryFrequency: 'weekly',
    preferredAirlines: [],
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayItem = (array: string[], item: string, setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.homeAirports.length > 0;
      case 2:
        return data.dreamDestinations.length > 0;
      case 3:
        return data.deliveryFrequency !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-green-700">Step {currentStep} of 4</span>
            <span className="text-sm text-green-600">{Math.round((currentStep / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Home Airports */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Where do you fly from?</h2>
              <p className="text-gray-600 mb-6">Select your home airport(s) - the places you typically start your journeys.</p>
              
              <div className="grid grid-cols-4 gap-3 mb-6">
                {POPULAR_AIRPORTS.map((airport) => (
                  <button
                    key={airport}
                    onClick={() => toggleArrayItem(data.homeAirports, airport, (arr) => setData({...data, homeAirports: arr}))}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      data.homeAirports.includes(airport)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300 text-gray-700'
                    }`}
                  >
                    {airport}
                  </button>
                ))}
              </div>
              
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Or type another airport code (e.g., ATL)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value.toUpperCase();
                      if (value && !data.homeAirports.includes(value)) {
                        setData({...data, homeAirports: [...data.homeAirports, value]});
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
              </div>

              {data.homeAirports.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Selected airports:</p>
                  <div className="flex flex-wrap gap-2">
                    {data.homeAirports.map((airport) => (
                      <span
                        key={airport}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                      >
                        {airport}
                        <button
                          onClick={() => toggleArrayItem(data.homeAirports, airport, (arr) => setData({...data, homeAirports: arr}))}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Dream Destinations */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Where do you dream of going?</h2>
              <p className="text-gray-600 mb-6">Select countries or cities you'd love to visit. We'll find the best deals to these destinations.</p>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                {POPULAR_DESTINATIONS.map((destination) => (
                  <button
                    key={destination}
                    onClick={() => toggleArrayItem(data.dreamDestinations, destination, (arr) => setData({...data, dreamDestinations: arr}))}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      data.dreamDestinations.includes(destination)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300 text-gray-700'
                    }`}
                  >
                    {destination}
                  </button>
                ))}
              </div>
              
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Or type another destination"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value;
                      if (value && !data.dreamDestinations.includes(value)) {
                        setData({...data, dreamDestinations: [...data.dreamDestinations, value]});
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
              </div>

              {data.dreamDestinations.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Selected destinations:</p>
                  <div className="flex flex-wrap gap-2">
                    {data.dreamDestinations.map((destination) => (
                      <span
                        key={destination}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                      >
                        {destination}
                        <button
                          onClick={() => toggleArrayItem(data.dreamDestinations, destination, (arr) => setData({...data, dreamDestinations: arr}))}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Delivery Frequency */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How often would you like to hear from us?</h2>
              <p className="text-gray-600 mb-6">Choose how frequently you'd like to receive flight deal notifications.</p>
              
              <div className="space-y-3">
                {FREQUENCY_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      data.deliveryFrequency === option.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="frequency"
                      value={option.value}
                      checked={data.deliveryFrequency === option.value}
                      onChange={(e) => setData({...data, deliveryFrequency: e.target.value})}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      data.deliveryFrequency === option.value
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {data.deliveryFrequency === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Optional Preferences */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Any additional preferences?</h2>
              <p className="text-gray-600 mb-6">These are optional but help us find better deals for you.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum budget per trip (optional)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 1500"
                    value={data.maxBudget || ''}
                    onChange={(e) => setData({...data, maxBudget: e.target.value ? Number(e.target.value) : undefined})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred airlines (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Delta, United, American"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const value = (e.target as HTMLInputElement).value.trim();
                        if (value && !data.preferredAirlines.includes(value)) {
                          setData({...data, preferredAirlines: [...data.preferredAirlines, value]});
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {data.preferredAirlines.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {data.preferredAirlines.map((airline) => (
                        <span
                          key={airline}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                        >
                          {airline}
                          <button
                            onClick={() => toggleArrayItem(data.preferredAirlines, airline, (arr) => setData({...data, preferredAirlines: arr}))}
                            className="ml-2 text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-green-600 hover:text-green-700 hover:bg-green-50'
              }`}
            >
              Back
            </button>
            
            <button
              onClick={handleNext}
              disabled={!canProceed() || loading}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                canProceed() && !loading
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Saving...' : currentStep === 4 ? 'Complete Setup' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
