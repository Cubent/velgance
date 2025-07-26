import { blog, legal } from '@repo/cms';
import { env } from '@/env';

/**
 * Dynamic sitemap.xml route handler
 * Generates XML sitemap with all pages, blog posts, and legal documents
 */
export async function GET() {
  // Determine protocol and base URL for sitemap entries
  const protocol = env.VERCEL_PROJECT_PRODUCTION_URL?.startsWith('https')
    ? 'https'
    : 'http';
  const baseUrl = `${protocol}://${env.VERCEL_PROJECT_PRODUCTION_URL}`;

  // Fetch dynamic content from CMS
  const blogs = await blog.getPosts();
  const legals = await legal.getPosts();

  // Generate XML sitemap with all pages and dynamic content
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/pricing</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/enterprise</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
${blogs.map(post => `  <url>
    <loc>${baseUrl}/blog/${post._slug}</loc>
    <lastmod>${new Date(post.date).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
${legals.map(legal => `  <url>
    <loc>${baseUrl}/legal/${legal._slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`).join('\n')}
</urlset>`;

  // Return XML response with proper content type
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
