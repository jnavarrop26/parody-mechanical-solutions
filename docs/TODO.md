# Tareas — revisión contra la infografía (capabilities statement)

> Generado el 2026-07-19 comparando `public/capabilities-statement.png` (ver `docs/capabilities-statement.md`) con el contenido del sitio. Actualizado tras aplicar los cambios el 2026-07-19.

## 🔴 Datos incorrectos — CORREGIDO

- [x] **Email de contacto:** ahora `kevinparody135@gmail.com` en contacto, footer y políticas.
- [x] **Teléfonos:** +1 (385) 589-2318 (Kevin) y +1 (385) 391-6049 (Damian) en el footer.
- [x] **Dirección:** Tooele, Utah, USA (se eliminó la dirección colombiana).
- [x] **Cobertura:** Tooele County / Salt Lake / All of Utah, servicio on-site campo y carretera.
- [x] **Sobre nosotros:** texto oficial del About Us de la infografía.
- [x] **Estadísticas sin fuente:** eliminadas de `BenefitsSection.json` (12.400+ vehículos, 17 años, 9 mecánicos). Si el cliente las confirma, se pueden restaurar.
- [x] **Horario "Lun–Sáb":** eliminado del footer (no estaba en la infografía). Si el cliente confirma horario, agregarlo.

## 🟠 Contenido faltante — AGREGADO (salvo lo que depende del cliente)

- [x] **Séptima competencia "Salvage & Component Recovery"** con su página de detalle.
- [x] **Puntos de contacto:** Kevin Parody (Owner) y Damian Muñoz (Manager) en el footer.
- [x] **Slogan** "Smart Maintenance. Reliable Equipment. Always On." abre la sección About.
- [x] **Tagline oficial** en el lede del hero.
- [x] **Capabilities Statement descargable:** enlazado en la barra legal del footer (`/capabilities-statement.png`).
- [ ] **Logo real:** pendiente — pedir al cliente el logo en vectorial (SVG) o PNG con transparencia. El sitio sigue con wordmark de texto.

## 🟡 Nombres — ALINEADOS

- [x] Las 7 competencias usan los nombres oficiales de la infografía, con slugs nuevos en `/competencies/...` y menú actualizado.
- [x] Bullets de los 3 servicios idénticos a la infografía; modos traducidos (Scheduled / On demand / Continuous monitoring).

## 🎨 Colores — MIGRADO A NAVY + DORADO (opción A, 2026-07-19)

- [x] Paleta migrada en `src/styles/global.css`: navy `#14304f` / `#0e1c2c` como color primario (botones, fondos oscuros, titulares), dorado `#f0a500` como acento secundario (ecos, cintas, sellos), dorado profundo `#a06f00` para texto grande sobre fondo claro, blancos fríos. Los nombres de los tokens se conservaron (`--enamel` = navy, `--rust` = dorado).
- [ ] Cuando llegue el logo real, revisar si el rojo del logo pide un acento terciario.

## 🌐 Idioma / SEO / legal — COMPLETADO (salvo dominio)

- [x] Todo el sitio en inglés: header, hero, about, competencias, servicios, beneficios, cobertura, formulario, footer, páginas de detalle, 404, políticas.
- [x] Rutas en inglés: `/services/...`, `/competencies/...`; anclas `#about`, `#services`, `#competencies`, `#benefits`, `#coverage`, `#contact`.
- [x] SEO: `lang="en"`, Open Graph `en_US`, canonical, titles/descriptions en inglés.
- [x] Cookies y políticas en inglés con enfoque EE. UU. (`/cookie-policy`, `/privacy-policy`).
- [x] Sitemap (`@astrojs/sitemap`) + `robots.txt`.
- [ ] **Dominio real:** `astro.config.mjs` y `public/robots.txt` usan `parody-mechanical-solutions.example` — reemplazar por el dominio definitivo antes de publicar.
- [ ] **Formulario de contacto:** `action: "#"` — no envía a ningún lado. Definir backend (Formspree, Netlify Forms, email) antes de lanzar.
- [ ] **Testimonios:** `TestimonialsSection` sigue sin usarse y con datos inventados (en español) — eliminar o pedir testimonios reales al cliente.
- [ ] **Descripciones de "Why choose us?":** las 6 cards siguen sin texto (`desc` vacías) — redactarlas o aprobar que yo las proponga.
