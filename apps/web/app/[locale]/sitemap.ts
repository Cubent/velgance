import fs from 'node:fs';
import { env } from '@/env';
import { blog, legal } from '@repo/cms';
import type { MetadataRoute } from 'next';

const appFolders = fs.readdirSync('app', { withFileTypes: true });
const pages = appFolders
  .filter((file) => file.isDirectory())
  .filter((folder) => !folder.name.startsWith('_'))
  .filter((folder) => !folder.name.startsWith('('))
  .map((folder) => folder.name);
const blogs = (await blog.getPosts()).map((post) => post._slug);
const legals = (await legal.getPosts()).map((post) => post._slug);
const protocol = env.VERCEL_PROJECT_PRODUCTION_URL?.startsWith('https')
  ? 'https'
  : 'http';
const url = new URL(`${protocol}://${env.VERCEL_PROJECT_PRODUCTION_URL}`);

const sitemap = async (): Promise<MetadataRoute.Sitemap> => [
  {
    url: new URL('/', url).href,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  },
  ...pages.map((page) => ({
    url: new URL(page, url).href,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })),
  ...blogs.map((blog) => ({
    url: new URL(`blog/${blog}`, url).href,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })),
  ...legals.map((legal) => ({
    url: new URL(`legal/${legal}`, url).href,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  })),
];

export default sitemap;
