import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diversità e inclusione nel fashion - Velgance Agency',
  description: 'Come il mondo della moda sta abbracciando la diversità e promuovendo l\'inclusività.',
};

export default function DiversitaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div 
        className="py-24 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=600&fit=crop&crop=center)'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Tag className="w-4 h-4 text-white" />
              <span className="text-sm text-white/80 uppercase tracking-wide">Diversità</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 italic" style={{ fontFamily: 'serif' }}>
              Diversità e inclusione nel fashion
            </h1>
            <div className="flex items-center justify-center gap-2 text-white/80">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">3 Gennaio 2025</span>
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
              Il mondo della moda sta finalmente abbracciando la diversità e l'inclusività, 
              creando uno spazio più rappresentativo e autentico per tutti.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              Rappresentazione Autentica
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              La diversità nella moda non è più solo una tendenza, ma una necessità. 
              I brand stanno includendo modelli di tutte le età, corporature, etnie e 
              abilità, riflettendo la ricchezza e la varietà del mondo reale.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              Inclusività nelle Passerelle
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Le sfilate stanno diventando più inclusive, con designer che abbracciano 
              la diversità come fonte di ispirazione e creatività. Ogni modello porta 
              la propria storia e personalità, arricchendo la narrativa della moda.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              L'Impatto Sociale
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              L'inclusività nella moda ha un impatto profondo sulla società, promuovendo 
              l'accettazione di sé e la celebrazione delle differenze. I messaggi positivi 
              raggiungono milioni di persone, influenzando la percezione della bellezza.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              Il Futuro Inclusivo
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Il movimento verso l'inclusività sta ridefinendo gli standard di bellezza 
              e creando opportunità per talenti che prima erano esclusi. La moda sta 
              diventando un veicolo per il cambiamento sociale positivo.
            </p>

            <div className="bg-gray-50 p-8 rounded-lg my-12">
              <h3 className="text-2xl font-light text-black mb-4 italic" style={{ fontFamily: 'serif' }}>
                Una Moda per Tutti
              </h3>
              <p className="text-gray-600 leading-relaxed">
                La diversità e l'inclusività stanno trasformando la moda in un'industria 
                più rappresentativa e autentica. Ogni persona merita di vedersi rappresentata 
                e celebrata nel mondo della moda, indipendentemente dal proprio background 
                o dalle proprie caratteristiche fisiche.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
