'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

type HomeProps = {
  params: Promise<{
    locale: string;
  }>;
};

const HeroImageCarousel = () => {
  const images = [
    'https://i.postimg.cc/N0xr7rpp/Velgance.png', // Original image
    'https://i.postimg.cc/2SmHgGhk/Full-Body-Picture-8.png',
    'https://i.postimg.cc/BvZp1Bjg/11.png',
    'https://i.postimg.cc/g2WNGWd1/12.png',
    'https://i.postimg.cc/6Q10Qt5Y/8.png',
    'https://i.postimg.cc/cJDm7tYN/9.png'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1500); // Change image every 1.5 seconds for faster rotation

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div 
      className="w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] lg:w-[700px] lg:h-[700px] bg-contain bg-center bg-no-repeat mx-auto transition-all duration-1000 ease-in-out"
      style={{
        backgroundImage: `url(${images[currentImageIndex]})`
      }}
    />
  );
};

const Home = ({ params }: HomeProps) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'white' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[80vh] sm:min-h-screen bg-white flex items-center justify-center">
        {/* Velgance Background Image */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
        >
          <HeroImageCarousel />
        </div>
        
        {/* Elegant Title - Top Left */}
        <div className="absolute top-4 sm:top-20 left-8 z-10 max-w-[280px] sm:max-w-sm lg:max-w-md">
          <h1 className="text-4xl sm:text-4xl lg:text-5xl font-extralight text-[#212121] tracking-wide leading-tight italic" style={{ fontFamily: 'serif' }}>
            Dal 1998 trasformiamo il talento in opportunità
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

      {/* I Nostri Lavori Più Recenti Section */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              I Nostri Lavori Più Recenti
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Scopri i nostri lavori attraverso le riviste di settore e i progetti realizzati con i nostri talenti.
            </p>
          </div>
          
          {/* Magazine Cards - Horizontal Scroll on All Devices */}
          <div 
            className="overflow-x-auto scrollbar-subtle" 
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255, 255, 255, 0.9) rgba(0, 0, 0, 0.2)',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="flex gap-6 pb-4">
              {/* Magazine Card 1 */}
              <div className="group cursor-pointer flex-shrink-0 w-64 sm:w-64">
                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <img 
                    src="https://i.postimg.cc/KjZ157PL/1.png" 
                    alt="Magazine 1" 
                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-medium text-sm">Magazine Feature</h3>
                  </div>
                </div>
              </div>

              {/* Magazine Card 2 */}
              <div className="group cursor-pointer flex-shrink-0 w-64 sm:w-64">
                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <img 
                    src="https://i.postimg.cc/L5HJVkty/2.png" 
                    alt="Magazine 2" 
                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-medium text-sm">Editorial Spread</h3>
                  </div>
                </div>
              </div>

              {/* Magazine Card 3 */}
              <div className="group cursor-pointer flex-shrink-0 w-64 sm:w-64">
                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <img 
                    src="https://i.postimg.cc/wM074t2Q/3.png" 
                    alt="Magazine 3" 
                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-medium text-sm">Fashion Story</h3>
                  </div>
                </div>
              </div>

              {/* Magazine Card 4 */}
              <div className="group cursor-pointer flex-shrink-0 w-64 sm:w-64">
                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <img 
                    src="https://i.postimg.cc/hvSX08LZ/4.png" 
                    alt="Magazine 4" 
                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-medium text-sm">Cover Story</h3>
                  </div>
                </div>
              </div>

              {/* Magazine Card 5 */}
              <div className="group cursor-pointer flex-shrink-0 w-64 sm:w-64">
                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <img 
                    src="https://i.postimg.cc/8c17bdRn/5.png" 
                    alt="Magazine 5" 
                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-medium text-sm">Portfolio Feature</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* View More Text */}
          <div className="text-center mt-12">
            <Link href="/portfolio" className="text-gray-600 hover:text-black transition-colors text-lg">
              e molto altro...
            </Link>
          </div>
        </div>
      </div>

      {/* Elegant Stats Section */}
      <div className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-0 border border-gray-200">
            
            {/* Card 1 - Modelli in Evidenza (Mobile First) */}
            <div className="bg-white border-r border-b border-gray-200 p-6 sm:p-10 hover:bg-gray-50 transition-colors duration-300 relative overflow-hidden" style={{ backgroundImage: 'url(https://i.postimg.cc/jdQY0jgT/Full-Body-Picture-14.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative z-10">
                <h3 className="text-xs font-bold text-white mb-4 tracking-widest uppercase">Modelli in Evidenza</h3>
                <div className="mb-4">
                  <span className="font-light text-white block leading-none" style={{ fontFamily: 'Inter, sans-serif', fontSize: '6rem', lineHeight: '1' }}>15</span>
                </div>
                <p className="text-sm text-white leading-relaxed font-medium">
                  talenti <strong className="text-white">Featured</strong> su copertine globali nel <strong className="text-white">2024</strong>.
                </p>
              </div>
              <div className="absolute -bottom-4 -right-4 text-6xl font-black text-gray-100 opacity-30 select-none">★</div>
            </div>

            {/* Card 2 - Quota Mercato Italia (Mobile Second) */}
            <div className="bg-white border-r border-b border-gray-200 p-6 sm:p-10 hover:bg-gray-50 transition-colors duration-300 flex flex-col relative overflow-hidden">
              <div className="flex-1 relative z-10">
                <h3 className="text-xs font-bold text-gray-900 mb-6 tracking-widest uppercase transform -rotate-90 origin-left absolute left-0 top-0">Quota Mercato</h3>
                <div className="mt-8">
                  <span className="font-light text-black block leading-none" style={{ fontFamily: 'Inter, sans-serif', fontSize: '6rem', lineHeight: '1' }}>41</span>
                  <span className="text-3xl font-bold text-gray-700">%</span>
                </div>
              </div>
              <div className="mt-auto relative z-10">
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  <strong className="text-black">Italia #1</strong> in Europa. La quota di fatturato moda generata dall'Italia.
                </p>
              </div>
              <div className="absolute -bottom-6 -right-6 text-8xl font-black text-gray-200 opacity-30 select-none">IT</div>
            </div>

            {/* Card 3 - La Nostra Portata EU (Mobile Third) */}
            <div className="bg-white border-r border-b border-gray-200 p-6 sm:p-10 hover:bg-gray-50 transition-colors duration-300 relative overflow-hidden" style={{ backgroundImage: 'url(https://i.postimg.cc/J7HRgMCX/Full-Body-Picture-15.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative z-10">
                <h3 className="text-xs font-bold text-white mb-4 tracking-widest uppercase">La Nostra Portata</h3>
                <div className="mb-4">
                  <span className="font-light text-white block leading-none" style={{ fontFamily: 'Inter, sans-serif', fontSize: '6rem', lineHeight: '1' }}>75</span>
                  <span className="text-2xl font-bold text-white">%</span>
                </div>
                <p className="text-sm text-white leading-relaxed font-medium">
                  dei nostri modelli ha lavorato su <strong className="text-white">progetti internazionali</strong> in Europa nell'ultimo anno.
                </p>
              </div>
              <div className="absolute -bottom-4 -right-4 text-9xl font-black text-gray-100 opacity-30 select-none">EU</div>
            </div>

            {/* Card 4 - Settore Moda Italia */}
            <div className="bg-white border-r border-b border-gray-200 p-6 sm:p-10 hover:bg-gray-50 transition-colors duration-300 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xs font-bold text-gray-900 mb-4 tracking-widest uppercase">Settore Moda Italia</h3>
                <div className="mb-4 flex items-baseline">
                  <span className="text-2xl font-bold text-gray-700">€</span>
                  <span className="font-light text-black block leading-none" style={{ fontFamily: 'Inter, sans-serif', fontSize: '6rem', lineHeight: '1' }}>102</span>
                  <span className="text-3xl font-bold text-gray-700 ml-1">B</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  Fatturato <strong className="text-black">previsto</strong> del settore moda italiano per il <strong className="text-black">2024</strong>.
                </p>
              </div>
              <div className="absolute -bottom-4 -right-4 text-7xl font-black text-gray-200 opacity-40 select-none">€</div>
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
            <Link href="/male-models" className="group cursor-pointer">
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
            </Link>

            {/* Donne Card */}
            <Link href="/female-models" className="group cursor-pointer">
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
            </Link>
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
            Velgance Agency offre soluzioni su misura per le esigenze di promozione e rappresentanza delle aziende: dalle modelle e modelli per eventi e sfilate, ai promoter e influencer per campagne pubblicitarie.
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
                <Link href="/contact" className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors">
                  <span>Scopri di più</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
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
                <Link href="/contact" className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors">
                  <span>Scopri di più</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;