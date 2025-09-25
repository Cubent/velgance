import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Le tendenze della moda 2025 - Velgance Agency',
  description: 'Scopri le nuove tendenze che definiranno il prossimo anno nel mondo della moda e dello stile.',
};

export default function Tendenze2025Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div 
        className="py-24 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(https://i.postimg.cc/kXWHnjK1/Full-Body-Picture-4.png)'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Tag className="w-4 h-4 text-white" />
              <span className="text-sm text-white/80 uppercase tracking-wide">Tendenze</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 italic" style={{ fontFamily: 'serif' }}>
              Le tendenze della moda 2025
            </h1>
            <div className="flex items-center justify-center gap-2 text-white/80">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">15 Gennaio 2025</span>
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
              Il 2025 si presenta come un anno rivoluzionario per il mondo della moda, con tendenze che 
              riflettono i cambiamenti sociali, tecnologici e ambientali della nostra epoca.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              Sostenibilità e Consapevolezza
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              La sostenibilità non è più solo una tendenza, ma una necessità. I brand stanno investendo 
              massicciamente in materiali riciclati, processi produttivi a basso impatto ambientale e 
              modelli di business circolari. I consumatori richiedono trasparenza e autenticità, 
              spingendo l'industria verso pratiche più etiche e responsabili.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              Tecnologia e Innovazione
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              L'intelligenza artificiale sta rivoluzionando il design, permettendo la creazione di 
              capi personalizzati e la previsione delle tendenze. I tessuti intelligenti, che si 
              adattano alle condizioni ambientali, stanno emergendo come una delle innovazioni 
              più interessanti del settore.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              Diversità e Inclusività
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              La rappresentazione sta finalmente riflettendo la diversità del mondo reale. Le 
              passerelle e le campagne pubblicitarie includono modelli di tutte le età, 
              corporature, etnie e abilità, creando un panorama moda più autentico e inclusivo.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              Colori e Stili
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              I colori del 2025 si ispirano alla natura e alla tecnologia: verdi profondi, 
              blu elettrici e tonalità metalliche. Gli stili oscillano tra minimalismo 
              estremo e maximalismo controllato, con un focus particolare sui dettagli 
              artigianali e sulla qualità dei materiali.
            </p>

            <div className="bg-gray-50 p-8 rounded-lg my-12">
              <h3 className="text-2xl font-light text-black mb-4 italic" style={{ fontFamily: 'serif' }}>
                Cosa Aspettarsi
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Il 2025 segna l'inizio di una nuova era nella moda, dove creatività, 
                sostenibilità e tecnologia si fondono per creare esperienze uniche e 
                significative. I consumatori non sono più solo acquirenti, ma partecipanti 
                attivi in un ecosistema moda più consapevole e connesso.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
