/* Configuración de idiomas. Es la única fuente de verdad: el ruteo de Astro
   (astro.config.mjs), el hreflang del <head> y el resolutor de contenido leen
   de acá, así que agregar un idioma es tocar esta lista y crear su carpeta
   en src/data/.

   El inglés vive en la raíz (/) y el español bajo /es/. No al revés: el
   negocio opera en Utah y factura en inglés — el español suma alcance, no
   reemplaza al idioma principal. */
export const locales = ['en', 'es'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/* Etiquetas para el atributo lang y para hreflang.
   hreflang va sin región a propósito: "es" alcanza a cualquier hispanohablante
   —de Utah o de México— mientras que "es-MX" le diría a Google que la página
   es para gente EN México, que no es el cliente de un taller de Tooele. */
export const localeMeta: Record<Locale, { lang: string; hreflang: string; ogLocale: string; label: string }> = {
  en: { lang: 'en', hreflang: 'en-US', ogLocale: 'en_US', label: 'English' },
  es: { lang: 'es', hreflang: 'es', ogLocale: 'es_US', label: 'Español' },
};

export const isLocale = (value: unknown): value is Locale =>
  locales.includes(value as Locale);

/* Normaliza lo que devuelve Astro.currentLocale, que es string | undefined */
export const toLocale = (value: unknown): Locale =>
  isLocale(value) ? value : defaultLocale;

/* Antepone el prefijo de idioma a una ruta interna. El idioma por defecto no
   lleva prefijo, así que localizePath('en', '/services/') devuelve la ruta tal
   cual y localizePath('es', '/services/') devuelve '/es/services/'. */
export function localizePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === '/' ? `/${locale}/` : `/${locale}${clean}`;
}

/* Los segmentos de sección también están traducidos, así que la ruta de una
   página de detalle no se puede armar concatenando un prefijo fijo con el
   slug: en español es /es/competencias/… y no /competencies/…. */
const sectionSegment: Record<Locale, Record<'competencies' | 'services' | 'cities', string>> = {
  en: { competencies: '/competencies', services: '/services', cities: '/utah' },
  es: { competencies: '/es/competencias', services: '/es/servicios', cities: '/es/utah' },
};

/**
 * URL de una página de detalle. Cierra con barra a propósito: las páginas se
 * generan como directorios y el sitemap las lista así, de modo que un enlace
 * sin barra provoca un redirect extra en cada clic.
 */
export function detailHref(
  section: 'competencies' | 'services' | 'cities',
  slug: string,
  locale: unknown
): string {
  return `${sectionSegment[toLocale(locale)][section]}/${slug}/`;
}
