import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Backstage: Dietro le quinte di una sfilata - Velgance Agency',
  description: 'Un\'esclusiva dietro le quinte per scoprire cosa succede prima che i modelli salgano in passerella.',
};

export default function BackstagePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div 
        className="py-24 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(https://i.postimg.cc/RCHsRPsS/Full-Body-Picture-5.png)'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Tag className="w-4 h-4 text-white" />
              <span className="text-sm text-white/80 uppercase tracking-wide">Backstage</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 italic" style={{ fontFamily: 'serif' }}>
              Backstage: Dietro le quinte di una sfilata
            </h1>
            <div className="flex items-center justify-center gap-2 text-white/80">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">12 Gennaio 2025</span>
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
              Dietro ogni sfilata perfetta si nasconde un mondo di preparazione, coordinamento e 
              passione. Vi portiamo dietro le quinte per scoprire i segreti di un evento di moda.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              Le Ore Prima dello Spettacolo
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Le preparazioni iniziano ore prima che il pubblico prenda posto. I modelli arrivano 
              con largo anticipo per le prove di vestizione, mentre il team di styling lavora 
              meticolosamente su ogni dettaglio. L'atmosfera è elettrica, carica di aspettative 
              e adrenalina.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              Il Team Creativo
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Dietro ogni sfilata c'è un team di professionisti: stylist, make-up artist, 
              hair stylist, coordinatori e assistenti. Ognuno ha un ruolo specifico nel 
              creare l'atmosfera perfetta. La coordinazione è fondamentale per garantire 
              che tutto proceda senza intoppi.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              I Modelli e la Preparazione
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              I modelli sono il cuore pulsante della sfilata. Dalle prove di camminata 
              alle sessioni di styling, ogni momento è dedicato a perfezionare la 
              performance. La concentrazione e la professionalità sono essenziali per 
              portare in vita la visione del designer.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              L'Adrenalina del Momento
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Quando le luci si accendono e la musica inizia, tutto il lavoro preparatorio 
              si trasforma in magia. I modelli camminano con sicurezza, i capi prendono 
              vita e il pubblico rimane incantato. È il momento in cui arte, moda e 
              performance si fondono in un'esperienza unica.
            </p>

            <div className="bg-gray-50 p-8 rounded-lg my-12">
              <h3 className="text-2xl font-light text-black mb-4 italic" style={{ fontFamily: 'serif' }}>
                La Magia del Backstage
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Il backstage è dove nascono i sogni della moda. È un mondo di creatività, 
                dedizione e passione che rende possibile la magia che vediamo in passerella. 
                Ogni dettaglio, ogni momento di preparazione, contribuisce a creare 
                un'esperienza indimenticabile.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
