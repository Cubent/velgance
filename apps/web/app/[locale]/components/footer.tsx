import Link from 'next/link';
import Image from 'next/image';
import { TextHoverEffect } from '../(home)/components/TextHoverEffect';

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-200">
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

        {/* Bottom - Logo and Description */}
        <div className="flex justify-start">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <p className="whitespace-nowrap font-normal text-lg text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
                Velgance Agency
              </p>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              since 2009
            </p>
            <p className="text-xs text-gray-300 leading-relaxed max-w-md">
              Siamo più di una semplice agenzia: una community che valorizza la diversità, la professionalità e la creatività. Scopri come trasformare la tua carriera nel mondo della moda con noi.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
