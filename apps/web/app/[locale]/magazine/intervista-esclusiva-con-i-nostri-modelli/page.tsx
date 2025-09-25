import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Intervista esclusiva con i nostri modelli - Velgance Agency',
  description: 'Le storie personali e i sogni dei talenti che lavorano con Velgance Agency.',
};

export default function IntervistaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div 
        className="py-24 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1602743297108-4c9061884285?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Tag className="w-4 h-4 text-white" />
              <span className="text-sm text-white/80 uppercase tracking-wide">Interviste</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 italic" style={{ fontFamily: 'serif' }}>
              Intervista esclusiva con i nostri modelli
            </h1>
            <div className="flex items-center justify-center gap-2 text-white/80">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">8 Gennaio 2025</span>
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
              Abbiamo incontrato alcuni dei nostri modelli più talentuosi per scoprire le loro 
              storie, i loro sogni e cosa significa per loro lavorare nel mondo della moda.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              Le Storie Dietro i Volti
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Ogni modello ha una storia unica da raccontare. Dalle loro origini alle loro 
              aspirazioni, scopriamo cosa li spinge a perseguire una carriera nella moda 
              e come Velgance Agency li ha aiutati a realizzare i loro sogni.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              I Sogni e le Aspirazioni
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              I nostri modelli condividono le loro ambizioni più profonde, dai progetti 
              futuri alle collaborazioni che sognano di realizzare. Ogni intervista 
              rivela la passione e la dedizione che li caratterizza.
            </p>

            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              L'Esperienza con Velgance
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Scopriamo come l'agenzia ha influenzato le loro carriere, le opportunità 
              che hanno ricevuto e l'ambiente di lavoro che li circonda. Le testimonianze 
              rivelano l'approccio unico di Velgance nel supportare i talenti.
            </p>

            <div className="bg-gray-50 p-8 rounded-lg my-12">
              <h3 className="text-2xl font-light text-black mb-4 italic" style={{ fontFamily: 'serif' }}>
                La Famiglia Velgance
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Queste interviste mostrano come Velgance Agency non sia solo un'agenzia, 
                ma una famiglia che supporta e nutre i talenti emergenti, creando 
                opportunità uniche nel mondo della moda.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
