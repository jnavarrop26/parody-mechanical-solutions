import type { APIRoute } from 'astro';

/* Se genera en build a partir de `site` (astro.config.mjs) en vez de vivir
   hardcodeado en public/: así el dominio tiene una sola fuente de verdad y
   el sitemap no queda apuntando a un host viejo al cambiar de dominio. */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
