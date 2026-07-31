import type { Locale } from '@/i18n/config';

/* ——— NAP canónico ———
   Name / Address / Phone en un solo lugar. Para SEO local, que estos datos
   sean idénticos en el sitio, en Google Business y en cualquier directorio es
   una de las señales que más pesa: Google cruza las menciones y las
   inconsistencias le restan confianza al negocio.

   Todo lo de acá sale de src/data/en/Footer.json y del CSR del dominio. Lo
   que NO está verificado no se inventa — ver la nota al pie del archivo. */
export const business = {
  legalName: 'Parody Mechanical Solutions LLC',
  shortName: 'Parody Mechanical Solutions',
  telephone: '+1-385-589-2318',
  telephoneAlt: '+1-385-391-6049',
  email: 'diagnostic@parody-mechanical.us',
  locality: 'Tooele',
  region: 'UT',
  regionName: 'Utah',
  country: 'US',
  /* Códigos NAICS del registro federal — schema.org los admite en Organization
     y refuerzan de qué se ocupa la empresa ante buscadores y compradores
     públicos, que es donde SAM.gov importa. */
  naics: '811310',
} as const;

/* Ciudades donde el negocio declara cobertura, según CoverageSection.json.
   Es la lista que alimenta tanto areaServed del schema como las páginas por
   ciudad: una sola fuente evita prometer en el schema una zona que no tiene
   página, o al revés. */
export const serviceAreas = [
  { slug: 'tooele', name: 'Tooele', county: 'Tooele County' },
  { slug: 'salt-lake-city', name: 'Salt Lake City', county: 'Salt Lake County' },
  { slug: 'west-valley-city', name: 'West Valley City', county: 'Salt Lake County' },
] as const;

export type ServiceArea = (typeof serviceAreas)[number];

/**
 * Ficha de negocio para resultados enriquecidos.
 *
 * AutoRepair es un subtipo de LocalBusiness: le dice a Google el rubro exacto
 * sin depender de que lo deduzca del texto. Se emite una sola vez por página y
 * solo donde hay contenido de negocio real.
 */
export function businessSchema(opts: {
  site: URL | undefined;
  description: string;
  locale: Locale;
}) {
  const abs = (path: string) => new URL(path, opts.site).href;

  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    '@id': abs('/#business'),
    name: business.legalName,
    description: opts.description,
    url: abs('/'),
    /* Sin `image`: apuntaba a /img/og-cover.png, que no existe. Un campo con
       una URL rota es peor que su ausencia — Google descarta el nodo entero
       cuando no puede resolver la imagen. `logo` sí resuelve y se queda. */
    logo: abs('/img/logo.webp'),
    telephone: business.telephone,
    email: business.email,
    naics: business.naics,
    /* El negocio atiende en los dos idiomas: es una propiedad real del
       servicio, no un truco de marcado */
    knowsLanguage: ['en', 'es'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: business.locality,
      addressRegion: business.region,
      addressCountry: business.country,
    },
    /* Negocio de área de servicio: las unidades móviles van al equipo, así que
       la cobertura se declara por zona y no por una dirección de mostrador */
    areaServed: [
      { '@type': 'State', name: business.regionName },
      ...serviceAreas.map((a) => ({ '@type': 'City', name: a.name })),
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: opts.locale === 'es' ? 'Servicios de mantenimiento' : 'Maintenance services',
      itemListElement: (opts.locale === 'es'
        ? [
            'Mantenimiento preventivo',
            'Mantenimiento correctivo',
            'Mantenimiento predictivo',
            'Mecánica diésel de flotas',
            'Sistemas hidráulicos de alta presión',
            'Diagnóstico eléctrico automotriz',
            'Asistencia mecánica en carretera',
            'Servicio mecánico a domicilio',
          ]
        : [
            'Preventive maintenance',
            'Corrective maintenance',
            'Predictive maintenance',
            'Fleet diesel mechanics',
            'High-pressure hydraulic systems',
            'Automotive electrical diagnostics',
            'Roadside mechanical assistance',
            'On-site mobile service',
          ]
      ).map((name) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name },
      })),
    },
  };
}

/* ——— Lo que falta y no se inventa ———
   openingHours, dirección de calle, coordenadas geo, priceRange, sameAs
   (perfiles sociales) y aggregateRating quedan fuera a propósito: no hay dato
   verificado. Marcado inventado es motivo de penalización manual, y una
   reseña o un horario falso es peor que la ausencia del campo. En cuanto el
   cliente los confirme, se agregan acá y aparecen en todas las páginas. */
