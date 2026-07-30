import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Con www, que es la forma que resuelve el certificado y la que el cliente
  // usa. El host debe quedar en UNA sola forma: si parody-mechanical.us sin
  // www también responde, tiene que redirigir 301 acá, o Google reparte la
  // autoridad entre dos versiones de cada página.
  site: 'https://www.parody-mechanical.us',
  compressHTML: true,
  // El inglés se sirve en la raíz y el español bajo /es/. prefixDefaultLocale
  // en false evita que la home quede en /en/ y obligue a un redirect desde /.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    // El sitemap emite los <xhtml:link rel="alternate"> entre las dos
    // versiones de cada página. Sin esto Google las trata como URLs sueltas
    // y puede leerlas como contenido duplicado en vez de traducciones.
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', es: 'es' },
      },
    }),
  ],
});
