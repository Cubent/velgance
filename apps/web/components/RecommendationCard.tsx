'use client';

import { useState } from 'react';
import Image from 'next/image';

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
}

interface RecommendationCardProps {
  recommendation: FlightRecommendation;
  onWatch: (id: string) => void;
  onBook: (url: string) => void;
}

const AIRPORT_IMAGES: Record<string, string> = {
  // Major US airports
  'LAX': '/images/cities/los-angeles.jpg',
  'JFK': '/images/cities/new-york.jpg',
  'ORD': '/images/cities/chicago.jpg',
  'DFW': '/images/cities/dallas.jpg',
  'SFO': '/images/cities/san-francisco.jpg',
  'SEA': '/images/cities/seattle.jpg',
  'MIA': '/images/cities/miami.jpg',
  
  // International destinations
  'NRT': '/images/cities/tokyo.jpg',
  'CDG': '/images/cities/paris.jpg',
  'LHR': '/images/cities/london.jpg',
  'FCO': '/images/cities/rome.jpg',
  'BCN': '/images/cities/barcelona.jpg',
  'AMS': '/images/cities/amsterdam.jpg',
  'FRA': '/images/cities/frankfurt.jpg',
  'ZUR': '/images/cities/zurich.jpg',
  'IST': '/images/cities/istanbul.jpg',
  'DXB': '/images/cities/dubai.jpg',
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
  
  const originImage = AIRPORT_IMAGES[recommendation.origin] || '/images/cities/default.jpg';
  const destinationImage = AIRPORT_IMAGES[recommendation.destination] || '/images/cities/default.jpg';

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Header with destination images */}
      <div className="relative h-48 bg-gradient-to-r from-green-400 to-green-600">
        <div className="absolute inset-0 flex">
          <div className="flex-1 relative">
            <Image
              src={originImage}
              alt={`${recommendation.origin} departure`}
              fill
              className="object-cover opacity-80"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-20" />
            <div className="absolute bottom-4 left-4 text-white">
              <div className="text-2xl font-bold">{recommendation.origin}</div>
              <div className="text-sm opacity-90">Departure</div>
            </div>
          </div>
          
          <div className="w-12 flex items-center justify-center">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <Image
              src={destinationImage}
              alt={`${recommendation.destination} arrival`}
              fill
              className="object-cover opacity-80"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-20" />
            <div className="absolute bottom-4 right-4 text-white text-right">
              <div className="text-2xl font-bold">{recommendation.destination}</div>
              <div className="text-sm opacity-90">Arrival</div>
            </div>
          </div>
        </div>
        
        {/* Deal quality badge */}
        {recommendation.dealQuality && (
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDealQualityColor(recommendation.dealQuality)}`}>
              {recommendation.dealQuality.charAt(0).toUpperCase() + recommendation.dealQuality.slice(1)} Deal
            </span>
          </div>
        )}
        
        {/* Watch button */}
        <button
          onClick={() => onWatch(recommendation.id)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
            recommendation.isWatched
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill={recommendation.isWatched ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Price and dates */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-3xl font-bold text-green-600">
              ${recommendation.price.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">{recommendation.currency}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              {formatDate(recommendation.departureDate)}
              {recommendation.returnDate && (
                <>
                  <span className="mx-2">→</span>
                  {formatDate(recommendation.returnDate)}
                </>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {recommendation.returnDate ? 'Round trip' : 'One way'}
            </div>
          </div>
        </div>

        {/* Flight details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span className="text-sm font-medium">{recommendation.airline}</span>
              {recommendation.flightNumber && (
                <span className="text-xs text-gray-500">({recommendation.flightNumber})</span>
              )}
            </div>
            <span className="text-sm text-gray-600">{recommendation.duration}</span>
          </div>

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

          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-sm text-gray-600">
              Carry-on: {recommendation.baggageInfo.carry_on} | Checked: {recommendation.baggageInfo.checked}
            </span>
          </div>
        </div>

        {/* AI Summary */}
        {recommendation.aiSummary && (
          <div className="bg-green-50 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div>
                <div className="text-xs font-medium text-green-800 mb-1">AI Insight</div>
                <p className="text-sm text-green-700">{recommendation.aiSummary}</p>
              </div>
            </div>
          </div>
        )}

        {/* Confidence score */}
        {recommendation.confidenceScore && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Confidence Score</span>
            <span className={`text-sm font-medium ${getConfidenceColor(recommendation.confidenceScore)}`}>
              {Math.round(recommendation.confidenceScore * 100)}%
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => recommendation.bookingUrl && onBook(recommendation.bookingUrl)}
            disabled={!recommendation.bookingUrl}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Book Now
          </button>
          {recommendation.otaUrl && (
            <button
              onClick={() => onBook(recommendation.otaUrl!)}
              className="flex-1 border border-green-600 text-green-600 py-3 px-4 rounded-lg font-medium hover:bg-green-50 transition-colors"
            >
              Compare Prices
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
