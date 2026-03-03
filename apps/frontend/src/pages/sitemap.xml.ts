/**
 * Sitemap dinámico — BravaBoards
 * Ruta: /sitemap.xml
 * Generado en build time: incluye páginas estáticas + categorías y artículos de Strapi.
 * Configura la URL base con la env var PUBLIC_SITE_URL (default: https://bravaboards.es).
 */
import type { APIContext } from 'astro';
import { getCategories, getArticles } from '../lib/strapi';
import type { Category, Article } from '../types/strapi';

const SITE = import.meta.env.PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://bravaboards.es';

function url(path: string, priority: string, changefreq: string, lastmod?: string): string {
  const loc = `${SITE}${path}`;
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].filter(Boolean).join('\n');
}

export async function GET(_ctx: APIContext): Promise<Response> {
  const today = new Date().toISOString().split('T')[0];

  const [rawCats, rawArticles] = await Promise.all([
    getCategories(),
    getArticles(),
  ]);

  const categories = (rawCats as Category[]).filter(c => c.slug);
  const articles   = (rawArticles as Article[]).filter(a => a.slug);

  const staticUrls = [
    url('/',         '1.0', 'weekly',  today),
    url('/contacto', '0.8', 'monthly', today),
    url('/blog',     '0.8', 'weekly',  today),
  ];

  const categoryUrls = categories.map(cat =>
    url(`/${cat.slug}`, '0.9', 'weekly', today)
  );

  const articleUrls = articles.map(article => {
    const lastmod = article.published_date ?? today;
    return url(`/blog/${article.slug}`, '0.7', 'monthly', lastmod);
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticUrls,
    ...categoryUrls,
    ...articleUrls,
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
