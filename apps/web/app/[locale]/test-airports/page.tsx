'use client';

import { useState, useEffect } from 'react';
import { SearchableAirport } from '@/lib/services/airport-service';

export default function TestAirportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [airports, setAirports] = useState<SearchableAirport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load popular airports on mount
    searchAirports('');
  }, []);

  const searchAirports = async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/airports/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        setAirports(data.data);
      } else {
        setError(data.error || 'Failed to search airports');
        setAirports([]);
      }
    } catch (err) {
      setError('Network error occurred');
      setAirports([]);
      console.error('Error searching airports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchAirports(searchQuery);
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Airport Search Test</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search airports (e.g., JFK, Los Angeles, KJFK, London)"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        <div className="mb-4">
          <p className="text-gray-600">
            Found {airports.length} airports
            {searchQuery && ` for "${searchQuery}"`}
          </p>

          {/* Debug info */}
          <div className="mt-2 p-3 bg-gray-100 rounded text-sm">
            <p><strong>Debug Info:</strong></p>
            <p>API Response: {error ? 'Error' : 'Success'}</p>
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
            <p>Search Query: "{searchQuery}"</p>
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/test-airports');
                  const data = await response.json();
                  console.log('Test API response:', data);
                  alert('Check console for test results');
                } catch (err) {
                  console.error('Test API error:', err);
                  alert('Test API failed - check console');
                }
              }}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-xs"
            >
              Test API Connection
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Loading airports...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {airports.map((airport) => (
              <div
                key={airport.iata}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {airport.iata}
                    </h3>
                    <p className="text-sm text-gray-600">{airport.icao}</p>
                  </div>
                  {airport.popular && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                
                <h4 className="font-medium text-gray-900 mb-1">
                  {airport.cityName}, {airport.countryName}
                </h4>
                
                <p className="text-sm text-gray-600 line-clamp-2">
                  {airport.name}
                </p>
              </div>
            ))}
          </div>
        )}

        {!loading && airports.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchQuery ? 'No airports found. Try a different search term.' : 'No airports loaded.'}
            </p>
          </div>
        )}

        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Examples:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['JFK', 'LAX', 'LHR', 'NRT', 'KJFK', 'London', 'Tokyo', 'New York'].map((example) => (
              <button
                key={example}
                onClick={() => {
                  setSearchQuery(example);
                  searchAirports(example);
                }}
                className="text-left p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
