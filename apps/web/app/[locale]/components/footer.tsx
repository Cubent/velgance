import Link from 'next/link';
import Image from 'next/image';
import { TextHoverEffect } from '../(home)/components/TextHoverEffect';
import { useState } from 'react';

export const Footer = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  return (
    <footer className="border-t border-gray-200" style={{ backgroundColor: '#141414' }}>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        {/* Main content */}
        <div className="mb-12">
          {/* Title */}
          <div className="flex flex-col justify-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6 italic" style={{ fontFamily: 'serif' }}>
              Connettendo talento e opportunità
            </h2>
          </div>
        </div>

        {/* Navigation and Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Navigation */}
          <div>
            <button 
              onClick={() => toggleSection('navigation')}
              className="flex items-center justify-between w-full text-white font-semibold mb-4 lg:mb-4"
            >
              <span>Navigazione</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 lg:hidden ${openSections.navigation ? 'rotate-45' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <ul className={`space-y-2 transition-all duration-200 ${openSections.navigation ? 'block' : 'hidden lg:block'}`}>
              <li>
                <Link href="/models" className="text-gray-300 hover:text-white transition-colors">
                  Modelli
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contattaci
                </Link>
              </li>
              <li>
                <Link href="/magazine" className="text-gray-300 hover:text-white transition-colors">
                  Magazine
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-300 hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/models/application" className="text-gray-300 hover:text-white transition-colors">
                  Candidati
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <button 
              onClick={() => toggleSection('company')}
              className="flex items-center justify-between w-full text-white font-semibold mb-4 lg:mb-4"
            >
              <span>Azienda</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 lg:hidden ${openSections.company ? 'rotate-45' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <ul className={`space-y-2 transition-all duration-200 ${openSections.company ? 'block' : 'hidden lg:block'}`}>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  Chi Siamo
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white transition-colors">
                  Carriere
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-300 hover:text-white transition-colors">
                  Stampa
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <button 
              onClick={() => toggleSection('legal')}
              className="flex items-center justify-between w-full text-white font-semibold mb-4 lg:mb-4"
            >
              <span>Legale</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 lg:hidden ${openSections.legal ? 'rotate-45' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <ul className={`space-y-2 transition-all duration-200 ${openSections.legal ? 'block' : 'hidden lg:block'}`}>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Termini e Condizioni
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-white font-semibold mb-4">Seguici</h3>
            <div className="flex space-x-4 mb-4">
              <a 
                href="https://linkedin.com/company/velgance" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com/velgance" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com/velgance" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
            <p className="text-gray-300 text-sm">
              Resta aggiornato con le nostre ultime novità
            </p>
          </div>
        </div>

        {/* Bottom - Logo, Description and Copyright */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div className="flex flex-col mb-4 lg:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <p className="whitespace-nowrap font-normal text-lg text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
                Velgance Agency
              </p>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed max-w-md">
              Siamo più di una semplice agenzia: una community che valorizza la diversità, la professionalità e la creatività. Scopri come trasformare la tua carriera nel mondo della moda con noi.
            </p>
            </div>
            
            <div className="text-xs text-gray-400">
              Copyright © 2009–2025, Velgance Agency. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
