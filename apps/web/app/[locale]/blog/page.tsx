import { blog } from '@repo/cms';
import { Feed } from '@repo/cms/components/feed';
import { Image } from '@repo/cms/components/image';
import { cn } from '@repo/design-system/lib/utils';
import { getDictionary } from '@repo/internationalization';
import type { Blog, WithContext } from '@repo/seo/json-ld';
import { JsonLd } from '@repo/seo/json-ld';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import Link from 'next/link';

type BlogProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: BlogProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.blog.meta);
};

const BlogIndex = async ({ params }: BlogProps) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  const jsonLd: WithContext<Blog> = {
    '@type': 'Blog',
    '@context': 'https://schema.org',
  };

  return (
    <>
      <JsonLd code={jsonLd} />
      <div className="w-full pt-40 pb-20 lg:pt-48 lg:pb-40">
        <div className="container mx-auto flex flex-col gap-14">
          <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="max-w-xl font-regular text-3xl tracking-tighter md:text-5xl">
              {dictionary.web.blog.meta.title}
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Feed queries={[blog.postsQuery]}>
              {async ([data]) => {
                'use server';

                if (!data.blog.posts.items.length) {
                  return null;
                }

                return data.blog.posts.items.map((post, index) => (
                  <Link
                    href={`/blog/${post._slug}`}
                    className="flex cursor-pointer flex-col gap-3 hover:opacity-75"
                    key={post._slug}
                  >
                    <div className="aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={post.image.url}
                        alt={post.image.alt ?? ''}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-row items-center gap-4">
                      <p className="text-muted-foreground text-xs">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg font-semibold tracking-tight line-clamp-2">
                        {post._title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
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

export default BlogIndex;
