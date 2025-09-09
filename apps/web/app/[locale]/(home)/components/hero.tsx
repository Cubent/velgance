import { env } from '@/env';
import { Button } from '@repo/design-system/components/ui/button';
import type { Dictionary } from '@repo/internationalization';
import { ExternalLink, MoveRight, PhoneCall, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import LightRays from './LightRays';
import TextType from './TextType';

type HeroProps = {
  dictionary: Dictionary;
};

// Hero component for the homepage - updated with new comment
// This is the main hero section that displays the primary call-to-action and introduction
export const Hero = async ({ dictionary }: HeroProps) => (
  <div className="w-full relative overflow-hidden">
    {/* Light Rays Effect - extends behind header */}
    {/* <div className="fixed inset-0 z-0" style={{ top: '-100px', height: 'calc(100vh + 200px)' }}>
      <LightRays
        raysOrigin="top-center"
        raysColor="#ffffff"
        raysSpeed={0.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        className="custom-rays"
      />
    </div> */}








    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center gap-8 pt-10 pb-4 lg:pt-12 lg:pb-12">
        {/* <div>
          <Feed queries={[blog.latestPostQuery]}>
            {/* biome-ignore lint/suspicious/useAwait: "Server Actions must be async" */}
            {/* {async ([data]: [any]) => {
              'use server';

              return (
                <Button variant="secondary" size="sm" className="gap-4 bg-gradient-to-r from-white/10 to-white/10 border-white/20 hover:from-white/20 hover:to-white/20 hover:border-white/30 text-white hover:text-white/90" asChild>
                  <Link href={`/blog/${data.blog.posts.item?._slug}`}>
                    {dictionary.web.home.hero.announcement}{' '}
                    <MoveRight className="h-4 w-4 text-white" />
                  </Link>
                </Button>
              );
            }}
          </Feed>
        </div> */}
        <div className="flex flex-col items-center gap-8 relative text-center">
          <div className="flex flex-col gap-6 relative">
            {/* Announcement above title */}
            <div className="mb-4 flex justify-center">
              <a
                href="https://cubent.dev/blog/gpt-5-is-now-here-in-cubent"
                className="inline-flex items-center justify-center gap-3 font-medium text-sm px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span className="text-white/90">GPT-5 is now here in Cubent</span>
                <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <h1 className="w-full text-center font-regular text-[52px] tracking-tighter md:text-8xl relative z-10 leading-tight">
              <span style={{ color: '#e3e3e0' }}>
                Code smarter.<br />
                {/* @ts-ignore */}
                <TextType
                  text={["Ship faster.", "Debug less.", "Scale strong.", "Deploy quicker."]}
                  typingSpeed={75}
                  pauseDuration={3000}
                  showCursor={true}
                  cursorCharacter="|"
                  className="inline-block"
                  initialDelay={3000}
                />
              </span>
            </h1>
            <p className="w-full max-w-2xl text-center text-base text-muted-foreground leading-relaxed tracking-tight md:text-lg relative z-10 mx-auto">
              Meet Cubent, your AI coding partner inside the editor. Generate code, solve bugs, document faster, and build smarter with simple language.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button
            variant="outline"
            className="px-10 py-6 text-sm font-medium transition-all duration-200 group hover:!bg-[#2a2a2a] hover:!border-[#2a2a2a] rounded-full flex items-center"
            style={{ backgroundColor: '#faf9f6', borderColor: '#faf9f6', color: '#2a2a2a' }}
            asChild
          >
            <Link
              href="https://marketplace.visualstudio.com/items?itemName=Cubent.cubent"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-200"
            >
              <div className="flex items-center gap-2 sm:gap-2">
                <svg className="w-5 h-5 sm:w-5 sm:h-5 transition-all duration-200 group-hover:!text-[#faf9f6]" style={{ color: '#2a2a2a' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
                </svg>
                <span className="transition-all duration-200 group-hover:!text-[#faf9f6]" style={{ color: '#2a2a2a' }}>Install in VS Code</span>
              </div>
            </Link>
          </Button>

          <Button
            variant="outline"
            asChild
            className="text-white hover:text-white hover:bg-white/10 py-3 flex items-center border border-white/20 rounded-full px-6"
          >
            <Link href="https://docs.cubent.dev">
              Read the docs
            </Link>
          </Button>
          </div>
        </div>
      </div>
    </div>
















  </div>
);
