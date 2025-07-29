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
import { SpeedSection } from './components/speed-section';
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
            </div>

            {/* Full-width GIF container */}
            <div className="relative w-full -mt-8">
              <div className="relative border border-white/20 overflow-hidden bg-black/40 backdrop-blur-sm w-full">
                {/* Window header with dots */}
                <div className="flex items-center justify-between px-4 py-3 bg-black/10 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-white/40"></div>
                    <div className="w-3 h-3 rounded-full bg-white/40"></div>
                    <div className="w-3 h-3 rounded-full bg-white/40"></div>
                  </div>
                </div>
                <Image
                  src="/images/Introducing-Cubent-The-Smartest-AI-Coder-4.gif"
                  alt="Cubent Dev Demo - The Smartest AI Coder"
                  width={1400}
                  height={787}
                  className="w-full h-auto"
                  style={{
                    maxWidth: '100%'
                  }}
                  unoptimized={true}
                />
              </div>
            </div>
        </div>
      </div>

      <Mockup />

      <ModelProviders />
      <SpeedSection />
      <Community dictionary={dictionary} />
      <Download />
    </>
  );
};

export default Home;
