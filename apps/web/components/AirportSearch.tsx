'use client';

import { useState, useEffect } from 'react';
import airportsData from '@/app/[locale]/airport list/airports';

interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  icao: string;
  lat: string;
  lon: string;
  state: string;
  woeid: string;
  tz: string;
  phone: string;
  type: string;
  email: string;
  url: string;
  runway_length: string | null;
  elev: string | null;
  direct_flights: string;
  carriers: string;
}

interface AirportSearchProps {
  selectedAirports: string[];
  onAirportToggle: (airport: string) => void;
  placeholder?: string;
  className?: string;
}

export function AirportSearch({ 
  selectedAirports, 
  onAirportToggle, 
  placeholder = "Search for airport (e.g., Los Angeles, LAX, John F Kennedy)",
  className = ""
}: AirportSearchProps) {
  const [airportSearch, setAirportSearch] = useState('');
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([]);

  // Define popular airports (major international airports)
  const popularAirportCodes = [
    'JFK', 'LGA', 'EWR', 'LAX', 'ORD', 'MDW', 'ATL', 'DFW', 'DEN', 'SFO', 'LAS', 'SEA', 'MIA', 'BOS',
    'LHR', 'LGW', 'CDG', 'ORY', 'FRA', 'MUC', 'AMS', 'FCO', 'MXP', 'MAD', 'BCN', 'ZUR', 'VIE', 'CPH',
    'NRT', 'HND', 'ICN', 'PEK', 'PVG', 'HKG', 'SIN', 'BKK', 'KUL', 'CGK', 'MNL', 'TPE', 'BOM', 'DEL',
    'DXB', 'AUH', 'DOH', 'YYZ', 'YVR', 'YUL', 'YYC', 'SYD', 'MEL', 'BNE', 'PER', 'AKL', 'GRU', 'GIG'
  ];

  // Filter airports when search changes
  useEffect(() => {
    if (airportSearch.trim()) {
      const lowerQuery = airportSearch.toLowerCase();
      const filtered = airportsData.filter(airport => 
        airport.code.toLowerCase().includes(lowerQuery) ||
        airport.icao.toLowerCase().includes(lowerQuery) ||
        airport.name.toLowerCase().includes(lowerQuery) ||
        airport.city.toLowerCase().includes(lowerQuery) ||
        airport.country.toLowerCase().includes(lowerQuery)
      ).slice(0, 50);
      setFilteredAirports(filtered);
    } else {
      // Show no airports when no search
      setFilteredAirports([]);
    }
  }, [airportSearch]);

  const handleAirportSelect = (airport: Airport) => {
    const airportDisplay = `${airport.code} - ${airport.city}`;
    onAirportToggle(airportDisplay);
    setAirportSearch('');
  };

  return (
    <div className={className}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={airportSearch}
          onChange={(e) => setAirportSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d5e27b] focus:border-transparent"
          style={{ color: '#045530' }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && filteredAirports.length > 0 && !airportLoading) {
              handleAirportSelect(filteredAirports[0]);
            }
          }}
        />
      </div>

      {/* Search Results */}
      {airportSearch && (
        <div className="mt-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-[#d5e27b] [&::-webkit-scrollbar-thumb]:rounded-full">
          {filteredAirports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No airports found. Try a different search term.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 p-2">
              {filteredAirports.map((airport) => {
                const airportDisplay = `${airport.code} - ${airport.city}`;
                const isSelected = selectedAirports.includes(airportDisplay);
                
                return (
                  <button
                    key={airport.code}
                    onClick={() => handleAirportSelect(airport)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left ${
                      isSelected
                        ? 'border-[#d5e27b] bg-[#d5e27b] text-[#045530]'
                        : 'border-gray-200 bg-white hover:border-[#d5e27b]/50 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold" style={{ color: '#045530' }}>{airport.code}</div>
                    <div className="text-xs" style={{ color: '#045530' }}>{airport.city}, {airport.country}</div>
                    <div className="text-xs text-gray-500 truncate">{airport.name}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}