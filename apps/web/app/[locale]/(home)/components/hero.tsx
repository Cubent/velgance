import { env } from '@/env';
import { blog } from '@repo/cms';
import { Feed } from '@repo/cms/components/feed';
import { Button } from '@repo/design-system/components/ui/button';
import type { Dictionary } from '@repo/internationalization';
import { ExternalLink, MoveRight, PhoneCall, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatedTitle } from './animated-title';
import { TrustedBy } from './trusted-by';

type HeroProps = {
  dictionary: Dictionary;
};

// Hero component for the homepage - updated
export const Hero = async ({ dictionary }: HeroProps) => (
  <div className="w-full relative overflow-hidden">








    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center gap-8 pt-6 pb-8 lg:pt-12 lg:pb-12">
        <div>
          <Feed queries={[blog.latestPostQuery]}>
            {/* biome-ignore lint/suspicious/useAwait: "Server Actions must be async" */}
            {async ([data]: [any]) => {
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
        </div>
        <div className="flex flex-col gap-6 relative">
          <div className="flex flex-col gap-6 relative">
            <AnimatedTitle />
            <p className="max-w-3xl mx-auto text-center text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl relative z-10">
              Meet Cubent.Dev, your AI coding partner inside the editor. Generate code, solve bugs, document faster, and build smarter with simple language.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button
            variant="outline"
            className="bg-white border-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-medium sm:px-8 sm:py-4 sm:text-lg"
            asChild
          >
            <Link href="https://marketplace.visualstudio.com/items?itemName=Cubent.cubent" target="_blank" rel="noopener noreferrer">
              <div className="flex items-center gap-3 sm:gap-3">
                <svg className="w-6 h-6 sm:w-6 sm:h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
                </svg>
                <span className="text-black">Install in VS Code</span>
              </div>
            </Link>
          </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Company logos section moved above GIF */}
    <TrustedBy dictionary={dictionary} />












  </div>
);
