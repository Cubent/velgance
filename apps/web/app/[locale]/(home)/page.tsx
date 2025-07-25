import { showBetaFeature } from '@repo/feature-flags';
import { getDictionary } from '@repo/internationalization';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Community } from './components/community';
import { CTA } from './components/cta';
import { Download } from './components/download';
import { FAQ } from './components/faq';

import { Hero } from './components/hero';
import { Mockup } from './components/mockup';
import { ModelProviders } from './components/model-providers';
import { Stats } from './components/stats';
import { Testimonials } from './components/testimonials';
import { TrustedBy } from './components/trusted-by';



type HomeProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: HomeProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  // Use custom metadata for homepage to avoid "| Cubent" suffix
  const homeMetadata = dictionary.web.home.meta;

  return {
    title: homeMetadata.title, // Just the title without "| Cubent"
    description: homeMetadata.description,
    applicationName: 'Cubent',
    metadataBase: process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
      : undefined,
    authors: [{ name: 'Cubent', url: 'https://cubent.dev/' }],
    creator: 'Cubent',
    formatDetection: {
      telephone: false,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: homeMetadata.title,
    },
    openGraph: {
      title: homeMetadata.title,
      description: homeMetadata.description,
      type: 'website',
      siteName: 'Cubent',
      locale: 'en_US',
    },
    publisher: 'Cubent',
    twitter: {
      card: 'summary_large_image',
      creator: '@cubent',
    },
  };
};

