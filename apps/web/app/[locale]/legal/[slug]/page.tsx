import { Sidebar } from '@/components/sidebar';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type LegalPageProperties = {
  readonly params: Promise<{
    slug: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: LegalPageProperties): Promise<Metadata> => {
  const { slug } = await params;
  
  // TODO: Replace with actual legal content when CMS is implemented
  return createMetadata({
    title: `Legal - ${slug}`,
    description: 'Legal page',
  });
};

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  // TODO: Replace with actual legal pages when CMS is implemented
  return [
    { slug: 'privacy' },
    { slug: 'terms' },
    { slug: 'cookies' }
  ];
};

const LegalPage = async ({ params }: LegalPageProperties) => {
  const { slug } = await params;

  // TODO: Replace with actual legal content when CMS is implemented
  const legalContent: Record<string, { title: string; content: string }> = {
    privacy: {
      title: 'Privacy Policy',
      content: 'Privacy policy content will be added when CMS is implemented.'
    },
    terms: {
      title: 'Terms of Service',
      content: 'Terms of service content will be added when CMS is implemented.'
    },
    cookies: {
      title: 'Cookie Policy',
      content: 'Cookie policy content will be added when CMS is implemented.'
    }
  };

  const data = legalContent[slug];
  
  if (!data) {
    notFound();
  }

  return (
          <div className="min-h-screen bg-gradient-to-b from-orange-950/10 to-transparent">
            <div className="container mx-auto max-w-6xl py-16 px-4">
              <div className="flex flex-col items-start gap-8 lg:flex-row">
              <div className="flex-1 max-w-none lg:max-w-3xl mx-auto lg:mx-0">
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <h1>{data.title}</h1>
                  <p>{data.content}</p>
                </div>
              </div>
              <div className="sticky top-24 hidden shrink-0 lg:block lg:w-64">
                <Sidebar
                  toc={<div>Table of contents placeholder</div>}
                  readingTime="1 min read"
                  date={new Date()}
                />
              </div>
            </div>
            </div>
          </div>
  );
};

export default LegalPage;
