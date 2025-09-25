import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sostenibilità nella moda - Velgance Agency',
  description: 'Come l\'industria della moda sta evolvendo verso pratiche più sostenibili e responsabili.',
};

export default function SostenibilitaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div 
        className="py-24 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(https://i.postimg.cc/kgzRfyhC/Full-Body-Picture-6.png)'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Tag className="w-4 h-4 text-white" />
              <span className="text-sm text-white/80 uppercase tracking-wide">Sostenibilità</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 italic" style={{ fontFamily: 'serif' }}>
              Sostenibilità nella moda
            </h1>
            <div className="flex items-center justify-center gap-2 text-white/80">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">10 Gennaio 2025</span>
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
              L'industria della moda sta attraversando una trasformazione fondamentale, 
              spostando l'attenzione verso pratiche più sostenibili e responsabili nei 
              confronti dell'ambiente e della società.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              Materiali Innovativi
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              La ricerca di materiali sostenibili sta rivoluzionando il settore. Tessuti 
              ricavati da scarti alimentari, fibre sintetiche biodegradabili e materiali 
              riciclati stanno aprendo nuove possibilità creative. L'innovazione tecnologica 
              permette di creare capi belli e funzionali senza compromettere l'ambiente.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              Economia Circolare
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Il modello di business sta evolvendo verso un'economia circolare dove ogni 
              capo ha un ciclo di vita esteso. Programmi di riciclo, riparazione e 
              rivendita stanno diventando parte integrante delle strategie aziendali, 
              riducendo gli sprechi e massimizzando il valore dei prodotti.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              Trasparenza e Tracciabilità
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              I consumatori richiedono sempre più trasparenza sui processi produttivi. 
              La tecnologia blockchain e i sistemi di tracciabilità permettono di 
              seguire l'intero percorso di un capo, dalla materia prima al prodotto 
              finale, garantendo standard etici e ambientali.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              Consapevolezza del Consumatore
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              La crescente consapevolezza dei consumatori sta guidando il cambiamento. 
              Sempre più persone scelgono brand che condividono i loro valori, 
              privilegiando qualità, durabilità e impatto sociale positivo rispetto 
              al semplice prezzo.
            </p>

            <div className="bg-gray-50 p-8 rounded-lg my-12">
              <h3 className="text-2xl font-light text-black mb-4 italic" style={{ fontFamily: 'serif' }}>
                Il Futuro Sostenibile
              </h3>
              <p className="text-gray-600 leading-relaxed">
                La sostenibilità nella moda non è più un'opzione, ma una necessità. 
                L'industria sta dimostrando che è possibile creare bellezza e stile 
                rispettando l'ambiente e le persone. Il futuro della moda è verde, 
                etico e innovativo.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
