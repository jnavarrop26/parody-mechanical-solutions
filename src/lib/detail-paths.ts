import { business } from './business';

type Entry = { slug: string; name: string; longDesc: string; items?: string[]; mode?: string };

/**
 * Empareja las entradas en inglés y español por posición para armar, de una
 * sola vez, los params de getStaticPaths y el hreflang de cada página.
 *
 * Se emparejan por índice y no por slug porque los slugs traducidos no se
 * parecen ("preventive-maintenance" vs "mantenimiento-preventivo"). El orden
 * de los dos archivos JSON es el contrato; si se desincroniza, el build falla
 * acá y no en silencio con un hreflang cruzado.
 */
export function pairEntries(en: Entry[], es: Entry[]) {
  if (en.length !== es.length) {
    throw new Error(
      `[i18n] Las listas de contenido no coinciden: ${en.length} en inglés vs ` +
        `${es.length} en español. Deben tener las mismas entradas y en el mismo orden.`
    );
  }
  return en.map((entry, i) => ({ en: entry, es: es[i] }));
}

/** Rutas equivalentes por idioma para un par de slugs */
export function altPaths(section: { en: string; es: string }, slugs: { en: string; es: string }) {
  return {
    en: `/${section.en}/${slugs.en}/`,
    es: `/es/${section.es}/${slugs.es}/`,
  };
}

/**
 * Schema de servicio + migas. El Service le da a Google el rubro y la zona de
 * cobertura de esta página concreta; el BreadcrumbList es lo que dibuja la
 * ruta "Inicio > Servicios > …" bajo el título en el resultado de búsqueda.
 */
export function servicePageSchema(opts: {
  site: URL | undefined;
  name: string;
  description: string;
  path: string;
  sectionLabel: string;
  sectionPath: string;
  homePath: string;
}) {
  const abs = (p: string) => new URL(p, opts.site).href;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: opts.name,
      description: opts.description,
      url: abs(opts.path),
      serviceType: opts.name,
      /* Se apunta al @id del negocio en vez de repetir la ficha entera: Google
         une los nodos y la página hereda el NAP sin duplicar marcado */
      provider: { '@id': abs('/#business') },
      areaServed: { '@type': 'State', name: business.regionName },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: business.shortName, item: abs(opts.homePath) },
        { '@type': 'ListItem', position: 2, name: opts.sectionLabel, item: abs(opts.sectionPath) },
        { '@type': 'ListItem', position: 3, name: opts.name },
      ],
    },
  ];
}
