import { showBetaFeature } from '@repo/feature-flags';
import { getDictionary } from '@repo/internationalization';
import type { Metadata } from 'next';

import { Community } from './components/community';
import { CTA } from './components/cta';

import { FAQ } from './components/faq';
import { ModelProviders } from './components/model-providers';
import { blog } from '@repo/cms';
import { Feed } from '@repo/cms/components/feed';
import { Image } from '@repo/cms/components/image';
import Link from 'next/link';

import { Hero } from './components/hero';


import { Stats } from './components/stats';
import { Testimonials } from './components/testimonials';
import { TrustedBy } from './components/trusted-by';
import { CustomVideoPlayer } from './components/custom-video-player';
import { AuroraBackgroundAlt } from './components/AuroraBackgroundAlt';
import { AuroraBackgroundGreen } from './components/AuroraBackgroundGreen';
import { ScrollingLogos } from './components/scrolling-logos';
import TextType from './components/TextType';



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
            backgroundColor: 'transparent'
          }}
        >




          <div className="relative z-10">
            <Hero dictionary={dictionary} />
          </div>
        </div>
      </div>

      {/* Video section with Aurora background */}
      <div className="w-full relative" style={{ backgroundColor: '#161616' }}>
        {/* Decorative light effects - positioned outside container limits */}
        <div className="absolute inset-0 pointer-events-none overflow-visible z-0">
          <div className="max-w-7xl mx-auto px-6 relative h-[400px] lg:h-[700px]">
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 pointer-events-none">
              {/* Large primary light */}
              <div
                className="absolute -top-56 left-1/2 transform -translate-x-1/2 w-[95vw] max-w-[1000px] h-[500px] opacity-10"
                style={{
                  background: 'radial-gradient(ellipse at center bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 30%, transparent 70%)',
                  filter: 'blur(1px)'
                }}
              ></div>

              {/* Medium secondary light */}
              <div
                className="absolute -top-40 left-1/2 transform -translate-x-1/2 w-[85vw] max-w-[800px] h-[400px] opacity-8"
                style={{
                  background: 'radial-gradient(ellipse at center bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 40%, transparent 80%)',
                  filter: 'blur(0.5px)'
                }}
              ></div>

              {/* Subtle glow overlay */}
              <div
                className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-[75vw] max-w-[500px] h-40 opacity-5"
                style={{
                  background: 'radial-gradient(ellipse at center bottom, rgba(255,255,255,0.3) 0%, transparent 100%)',
                  filter: 'blur(2px)'
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 pt-0 pb-4 lg:py-0">
          <div className="flex items-center justify-center h-[400px] lg:h-[700px]">
            <div className="relative max-w-5xl w-full">
              <div className="relative p-2">
                {/* Detached glassy border */}
                <div className="absolute inset-0 rounded-2xl border-4 border-white/15 backdrop-blur-sm pointer-events-none"></div>

                <div className="rounded-2xl overflow-hidden bg-transparent">
                  <CustomVideoPlayer src="/images/Cubentnewv.mp4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden features section */}
      {/* <div className="w-full px-0 md:px-4 lg:px-6" style={{ backgroundColor: '#161616' }}>
        <div
          className="w-full md:max-w-7xl md:mx-auto px-0 md:px-6 lg:px-12 relative overflow-hidden"
          style={{
            backgroundColor: '#161616'
          }}
        >

            <div className="relative z-10 p-3 md:p-4 pt-16 md:pt-12">
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

              <div className="flex justify-center gap-3 md:gap-6 mb-10 flex-wrap md:flex-wrap text-xs">
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
        </div>
      </div> */}

      {/* Company logos section with title */}
      <div className="w-full py-8 lg:py-16" style={{ backgroundColor: '#161616' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <h2 className="text-center text-white/50 text-lg font-medium mb-12">
            Trusted by engineering teams at leading companies
          </h2>

          {/* Infinite scrolling logos */}
          <ScrollingLogos />
        </div>
      </div>

      {/* New section with duplicated video and content */}
      <div className="w-full py-16" style={{ backgroundColor: '#161616' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Left-aligned title and description */}
          <div className="mb-12">
            <h2 className="text-left text-4xl md:text-5xl mb-6 tracking-tight" style={{ color: '#e3e3e0', fontFamily: 'var(--font-geist-sans)' }}>
              AI Builds It. You Rule Everything
            </h2>
            <p className="text-left text-lg text-white/70 mb-8 max-w-2xl">
              Cubent handles the coding heavy lifting while you stay in charge — guiding, reviewing, and shipping on your terms.
            </p>
            {/* Less visible transparent line */}
            <div className="w-full h-px bg-white/20 mb-12"></div>
          </div>

          {/* Duplicated video section with AuroraBackground */}
          <div className="max-w-7xl mx-auto px-2 lg:px-6 relative z-10">
            <div className="relative p-3 lg:p-6 h-[300px] lg:h-[700px]">
              {/* Detached glassy border */}
              <div className="absolute inset-2 lg:inset-4 rounded-2xl border-2 border-white/15 backdrop-blur-sm pointer-events-none"></div>

              <AuroraBackgroundAlt className="h-full rounded-2xl overflow-hidden">
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="max-w-5xl w-full px-6">
                    <CustomVideoPlayer src="/images/EVEN-MORE-NEW-FEATURE.mp4" />
                  </div>
                </div>
              </AuroraBackgroundAlt>
            </div>
          </div>
        </div>
      </div>

      {/* New section - Autocomplete That Thinks With You */}
      <div className="w-full py-16" style={{ backgroundColor: '#161616' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Left-aligned title and description */}
          <div className="mb-12">
            <h2 className="text-left text-4xl md:text-5xl mb-6 tracking-tight" style={{ color: '#e3e3e0', fontFamily: 'var(--font-geist-sans)' }}>
              Autocomplete That Thinks With You
            </h2>
            <p className="text-left text-lg text-white/70 mb-8 max-w-2xl">
              Cubent's Autocomplete predicts your next move — drafting clean code while you keep full control to accept, tweak, or skip instantly.
            </p>
            {/* Less visible transparent line */}
            <div className="w-full h-px bg-white/20 mb-12"></div>
          </div>

          {/* Video section with AuroraBackground */}
          <div className="max-w-7xl mx-auto px-2 lg:px-6 relative z-10">
            <div className="relative p-3 lg:p-6 h-[300px] lg:h-[700px]">
              {/* Detached glassy border */}
              <div className="absolute inset-2 lg:inset-4 rounded-2xl border-2 border-white/15 backdrop-blur-sm pointer-events-none"></div>

              <AuroraBackgroundGreen className="h-full rounded-2xl overflow-hidden">
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="max-w-5xl w-full px-6">
                    <CustomVideoPlayer src="/images/NEW-AUTOCOMPLETE-VIDEO.mp4" />
                  </div>
                </div>
              </AuroraBackgroundGreen>
            </div>
          </div>
        </div>
      </div>

      <ModelProviders />

      {/* Three vertical feature cards */}
      <div className="w-full py-16" style={{ backgroundColor: '#161616' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 - Full control */}
            <div className="bg-neutral-700/20 backdrop-blur-sm rounded-lg p-8 border border-neutral-600/20 shadow-lg h-[350px] lg:h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden">
              {/* Trim mark borders */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-white/30"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-white/30"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-white/30"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-white/30"></div>
              {/* Icon */}
              <div className="mb-8">
                <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center mx-auto">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-3xl lg:text-4xl font-regular tracking-tight text-white leading-tight mb-6">
                Full control of your coding
              </h3>

              {/* Description */}
              <p className="text-white/70 text-base leading-relaxed max-w-sm">
                Choose how much Cubent assists you—from small completions to full code generation. Adjustable for individuals and teams.
              </p>
            </div>

            {/* Card 2 - Your projects */}
            <div className="bg-neutral-700/20 backdrop-blur-sm rounded-lg p-8 border border-neutral-600/20 shadow-lg h-[350px] lg:h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden">
              {/* Trim mark borders */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-white/30"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-white/30"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-white/30"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-white/30"></div>
              {/* Icon */}
              <div className="mb-8">
                <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center mx-auto">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-3xl lg:text-4xl font-regular tracking-tight text-white leading-tight mb-6">
                Your projects stay yours
              </h3>

              {/* Description */}
              <p className="text-white/70 text-base leading-relaxed max-w-sm">
                Cubent never trains on your code. Local-first design with secure context handling and flexible AI model options.
              </p>
            </div>

            {/* Card 3 - Transparent */}
            <div className="bg-neutral-700/20 backdrop-blur-sm rounded-lg p-8 border border-neutral-600/20 shadow-lg h-[350px] lg:h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden">
              {/* Trim mark borders */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-white/30"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-white/30"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-white/30"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-white/30"></div>
              {/* Icon */}
              <div className="mb-8">
                <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center mx-auto">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-3xl lg:text-4xl font-regular tracking-tight text-white leading-tight mb-6">
                Transparent by design
              </h3>

              {/* Description */}
              <p className="text-white/70 text-base leading-relaxed max-w-sm">
                Every suggestion is reviewable, every action traceable. No hidden processes—just clear, auditable AI assistance.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Community dictionary={dictionary} />

      {/* Blog section */}
      <div className="w-full py-16" style={{ backgroundColor: '#161616' }}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-white font-regular text-3xl tracking-tighter md:text-5xl mb-4">
              The latest from Cubent
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Check out recent announcements, and other in-depth posts about Cubent behind the curtains.
            </p>
          </div>

          {/* Blog posts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Feed queries={[blog.postsQuery]}>
              {async ([data]: [any]) => {
                'use server';

                if (!data.blog.posts.items.length) {
                  return (
                    <div className="col-span-3 text-center text-neutral-400">
                      No blog posts available yet.
                    </div>
                  );
                }

                // Get the latest 3 posts
                const latestPosts = data.blog.posts.items.slice(0, 3);

                return latestPosts.map((post: any) => (
                  <Link
                    href={`/blog/${post._slug}`}
                    key={post._slug}
                    className="group bg-neutral-700/20 backdrop-blur-sm rounded-lg p-6 border border-neutral-600/20 shadow-lg hover:bg-neutral-700/30 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="aspect-video overflow-hidden rounded-lg mb-4">
                      <Image
                        src={post.image.url}
                        alt={post.image.alt ?? post._title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      {/* Date */}
                      <p className="text-neutral-400 text-sm">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>

                      {/* Title */}
                      <h3 className="text-white text-xl font-semibold group-hover:text-white/90 transition-colors">
                        {post._title}
                      </h3>

                      {/* Description */}
                      <p className="text-neutral-300 text-sm leading-relaxed line-clamp-3">
                        {post.description}
                      </p>
                    </div>
                  </Link>
                ));
              }}
            </Feed>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
