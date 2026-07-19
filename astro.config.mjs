import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // TODO: reemplazar por el dominio definitivo del cliente antes de publicar
  site: 'https://parody-mechanical-solutions.example',
  compressHTML: true,
  integrations: [sitemap()],
});
