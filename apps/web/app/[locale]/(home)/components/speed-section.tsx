'use client';

export const SpeedSection = () => {
  return (
    <>{/* Speed with context awareness section - Hidden on mobile */}
    <div className="hidden md:block w-full relative px-4 sm:px-6" style={{ backgroundColor: '#161616' }}>
      <div
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-20 relative"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderTop: 'none',
          backgroundColor: 'transparent'
        }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16 lg:mb-20">
          {/* Left side - Title and description */}
          <div className="flex-1">
            <h2 className="text-4xl lg:text-5xl font-regular tracking-tight text-white leading-tight mb-4">
              Speed with context awareness
            </h2>
            <p className="text-white/70 text-lg leading-relaxed max-w-lg">
              With a Time-to-First-Audio of 40ms, Sonic is the fastest generative voice model built for streaming.
            </p>
          </div>

          {/* Right side - Percentage - Hidden on mobile */}
          <div className="hidden md:flex flex-shrink-0 text-right">
            <div>
              <div
                className="text-4xl md:text-6xl lg:text-7xl font-normal leading-none"
                style={{
                  background: 'linear-gradient(135deg, #ff8c00, #ff4500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                *145%
              </div>
              <p className="text-white/60 text-sm mt-2">
                faster than the next best competitor
              </p>
            </div>
          </div>
        </div>

        {/* Image below the content - Much bigger on mobile */}
        <div className="w-full flex justify-center mb-6 md:mb-8 lg:mb-10 -mx-4 md:mx-0">
          <img
            src="/images/Cubent.Dev (30).png"
            alt="Cubent speed demonstration"
            className="w-[130%] md:w-full max-w-none md:max-w-6xl h-auto object-contain"
          />
        </div>

        {/* Mobile percentage - Below image, smaller text */}
        <div className="md:hidden text-center mb-8">
          <div
            className="text-2xl font-normal leading-none mb-2"
            style={{
              background: 'linear-gradient(135deg, #ff8c00, #ff4500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            *145%
          </div>
          <p className="text-white/60 text-xs">
            faster than the next best competitor
          </p>
        </div>

        {/* Vertical lines section - inside the same container */}
        <div className="relative z-10 -mx-6 sm:-mx-8 lg:-mx-12">
          <div className="h-16 lg:h-20 w-full relative overflow-hidden" style={{ backgroundColor: '#161616' }}>
            {/* Top horizontal line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            />
            {/* Thin vertical lines pattern - extending to edges */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '8px 100%'
              }}
            />
            {/* Bottom horizontal line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
