import Link from 'next/link';

export default function ModelsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - Hidden on mobile */}
      <div className="hidden md:block py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-5xl lg:text-6xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              I nostri modelli
            </h1>
            <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto">
              Scopri i talenti della nostra agenzia
            </p>
          </div>
        </div>
      </div>

      {/* Model Categories */}
      <div className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 max-w-6xl mx-auto">
            {/* Female Models Card */}
            <Link
              href="/female-models"
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg aspect-[4/3] md:aspect-[4/3] mb-4" style={{ minHeight: '400px' }}>
                <div 
                  className="w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{ 
                    backgroundImage: 'url(https://i.postimg.cc/kXskQ6Z7/Full-Body-Picture-3.png)'
                  }}
                ></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-4xl sm:text-5xl font-light text-white mb-4 italic" style={{ fontFamily: 'serif' }}>
                      Talento Femminile
                    </h2>
                    <p className="text-lg text-white mb-6">
                      Scopri i talenti femminili
                    </p>
                    <button className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg">
                      Esplora
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </Link>

            {/* Male Models Card */}
            <Link
              href="/male-models"
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg aspect-[4/3] md:aspect-[4/3] mb-4" style={{ minHeight: '400px' }}>
                <div 
                  className="w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{ 
                    backgroundImage: 'url(https://i.postimg.cc/fLq97LMk/Full-Body-Picture-2.png)'
                  }}
                ></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-4xl sm:text-5xl font-light text-white mb-4 italic" style={{ fontFamily: 'serif' }}>
                      Talento Maschile
                    </h2>
                    <p className="text-lg text-white mb-6">
                      Scopri i talenti maschili
                    </p>
                    <button className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg">
                      Esplora
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}