const Home = async ({ params }: HomeProps) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const betaFeature = await showBetaFeature();

  return (
    <>
      {betaFeature && (
        <div className="w-full bg-black py-2 text-center text-white">
          Beta feature now available
        </div>
      )}
      {/* Transparent box wrapper for Hero and TrustedBy sections */}
      <div className="w-full relative px-4 sm:px-6" style={{ backgroundColor: '#161616' }}>
        <div
          className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 -mt-20 pt-20 relative"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderTop: 'none',
            backgroundColor: 'transparent'
          }}
        >
          {/* Subtle centered white gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 800px 600px at center, rgba(255, 255, 255, 0.02) 0%, transparent 50%)'
            }}
          ></div>

          {/* Colorful horizontal bars background */}
          <div className="absolute inset-0 flex flex-col justify-center overflow-hidden pointer-events-none">
            <div className="flex flex-col gap-1 h-full w-full justify-center">
              {/* Generate horizontal bars on left and right sides */}
              {[
                { width: '8%', height: '4px', bg: 'linear-gradient(to right, #ff0844, #ff1744)', segments: 3, position: 'left', top: '20%' },
                { width: '10%', height: '6px', bg: 'linear-gradient(to right, #e91e63, #ad1457)', segments: 2, position: 'left', top: '25%' },
                { width: '6%', height: '3px', bg: 'linear-gradient(to right, #9c27b0, #7b1fa2)', segments: 4, position: 'left', top: '30%' },
                { width: '12%', height: '5px', bg: 'linear-gradient(to right, #673ab7, #512da8)', segments: 2, position: 'left', top: '35%' },
                { width: '9%', height: '4px', bg: 'linear-gradient(to right, #3f51b5, #303f9f)', segments: 3, position: 'left', top: '40%' },
                { width: '7%', height: '7px', bg: 'linear-gradient(to right, #2196f3, #1976d2)', segments: 2, position: 'left', top: '45%' },
                { width: '11%', height: '3px', bg: 'linear-gradient(to right, #00bcd4, #0097a7)', segments: 5, position: 'left', top: '50%' },
                { width: '9%', height: '5px', bg: 'linear-gradient(to right, #009688, #00695c)', segments: 3, position: 'left', top: '55%' },
                { width: '8%', height: '6px', bg: 'linear-gradient(to right, #4caf50, #388e3c)', segments: 2, position: 'left', top: '60%' },
                { width: '10%', height: '4px', bg: 'linear-gradient(to right, #8bc34a, #689f38)', segments: 4, position: 'left', top: '65%' },
                { width: '9%', height: '5px', bg: 'linear-gradient(to right, #ffeb3b, #fbc02d)', segments: 2, position: 'left', top: '70%' },
                { width: '7%', height: '3px', bg: 'linear-gradient(to right, #ffc107, #ff8f00)', segments: 3, position: 'left', top: '75%' },

                { width: '9%', height: '5px', bg: 'linear-gradient(to left, #ff9800, #f57c00)', segments: 3, position: 'right', top: '20%' },
                { width: '11%', height: '4px', bg: 'linear-gradient(to left, #ff5722, #d84315)', segments: 2, position: 'right', top: '25%' },
                { width: '7%', height: '6px', bg: 'linear-gradient(to left, #f44336, #c62828)', segments: 4, position: 'right', top: '30%' },
                { width: '8%', height: '3px', bg: 'linear-gradient(to left, #00e676, #00c853)', segments: 5, position: 'right', top: '35%' },
                { width: '10%', height: '7px', bg: 'linear-gradient(to left, #ff6d00, #ff3d00)', segments: 2, position: 'right', top: '40%' },
                { width: '12%', height: '4px', bg: 'linear-gradient(to left, #d500f9, #aa00ff)', segments: 3, position: 'right', top: '45%' },
                { width: '6%', height: '5px', bg: 'linear-gradient(to left, #ff0844, #ff1744)', segments: 2, position: 'right', top: '50%' },
                { width: '9%', height: '3px', bg: 'linear-gradient(to left, #e91e63, #ad1457)', segments: 4, position: 'right', top: '55%' },
                { width: '11%', height: '6px', bg: 'linear-gradient(to left, #9c27b0, #7b1fa2)', segments: 2, position: 'right', top: '60%' },
                { width: '8%', height: '4px', bg: 'linear-gradient(to left, #673ab7, #512da8)', segments: 3, position: 'right', top: '65%' },
                { width: '10%', height: '5px', bg: 'linear-gradient(to left, #3f51b5, #303f9f)', segments: 2, position: 'right', top: '70%' },
                { width: '7%', height: '3px', bg: 'linear-gradient(to left, #2196f3, #1976d2)', segments: 4, position: 'right', top: '75%' },
              ].map((bar, i) => {
                const isLeftSide = bar.position === 'left';

                let horizontalPosition;
                if (isLeftSide) {
                  horizontalPosition = '0%';
                } else {
                  horizontalPosition = `${100 - parseInt(bar.width)}%`;
                }

                return (
                  <div
                    key={i}
                    className="absolute opacity-40 flex gap-1"
                    style={{
                      left: horizontalPosition,
                      top: bar.top,
                      width: bar.width,
                      height: bar.height,
                    }}
                  >
                    {/* Create horizontal segments with gaps */}
                    {Array.from({ length: bar.segments }).map((_, segmentIndex) => (
                      <div
                        key={segmentIndex}
                        className="relative"
                        style={{
                          width: `${100 / bar.segments - 1}%`,
                          height: '100%',
                          background: bar.bg,
                        }}
                      >
                        {/* Heavy noise texture overlay */}
                        <div
                          className="absolute inset-0 opacity-90"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilterHero${i}${segmentIndex}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.2' numOctaves='8' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilterHero${i}${segmentIndex})'/%3E%3C/svg%3E")`,
                            mixBlendMode: 'multiply'
                          }}
                        />
                        {/* Additional grain layer */}
                        <div
                          className="absolute inset-0 opacity-70"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grainFilterHero${i}${segmentIndex}'%3E%3CfeTurbulence type='turbulence' baseFrequency='3.0' numOctaves='10' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grainFilterHero${i}${segmentIndex})'/%3E%3C/svg%3E")`,
                            mixBlendMode: 'overlay'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subtle gradient overlay on top of bars */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20 pointer-events-none" />

          <div className="relative z-10">
            <Hero dictionary={dictionary} />
          </div>
        </div>
      </div>

      {/* New section attached to hero */}
      <div className="w-full px-0 md:px-4 lg:px-6" style={{ backgroundColor: '#161616' }}>
        <div
          className="w-full md:max-w-7xl md:mx-auto px-0 md:px-6 lg:px-12 relative overflow-hidden"
          style={{
            backgroundColor: '#161616',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderTop: 'none'
          }}
        >
            {/* Light blue, green & orange gradient background with grain filter */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Gradient background that fades from bottom */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(0, 188, 212, 0.7) 0%, rgba(255, 152, 0, 0.6) 35%, rgba(76, 175, 80, 0.65) 60%, rgba(32, 32, 32, 1) 80%)',
                }}
              />
              {/* Grain filter overlay */}
              <div
                className="absolute inset-0 opacity-65"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilterCodeSection'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.2' numOctaves='8' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilterCodeSection)'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'overlay'
                }}
              />
            </div>

            {/* Subtle gradient overlay on top of bars */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom right, rgba(22, 22, 22, 0.4) 0%, transparent 50%, rgba(22, 22, 22, 0.3) 100%)'
              }}
            />

            <div className="relative z-10 p-4 md:p-12 pt-16 md:pt-12">
              <div className="text-center mb-16 md:mb-10">
                <h2 className="text-3xl md:text-4xl text-white leading-tight">
                  Code faster and smarter
                </h2>
                <p className="text-xl md:text-2xl text-white/60 -mt-1">
                  without leaving your editor
                </p>
              </div>

              {/* Feature tabs */}
              <div className="flex justify-center gap-3 mb-6 flex-wrap md:flex-wrap">
                <div className="px-3 py-1.5 rounded-full border border-white/20 text-white/60 text-xs whitespace-nowrap">
                  AI Assistant
                </div>
                <div className="px-3 py-1.5 rounded-full border border-white/20 text-white/60 text-xs whitespace-nowrap">
                  Code Generation
                </div>
                <div className="px-3 py-1.5 rounded-full border border-white/20 text-white/60 text-xs whitespace-nowrap">
                  Smart Completion
                </div>
              </div>

              {/* Feature checkmarks */}
              <div className="flex justify-center gap-6 mb-10 flex-wrap md:flex-wrap text-xs">
                <div className="flex items-center gap-1.5 text-white/60 whitespace-nowrap">
                  <svg className="w-3 h-3 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Real-time Assistance
                </div>
                <div className="flex items-center gap-1.5 text-white/60 whitespace-nowrap">
                  <svg className="w-3 h-3 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Context Aware
                </div>
                <div className="flex items-center gap-1.5 text-white/60 whitespace-nowrap">
                  <svg className="w-3 h-3 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Multi-Language
                </div>
                <div className="flex items-center gap-1.5 text-white/60 whitespace-nowrap">
                  <svg className="w-3 h-3 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Instant Debugging
                </div>
                <div className="flex items-center gap-1.5 text-white/60 whitespace-nowrap">
                  <svg className="w-3 h-3 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Easy as typing
                </div>
              </div>

              {/* GIF with border */}
              <div className="flex justify-center items-center w-full px-0 md:px-2">
                <div className="relative border border-white/20 overflow-hidden bg-black/40 backdrop-blur-sm w-full md:max-w-6xl">
                  {/* Window header with dots */}
                  <div className="flex items-center justify-between px-4 py-3 bg-black/20 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-white/40"></div>
                      <div className="w-3 h-3 rounded-full bg-white/40"></div>
                      <div className="w-3 h-3 rounded-full bg-white/40"></div>
                    </div>
                  </div>
                  <Image
                    src="/images/Cubent.Dev (6).webp"
                    alt="Cubent Dev Demo"
                    width={1400}
                    height={787}
                    className="w-full h-auto"
                    style={{
                      maxWidth: '100%'
                    }}
                  />
                </div>
              </div>
            </div>
        </div>
      </div>

      <Mockup />

      <ModelProviders />
      <Community dictionary={dictionary} />
      <Download />
    </>
  );
};

export default Home;
