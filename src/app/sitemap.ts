import type { MetadataRoute } from 'next';

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://inovarepintura.pt';

/* Uma página só. Não inventamos rotas por localidade — páginas locais
 * artificiais com texto duplicado prejudicam mais do que ajudam. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl, lastModified: new Date(), priority: 1 }];
}
