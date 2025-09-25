'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Model } from '../../../../lib/models';
import { ArrowLeft, Instagram, Mail, MapPin, Ruler, Weight } from 'lucide-react';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export default function ModelPageClient({ params }: Props) {
  const router = useRouter();
  const [model, setModel] = useState<Model | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modelId, setModelId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setModelId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (modelId) {
      fetchModel(modelId);
    }
  }, [modelId]);

  const fetchModel = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/models/${id}`);
      if (response.ok) {
        const data = await response.json();
        setModel(data);
      } else {
        console.error('Failed to fetch model');
        router.push('/models');
      }
    } catch (error) {
      console.error('Error loading model:', error);
      router.push('/models');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-black mb-4" style={{ fontFamily: 'serif' }}>
            Modello non trovato
          </h1>
          <button
            onClick={() => router.push('/models')}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Torna ai modelli
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 py-4 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-start gap-4">
            <button
              onClick={() => router.push('/models')}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Torna ai modelli
            </button>
          </div>
        </div>
      </div>

      {/* Model Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
        {/* Mobile Name - Show on top on mobile only */}
        <div className="lg:hidden mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-light text-black mb-4 italic" style={{ fontFamily: 'serif' }}>
            {model.firstName} {model.lastName}
          </h1>
          <p className="text-lg text-gray-600">
            Modello professionale
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Model Info */}
          <div className="space-y-8">
            {/* Desktop Name - Hidden on mobile */}
            <div className="hidden lg:block">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-black mb-4 italic" style={{ fontFamily: 'serif' }}>
                {model.firstName} {model.lastName}
              </h1>
              <p className="text-lg text-gray-600">
                Modello professionale
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h2 className="text-2xl font-light text-black italic" style={{ fontFamily: 'serif' }}>
                Contatti
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a
                    href={`mailto:${model.email}`}
                    className="text-gray-700 hover:text-black transition-colors"
                  >
                    {model.email}
                  </a>
                </div>

                {model.igProfileLink && (
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-gray-400" />
                    <a
                      href={model.igProfileLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-black transition-colors"
                    >
                      @{model.igProfileLink.split('/').pop()?.replace('@', '')}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Physical Stats */}
            {(model.height || model.weight || model.location) && (
              <div className="space-y-4">
                <h2 className="text-2xl font-light text-black italic" style={{ fontFamily: 'serif' }}>
                  Dettagli
                </h2>
                
                <div className="space-y-3">
                  {model.height && (
                    <div className="flex items-center gap-3">
                      <Ruler className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{model.height}</span>
                    </div>
                  )}

                  {model.weight && (
                    <div className="flex items-center gap-3">
                      <Weight className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{model.weight}</span>
                    </div>
                  )}

                  {model.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{model.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={`mailto:${model.email}`}
                className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Contatta Modello
              </a>
              
              {model.igProfileLink && (
                <a
                  href={model.igProfileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gray-100 text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Visualizza Instagram
                </a>
              )}
            </div>
          </div>

          {/* Right Side - Model Image */}
          <div className="order-first lg:order-last -mr-4 lg:-mr-8">
            <div className="relative h-full min-h-[600px]">
              <img
                src={model.image}
                alt={`${model.firstName} ${model.lastName}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
