'use client';

import Link from 'next/link';
import React from 'react';
import { ArrowRight } from 'lucide-react';

type HomeProps = {
  params: Promise<{
    locale: string;
  }>;
};

const HeroImage = () => {
  return (
    <div 
      className="w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] lg:w-[700px] lg:h-[700px] bg-contain bg-center bg-no-repeat mx-auto"
      style={{
        backgroundImage: 'url(https://i.postimg.cc/N0xr7rpp/Velgance.png)'
      }}
    />
  );
};

const Home = async ({ params }: HomeProps) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'white' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[80vh] sm:min-h-screen bg-white flex items-center justify-center">
        {/* Velgance Background Image */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
        >
          <HeroImage />
        </div>
        
        {/* Elegant Title - Top Left */}
        <div className="absolute top-16 sm:top-20 left-8 z-10 max-w-[280px] sm:max-w-sm lg:max-w-md">
          <h1 className="text-5xl sm:text-4xl lg:text-5xl font-extralight text-[#212121] tracking-wide leading-tight italic" style={{ fontFamily: 'serif' }}>
            Trasformiamo il talento in opportunità
          </h1>
        </div>
        
        {/* Description - Bottom Right */}
        <div className="absolute bottom-20 left-4 right-4 sm:left-auto sm:right-8 z-10 max-w-sm lg:max-w-md text-center sm:text-right">
          <p className="text-base sm:text-lg lg:text-xl text-black leading-relaxed">
            La nostra agenzia connette modelle e modelli con brand, fotografi e aziende in cerca di volti unici.
          </p>
        </div>
        
        {/* Glassy Fade Effect at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white/95 via-white/70 via-white/50 via-white/30 via-white/15 via-white/5 to-transparent backdrop-blur-sm"></div>
      </div>

      {/* Airline Partners Section */}
      <div className="pt-2 pb-1 bg-[#25201f] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Scrolling Airline Logos */}
          <div className="relative overflow-hidden">
            <div className="flex space-x-8 sm:space-x-16 items-center animate-scroll">
              {[
                { name: 'Velgance 1', logo: 'https://i.postimg.cc/Wz7xdmRv/Velgance-10.png' },
                { name: 'Velgance 2', logo: 'https://i.postimg.cc/XJdRbSQX/Velgance-11.png' },
                { name: 'Velgance 3', logo: 'https://i.postimg.cc/fTB6Zvj7/Velgance-5.png' },
                { name: 'Velgance 4', logo: 'https://i.postimg.cc/Y2N5D7vs/Velgance-6.png' },
                { name: 'Velgance 5', logo: 'https://i.postimg.cc/5yJZ97Rg/Velgance-7.png' },
                { name: 'Velgance 6', logo: 'https://i.postimg.cc/X7VTTPF7/Velgance-8.png' }
              ].concat([
                { name: 'Velgance 1', logo: 'https://i.postimg.cc/Wz7xdmRv/Velgance-10.png' },
                { name: 'Velgance 2', logo: 'https://i.postimg.cc/XJdRbSQX/Velgance-11.png' },
                { name: 'Velgance 3', logo: 'https://i.postimg.cc/fTB6Zvj7/Velgance-5.png' },
                { name: 'Velgance 4', logo: 'https://i.postimg.cc/Y2N5D7vs/Velgance-6.png' },
                { name: 'Velgance 5', logo: 'https://i.postimg.cc/5yJZ97Rg/Velgance-7.png' },
                { name: 'Velgance 6', logo: 'https://i.postimg.cc/X7VTTPF7/Velgance-8.png' }
              ]).map((airline, i) => (
                <div key={`duplicate-${i}`} className="flex-shrink-0 flex items-center justify-center h-28 w-56 overflow-hidden">
                  <img
                    src={airline.logo}
                    alt={airline.name}
                    className="h-20 w-auto object-cover object-center opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* I nostri modelli e modelle Section */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
            I nostri modelli e modelle
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-12">
            Modelle e modelli professionisti per sfilate, presentazioni aziendali, shooting, video commerciali, show-room e fiere.
          </p>
          
          {/* Two Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Uomini Card */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img 
                  src="https://i.postimg.cc/5yJNtfhT/image.png" 
                  alt="Uomini" 
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-light" style={{ fontFamily: 'Raleway, sans-serif' }}>Uomini</h3>
                </div>
              </div>
            </div>

            {/* Donne Card */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img 
                  src="https://i.postimg.cc/7LbCvY4N/image.png" 
                  alt="Donne" 
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-light" style={{ fontFamily: 'Raleway, sans-serif' }}>Donne</h3>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Servizi per le aziende Section */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              Servizi per le aziende
            </h2>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Academy Model Management offre soluzioni su misura per le esigenze di promozione e rappresentanza delle aziende: dalle modelle e modelli per eventi e sfilate, ai promoter e influencer per campagne pubblicitarie.
          </p>
        </div>
      </div>

      {/* Influencer Section */}
      <div className="py-16 sm:py-20 bg-[#f7f7f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text */}
            <div className="order-2 lg:order-1">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
                    Influencer
                  </h2>
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-md mb-6">
                  Selezioniamo e proponiamo influencer in linea con l'immagine e i valori delle aziende.
                </p>
                <button className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors">
                  <span>Scopri di più</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
          </div>

              {/* Right Column - Image */}
              <div className="order-1 lg:order-2">
                <div className="relative overflow-hidden rounded-lg max-w-md mx-auto">
                  <img 
                    src="https://i.postimg.cc/qBG3W769/Velgance-2.png" 
                    alt="Influencer" 
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hostess/Steward Section */}
      <div className="py-16 sm:py-20 bg-[#f7f7f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Image */}
              <div className="order-1">
                <div className="relative overflow-hidden rounded-lg max-w-md mx-auto">
                  <img 
                    src="https://i.postimg.cc/QCSK76rX/Velgance-3.png" 
                    alt="Hostess/Steward" 
                    className="w-full h-80 object-cover"
                  />
                </div>
          </div>

              {/* Right Column - Text */}
              <div className="order-2">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
                    Hostess/Steward
                  </h2>
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-md mb-6">
                  Offriamo servizio di hostess/steward per aziende che organizzano eventi, fiere e manifestazioni.
                </p>
                <button className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors">
                  <span>Scopri di più</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;