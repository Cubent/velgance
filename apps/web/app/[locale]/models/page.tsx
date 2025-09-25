'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { Model } from '../../../lib/models';

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const search = urlParams.get('search');
      
      try {
        const url = search ? `/api/models?search=${encodeURIComponent(search)}` : '/api/models';
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          setModels(data);
          if (search) {
            setSearchQuery(search);
          }
        } else {
          console.error('Failed to fetch models');
        }
      } catch (error) {
        console.error('Error loading models:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      const url = query.trim() ? `/api/models?search=${encodeURIComponent(query)}` : '/api/models';
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setModels(data);
      } else {
        console.error('Failed to search models');
      }
    } catch (error) {
      console.error('Error searching models:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-5xl lg:text-6xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              I nostri modelli
            </h1>
            <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto mb-8">
              Scopri i talenti della nostra agenzia
            </p>
          </div>
        </div>
      </div>

      {/* Models Grid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            </div>
          ) : models.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nessun modello trovato</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-12">
              {models.map((model) => (
                <Link
                  key={model.id}
                  href={`/models/${model.id}`}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg aspect-square mb-3">
                    <img
                      src={model.image}
                      alt={`${model.firstName} ${model.lastName}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>
                  <h3 className="text-lg font-light text-gray-600 text-center italic" style={{ fontFamily: 'serif' }}>
                    {model.firstName} {model.lastName}
                  </h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
