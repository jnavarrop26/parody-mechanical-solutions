import { toLocale, type Locale } from './config';

/* Cadenas de interfaz que viven en los componentes, no en el contenido:
   etiquetas de navegación, botones de volver, rótulos de accesibilidad.
   Van acá y no en src/data/ porque son parte del chasis del sitio y no algo
   que el cliente edite al cambiar un servicio. */
const strings = {
  en: {
    navLabel: 'Main',
    backHome: 'Back to home',
    lastUpdated: 'Last updated',
    included: "What's included",
    ctaTitle: "Let's get it running right",
    ctaLede:
      "Tell us what equipment you run and we'll reply within one business day with a preliminary quote.",
    ctaButton: 'Request a quote',
    languageLabel: 'Language',
    toggleSubmenu: 'Toggle submenu',
    viewCompetency: 'View competency',
    covers: 'Covers',
    signalsLabel: 'Equipment & process',
  },
  es: {
    navLabel: 'Principal',
    backHome: 'Volver al inicio',
    lastUpdated: 'Última actualización',
    included: 'Qué incluye',
    ctaTitle: 'Pongámoslo a andar como debe',
    ctaLede:
      'Cuéntanos qué equipo manejas y te respondemos en un día hábil con una cotización preliminar.',
    ctaButton: 'Pedir cotización',
    languageLabel: 'Idioma',
    toggleSubmenu: 'Mostrar submenú',
    viewCompetency: 'Ver competencia',
    covers: 'Incluye',
    signalsLabel: 'Equipo y proceso',
  },
} satisfies Record<Locale, Record<string, string>>;

export type UIKey = keyof (typeof strings)['en'];

export function ui(key: UIKey, locale?: unknown): string {
  return strings[toLocale(locale)][key];
}
