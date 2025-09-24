'use client';

import React, { useState, useEffect } from 'react';
import type { Model } from '../../../lib/models';
import { X, Instagram, Mail } from 'lucide-react';

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              I nostri modelli
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Scopri i talenti della nostra agenzia
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Cerca per nome..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-3 border-b border-black focus:outline-none focus:border-gray-400 bg-transparent text-center"
              />
            </div>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {models.map((model) => (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg aspect-[3/4] mb-3">
                    <img
                      src={model.image}
                      alt={`${model.firstName} ${model.lastName}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>
                  <h3 className="text-sm font-medium text-black text-center">
                    {model.firstName} {model.lastName}
                  </h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Model Popup */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Close Button */}
              <button
                onClick={() => setSelectedModel(null)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Model Image */}
              <div className="mb-6">
                <img
                  src={selectedModel.image}
                  alt={`${selectedModel.firstName} ${selectedModel.lastName}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>

              {/* Model Info */}
              <div className="space-y-4">
                <h2 className="text-3xl font-light text-black italic" style={{ fontFamily: 'serif' }}>
                  {selectedModel.firstName} {selectedModel.lastName}
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a
                      href={`mailto:${selectedModel.email}`}
                      className="text-gray-700 hover:text-black transition-colors"
                    >
                      {selectedModel.email}
                    </a>
                  </div>

                  {selectedModel.igProfileLink && (
                    <div className="flex items-center gap-3">
                      <Instagram className="w-5 h-5 text-gray-400" />
                      <a
                        href={selectedModel.igProfileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-black transition-colors"
                      >
                        Instagram Profile
                      </a>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedModel(null)}
                    className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Chiudi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
