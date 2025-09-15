'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getCityNameFromAirportCode } from '@/lib/airport-utils';

interface LayoverInfo {
  airport: string;
  duration: string;
}

interface BaggageInfo {
  carry_on: string;
  checked: string;
}

interface FlightRecommendation {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  price: number;
  currency: string;
  originalPrice?: number;
  originalCurrency?: string;
  airline: string;
  flightNumber?: string;
  layovers: LayoverInfo[];
  duration: string;
  baggageInfo: BaggageInfo;
  aiSummary?: string;
  confidenceScore?: number;
  dealQuality?: string;
  bookingUrl?: string;
  otaUrl?: string;
  isWatched: boolean;
  isAlternative?: boolean;
  cityImageUrl?: string;
}

interface RecommendationCardProps {
  recommendation: FlightRecommendation;
  onWatch: (id: string) => void;
  onBook: (url: string) => void;
}

const AIRPORT_IMAGES: Record<string, string> = {
  // Major US airports
  'LAX': 'https://images.unsplash.com/photo-1506905925346-14b1e0d35b36?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'JFK': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'ORD': 'https://images.unsplash.com/photo-1513642628802-999033fb4e54?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'DFW': 'https://images.unsplash.com/photo-1506905925346-14b1e0d35b36?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'SFO': 'https://images.unsplash.com/photo-1506905925346-14b1e0d35b36?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'SEA': 'https://images.unsplash.com/photo-1506905925346-14b1e0d35b36?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'MIA': 'https://images.unsplash.com/photo-1506905925346-14b1e0d35b36?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // International destinations
  'NRT': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2094&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'CDG': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'LHR': 'https://images.unsplash.com/photo-1513635269975-59663e0eb291?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'FCO': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'BCN': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'AMS': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'FRA': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'ZUR': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'IST': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'DXB': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'DPS': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'MLE': 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'SYD': 'https://images.unsplash.com/photo-1506905925346-14b1e0d35b36?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};


const getDealQualityColor = (quality?: string) => {
  switch (quality) {
    case 'excellent':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'good':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'fair':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getConfidenceColor = (score?: number) => {
  if (!score) return 'text-gray-500';
  if (score >= 0.8) return 'text-green-600';
  if (score >= 0.6) return 'text-yellow-600';
  return 'text-red-600';
};

export default function RecommendationCard({ 
  recommendation, 
  onWatch, 
  onBook 
}: RecommendationCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const originImage = AIRPORT_IMAGES[recommendation.origin] || '/images/cities/default.jpg';
  const destinationImage = recommendation.cityImageUrl || AIRPORT_IMAGES[recommendation.destination] || '/images/cities/default.jpg';

  return (
    <div className="bg-white rounded-lg transition-all duration-300 overflow-hidden border border-gray-100 relative">
      {/* Destination Image Section */}
      <div className="bg-white p-4">
        <div 
          className="w-full h-40 sm:h-32 rounded-lg overflow-hidden"
          style={{
            backgroundImage: `url(${destinationImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
        </div>
      </div>

      {/* Flight Route Section */}
      <div className="relative bg-white px-4 py-3">
        <div className="flex items-center justify-center space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#045530]">{recommendation.origin}</div>
            <div className="text-sm text-gray-600">{getCityNameFromAirportCode(recommendation.origin)}</div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="bg-[#fff0d2] rounded-full p-2 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#045530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-[#045530]">{recommendation.destination}</div>
            <div className="text-sm text-gray-600">{getCityNameFromAirportCode(recommendation.destination)}</div>
          </div>
        </div>
        
        {/* Round trip indicator */}
        <div className="text-center mt-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {recommendation.returnDate ? 'Round trip' : 'One way'}
          </span>
        </div>
      </div>

      {/* Alternative destination label */}
      {recommendation.isAlternative && (
        <div className="absolute top-2 right-2">
          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full border border-orange-200">
            Alternative
          </span>
        </div>
      )}
      
      {/* Share button */}
      <button
        onClick={() => {
          const shareData = {
            title: `Flight Deal: ${recommendation.origin} to ${recommendation.destination}`,
            text: `Great flight deal: ${recommendation.origin} to ${recommendation.destination} for ${recommendation.price}`,
            url: window.location.href
          };
          if (navigator.share) {
            navigator.share(shareData);
          } else {
            navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
            alert('Flight deal copied to clipboard!');
          }
        }}
        className="absolute top-2 left-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      </button>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="mb-3 text-center">
          <div className="text-2xl font-bold text-[#045530]">
{recommendation.price.toLocaleString()} {recommendation.currency}
          </div>
          {recommendation.originalPrice && recommendation.originalCurrency && (
            <div className="text-sm text-gray-500 mt-1">
              Originally {recommendation.originalPrice.toLocaleString()} {recommendation.originalCurrency}
            </div>
          )}
          <div className="h-px border-t border-dashed border-gray-300 mt-1"></div>
        </div>

        {/* Dates with Actual Ticket Stub Cutouts */}
        <div className="mb-3 relative">
          <div className="flex items-center justify-center relative">
            {/* Date content */}
            <div className="text-center px-6">
              <div className="text-sm text-gray-600">
                Available in Multiple Dates
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {recommendation.returnDate ? 'Round trip' : 'One way'}
              </div>
            </div>
          </div>
          
          {/* Left ticket stub cutout - actual cutout */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-[#fffef7] rounded-r-full border-r-2 border-dashed border-gray-300"></div>
          
          {/* Right ticket stub cutout - actual cutout */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-[#fffef7] rounded-l-full border-l-2 border-dashed border-gray-300"></div>
        </div>

        {/* Flight details */}
        <div className="space-y-2 mb-3">
          {/* Airline display removed as requested */}

          {recommendation.layovers && recommendation.layovers.length > 0 && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm text-gray-600">
                {recommendation.layovers.length} stop{recommendation.layovers.length > 1 ? 's' : ''}: {' '}
                {recommendation.layovers.map(layover => `${layover.airport} (${layover.duration})`).join(', ')}
              </span>
            </div>
          )}

        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          <button
            onClick={() => recommendation.bookingUrl && onBook(recommendation.bookingUrl)}
            disabled={!recommendation.bookingUrl}
            className="w-full bg-[#d5e27b] text-[#045530] py-3 px-4 rounded-lg text-sm font-semibold hover:bg-[#c4d16a] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
          >
            Book Now
          </button>
          
          {/* Save and Archive buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => onWatch(recommendation.id)}
              className={`flex-1 p-2 rounded-lg transition-colors ${
                recommendation.isWatched
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4 mx-auto" fill={recommendation.isWatched ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl border border-gray-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete Flight Deal
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this flight deal? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setShowDeleteConfirm(false);
                    try {
                      console.log('Deleting flight:', recommendation.id);
                      const response = await fetch(`/api/recommendations/${recommendation.id}`, {
                        method: 'DELETE',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                      });
                      
                      console.log('Delete response status:', response.status);
                      
                      if (response.ok) {
                        console.log('Flight deleted successfully');
                        // Force a hard refresh to ensure the UI updates
                        window.location.href = window.location.href;
                      } else {
                        const errorData = await response.json();
                        console.error('Failed to delete flight:', errorData);
                        alert('Failed to delete flight deal. Please try again.');
                      }
                    } catch (error) {
                      console.error('Error deleting flight:', error);
                      alert('Error deleting flight deal. Please try again.');
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
