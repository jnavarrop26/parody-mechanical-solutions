# TODO — Mejoras del sitio (observaciones de contratación federal + conversión)

Basado en observaciones enviadas el 2026-08-09. Prioridad: 🔴 P0 (crítico) · 🟠 P1 (alto impacto) · 🟡 P2 (contenido/credibilidad).

## 🔴 P0 — Crítico

- [ ] **El formulario de contacto no envía a ningún lado.** `action="#"` en `src/data/{es,en}/ContactSection.json`. No es solo "verificar si entrega los correos": ahora mismo no puede entregar nada porque no apunta a ningún endpoint. **Pendiente a propósito** — el usuario va a crear el Formspree; cuando esté listo, actualizar `form.action` en ambos JSON y probar con un envío real.
- [x] **UEI, CAGE code y NAICS incompletos/invisibles.** `src/data/{es,en}/Footer.json` (`company.rows`) y `src/data/{es,en}/AboutSection.json` (`facts`) incluyen "UEI" (`PC1PADR7WZY4`), "CAGE Code" (`214X9`) y "NAICS" (`811310 · 811111 · 811118`), además de "Registro: Activo en SAM.gov".
  - **Bug encontrado y corregido de paso:** `AboutSection.astro` recibía `facts` del JSON pero nunca los renderizaba — toda esta info (ubicación, UEI, CAGE, NAICS) era invisible en la sección "Nosotros", solo se veía en el footer. Se agregó el bloque `<dl class="about__facts">` que sí los pinta.
  - Falta reflejar lo mismo en el capability statement (ítem P1, cuando se convierta a PDF).
- [x] **Códigos PSC agregados.** `src/data/{es,en}/Footer.json` (`registry.psc`) — se sumaron J019 (Motor Vehicles), J038 (Construction & Excavating Equip.) y J061 (Electrical Equipment) debajo de los NAICS en el footer, renderizados en `Footer.astro`. Pendiente: incluirlos también en el capability statement en PDF (ítem P1).

## 🟠 P1 — Alto impacto

- [ ] **Capability statement en PNG.** `public/doc/capabilities-statement.png`, referenciado en `Footer.json → legal.links`. Convertir a PDF de una página descargable e indexable: datos de empresa, **UEI `PC1PADR7WZY4` / CAGE `214X9`** (ya confirmados), NAICS, competencias core, diferenciadores, past performance y contacto. Actualizar con la ubicación real.
- [~] **Prueba social insuficiente — 1 de 2-3 casos reales agregado.**
  - **Bug encontrado y corregido de paso:** `TestimonialsSection.astro` nunca estaba importado en `src/pages/index.astro` ni `src/pages/es/index.astro` — la sección no aparecía en el sitio en absoluto. Ya está conectada (entre Benefits y Coverage, justo antes de pedir contacto).
  - **Bug encontrado y corregido de paso:** `src/data/en/TestimonialsSection.json` tenía texto en español (mal etiquetado) y `src/data/es/TestimonialsSection.json` no existía — el sitio en inglés mostraba testimonios en español. Se separaron correctamente en ambos idiomas.
  - **Caso real agregado** (anonimizado para la web pública, sin nombre ni teléfono de la referencia — decisión del usuario): contratista de FedEx Ground, 33 unidades step van (Ford E350 700 cu ft / Freightliner MT55G 600 cu ft, GVWR 10,001–23,000 lbs), contrato tipo Labor-Hour, +10 años de experiencia previa a fundar la empresa. Vive en `src/data/{es,en}/TestimonialsSection.json → cases[]`, renderizado como bloque "Casos reales"/"Past performance" antes de las citas anónimas.
  - **Referencia completa (privada, NO publicada en la web — solo para el capability statement en PDF, ítem P1):** Cliente — 3 Transportation. Contacto de referencia — Mackey, +1 801-921-1043.
  - Quedan pendientes 1-2 mini-casos más (idealmente con logo de cliente si es posible) para reforzar la prueba social del sector privado.
- [ ] **SEO on-page débil.** `src/pages/index.astro` — `title="Parody Mechanical Solutions"`, sin keywords. Cambiar a algo tipo "Mecánica diésel y reparación de flotas — Salt Lake City y Utah". Revisar también el H1.
- [ ] **Google Business Profile.** Verificar si existe y, si no, crearlo/optimizarlo — gratis y alto retorno para búsquedas locales.

## 🟡 P2 — Contenido / credibilidad

- [x] **Páginas de competencias delgadas.** `src/pages/{competencies,es/competencias}/[slug].astro` + `DetailPage.astro` + `CoreCompetencies.json` (es/en). Se agregaron 2 párrafos reales (contexto + ejemplo concreto) y una sección "Equipo y proceso" (3 señales de herramienta/proceso) a las 7 competencias, en ambos idiomas. `DetailPage.astro` ahora soporta `paragraphs[]` y `signals[]` sin romper las páginas de `services` (siguen usando `intro`). Verificado con `bun run build`.
- [x] **"¿Por qué elegirnos?" vacío.** `src/data/{es,en}/BenefitsSection.json` — las 6 razones tenían `desc: ""`. Se redactó una línea real para cada una.
- [x] **"Diagnóstico certificado" sin respaldo.** Confirmado con el dueño: certificación ASE, EPA 609 (refrigerantes) y OSHA 10/30, más entrenamiento de fábrica. Se nombraron explícitamente en `BenefitsSection.json` (es/en). *Pendiente: confirmar si se puede precisar la especialidad ASE (ej. A1, A6, T2) para el capability statement en PDF (ítem P1).*
- [x] **Marca "Parody" sola (lectura como "parodia" para audiencia angloparlante).** Verificado en Header, Hero y Footer: en los tres lugares "Parody" siempre aparece junto a "Mechanical Solutions (LLC)", nunca solo. No se requirió cambio de código.

## Notas

- Cambios de P2 aplicados y verificados con `bun run build` (33 páginas, sin errores).
- El punto de la especialidad ASE exacta queda abierto para cuando se arme el capability statement en PDF.
