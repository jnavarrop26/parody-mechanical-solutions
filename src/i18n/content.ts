import { defaultLocale, toLocale, type Locale } from './config';

/* Los JSON se resuelven en build con un glob eager: no hay lectura de disco en
   runtime ni 22 imports explícitos que mantener a mano. Al agregar un idioma
   basta con crear src/data/<locale>/ y sus archivos. */
const modules = import.meta.glob('../data/*/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

/* bundles['es']['Header'] → el JSON del header en español */
const bundles: Record<string, Record<string, unknown>> = {};

for (const [path, data] of Object.entries(modules)) {
  const match = path.match(/\/data\/([^/]+)\/([^/]+)\.json$/);
  if (!match) continue;
  const [, locale, name] = match;
  (bundles[locale] ??= {})[name] = data;
}

/**
 * Devuelve el bloque de contenido `name` en el idioma pedido.
 *
 * Si falta la traducción cae al idioma por defecto en vez de romper el build:
 * una página con una sección en inglés se arregla después, una página que no
 * compila tira el sitio entero abajo. El aviso queda en consola durante el
 * build para que la falta no pase inadvertida.
 */
export function content<T>(name: string, locale?: unknown): T {
  const loc: Locale = toLocale(locale);
  const hit = bundles[loc]?.[name];

  if (hit) return hit as T;

  if (import.meta.env.DEV || import.meta.env.PROD) {
    console.warn(
      `[i18n] Falta src/data/${loc}/${name}.json — se usa ${defaultLocale}`
    );
  }

  return bundles[defaultLocale][name] as T;
}
