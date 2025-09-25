import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'La fotografia di moda: arte e tecnica - Velgance Agency',
  description: 'Esploriamo l\'arte della fotografia di moda e le tecniche che creano immagini iconiche.',
};

export default function FotografiaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div 
        className="py-24 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop&crop=center)'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Tag className="w-4 h-4 text-white" />
              <span className="text-sm text-white/80 uppercase tracking-wide">Fotografia</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 italic" style={{ fontFamily: 'serif' }}>
              La fotografia di moda: arte e tecnica
            </h1>
            <div className="flex items-center justify-center gap-2 text-white/80">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">5 Gennaio 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="py-6 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/magazine"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna al Magazine
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              La fotografia di moda è un'arte che combina creatività, tecnica e visione 
              per creare immagini che raccontano storie e ispirano emozioni.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              L'Arte della Composizione
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              La composizione è il cuore della fotografia di moda. Ogni elemento, dal 
              posizionamento del modello alla scelta dell'illuminazione, contribuisce 
              a creare un'immagine che cattura l'attenzione e comunica un messaggio.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              Tecniche di Illuminazione
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              L'illuminazione è fondamentale per creare atmosfere e evidenziare i dettagli 
              dei capi. Dalle luci naturali agli studi professionali, ogni scelta 
              tecnica influenza il risultato finale e l'impatto emotivo dell'immagine.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              La Collaborazione Creativa
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              La fotografia di moda è il risultato di una collaborazione tra fotografo, 
              modello, stylist e team creativo. Ogni membro del team contribuisce con 
              la propria expertise per creare immagini iconiche.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              L'Evoluzione Digitale
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              La tecnologia digitale ha rivoluzionato la fotografia di moda, offrendo 
              nuove possibilità creative e tecniche di post-produzione che permettono 
              di realizzare visioni sempre più audaci e innovative.
            </p>

            <div className="bg-gray-50 p-8 rounded-lg my-12">
              <h3 className="text-2xl font-light text-black mb-4 italic" style={{ fontFamily: 'serif' }}>
                Il Futuro della Fotografia di Moda
              </h3>
              <p className="text-gray-600 leading-relaxed">
                La fotografia di moda continua a evolversi, abbracciando nuove tecnologie 
                e approcci creativi. L'arte e la tecnica si fondono per creare immagini 
                che non solo mostrano i capi, ma raccontano storie e ispirano sogni.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
