'use client';

import { useState, useEffect } from 'react';
import { searchDestinations, City, Country } from '@/lib/database/airports';

interface DestinationSearchProps {
  selectedDestinations: string[];
  onToggleDestination: (destination: string) => void;
}

export default function DestinationSearch({ selectedDestinations, onToggleDestination }: DestinationSearchProps) {
  const [destinationSearch, setDestinationSearch] = useState('');
  const [filteredDestinations, setFilteredDestinations] = useState<(City | Country)[]>([]);

  // Filter destinations when search changes
  useEffect(() => {
    if (destinationSearch.trim() === '') {
      setFilteredDestinations([]);
    } else {
      setFilteredDestinations(searchDestinations(destinationSearch));
    }
  }, [destinationSearch]);

  const handleDestinationSelect = (destination: City | Country) => {
    const isCity = 'countryCode' in destination;
    const destinationDisplay = isCity
      ? `${destination.name}, ${destination.countryName}` // City
      : destination.name; // Country
    
    onToggleDestination(destinationDisplay);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#045530' }}>
          Dream Destinations
        </label>
        <input
          type="text"
          placeholder="Search for destinations (e.g., Japan, Paris, Thailand)"
          value={destinationSearch}
          onChange={(e) => setDestinationSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d5e27b] focus:border-transparent"
          style={{ 
            color: '#045530'
          }}
        />
      </div>

      {destinationSearch && filteredDestinations.length > 0 && (
        <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-[#d5e27b] [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="grid grid-cols-1 gap-2">
            {filteredDestinations.map((destination) => {
              const isCity = 'countryCode' in destination;
              const destinationDisplay = isCity
                ? `${destination.name}, ${destination.countryName}` // City
                : destination.name; // Country
              const key = isCity ? `city-${destination.name}-${destination.countryCode}` : `country-${destination.code}`;
              const isSelected = selectedDestinations.includes(destinationDisplay);

              return (
                <button
                  key={key}
                  onClick={() => handleDestinationSelect(destination)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left ${
                    isSelected
                      ? 'border-[#d5e27b] bg-[#d5e27b] text-[#045530]'
                      : 'border-gray-200 bg-white hover:border-[#d5e27b]/50'
                  }`}
                  style={isSelected ? {} : { color: '#045530' }}
                >
                  <div className="font-semibold">{destination.name}</div>
                  {isCity && (
                    <div className="text-xs text-gray-600">{(destination as City).countryName}</div>
                  )}
                  {!isCity && (
                    <div className="text-xs text-gray-600">{(destination as Country).continent}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedDestinations.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2" style={{ color: '#045530' }}>
            Selected destinations:
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedDestinations.map((destination) => (
              <span
                key={destination}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#d5e27b] text-[#045530] font-medium"
              >
                {destination}
                <button
                  onClick={() => onToggleDestination(destination)}
                  className="ml-2 text-[#045530] hover:text-[#045530]/80"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
