# CI/CD con Vercel — Opción B (deploys dirigidos desde GitHub Actions)

> GitHub Actions controla todo el pipeline con la CLI de Vercel: nada llega a
> producción sin que el build pase en CI. Los PRs generan un preview con URL
> propia comentada en el PR; los pushes a `main` despliegan a producción.
>
> El workflow ya está en [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).
> Esta guía cubre la configuración que solo tú puedes hacer (cuentas, tokens, secretos).

## Arquitectura

```
Pull Request ──▶ GitHub Actions ──▶ vercel build ──▶ deploy PREVIEW ──▶ URL comentada en el PR
                                        │ (si falla, no hay deploy)
push a main ──▶ GitHub Actions ──▶ vercel build ──▶ deploy PRODUCTION
```

**Importante:** en esta opción **NO se conecta el repo desde el dashboard de
Vercel** (Project → Git). Si lo conectas, Vercel desplegaría por su cuenta en
cada push y tendrías deploys duplicados compitiendo con los de Actions.

---

## Paso 1 — Cuenta y CLI de Vercel

1. Crea la cuenta en <https://vercel.com/signup> (puedes entrar con GitHub).
2. Instala la CLI localmente y autentícate:

   ```bash
   bun add -g vercel     # o: npm i -g vercel
   vercel login
   ```

## Paso 2 — Vincular el proyecto (una sola vez)

Desde la raíz del proyecto:

```bash
vercel link
```

Responde: scope = tu cuenta · "Link to existing project?" = **No** ·
nombre = `parody-mechanical-solutions` · directorio = `./`.

Esto crea el proyecto en Vercel y deja los IDs en `.vercel/project.json`
(carpeta ya ignorada en `.gitignore` — no se versiona).

```bash
cat .vercel/project.json
# { "orgId": "team_xxx...", "projectId": "prj_xxx..." }
```

Guarda esos dos valores: son los que van a GitHub como secretos.

> Verifica también en el dashboard (Project → Settings → Build & Development)
> que Framework Preset = **Astro**. La CLI normalmente lo detecta sola.

## Paso 3 — Token de Vercel

1. Ve a <https://vercel.com/account/settings/tokens>.
2. **Create Token** → nombre `github-actions-parody` → scope: tu cuenta →
   expiración: la que tu política permita (pon un recordatorio para rotarlo).
3. Copia el token — solo se muestra una vez.

## Paso 4 — Secretos en GitHub

En <https://github.com/jnavarrop26/parody-mechanical-solutions> →
**Settings → Secrets and variables → Actions → New repository secret**, crea:

| Secreto | Valor |
|---|---|
| `VERCEL_TOKEN` | el token del paso 3 |
| `VERCEL_ORG_ID` | `orgId` de `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `projectId` de `.vercel/project.json` |

## Paso 5 — Primer push

```bash
git add -A
git commit -m "Initial commit"
git push -u origin main
```

Ese push dispara el job **Production deploy (main)**. Síguelo en la pestaña
**Actions** del repo; al terminar, el sitio queda en
`https://parody-mechanical-solutions.vercel.app`.

## Paso 6 — Probar el flujo de preview

```bash
git checkout -b prueba-preview
# haz cualquier cambio pequeño
git commit -am "Test preview deploy"
git push -u origin prueba-preview
```

Abre un PR en GitHub: el job **Preview deploy (PR)** construye, despliega y
comenta en el PR la URL del preview (`https://parody-mechanical-solutions-xxx.vercel.app`).
Esa URL es la que se comparte con el cliente para aprobar cambios.

## Paso 7 — Proteger `main` (recomendado)

**Settings → Branches → Add branch ruleset** para `main`:

- ✅ Require a pull request before merging
- ✅ Require status checks to pass → busca y marca **Preview deploy (PR)**

Con esto, nadie (ni tú por accidente) mergea código cuyo build falló, y como
producción solo se despliega desde `main`, producción queda blindada.

## Paso 8 — Dominio real (cuando el cliente lo confirme)

1. Vercel: Project → **Settings → Domains** → añade el dominio y sigue las
   instrucciones de DNS (registro `A`/`CNAME`).
2. En el repo, actualiza el placeholder `parody-mechanical-solutions.example`:
   - `astro.config.mjs` → `site: 'https://dominio-real.com'`
   - `public/robots.txt` → línea `Sitemap:`
3. Commit + push → el pipeline redespliega con canonical/OG/sitemap correctos.

---

## Cómo funciona el workflow (referencia)

`.github/workflows/deploy.yml` tiene dos jobs excluyentes:

| | Preview (PR) | Production (push a `main`) |
|---|---|---|
| Trigger | `pull_request` | `push` a `main` |
| Entorno | `vercel pull --environment=preview` | `--environment=production` |
| Build | `vercel build` | `vercel build --prod` |
| Deploy | `vercel deploy --prebuilt` | `vercel deploy --prebuilt --prod` |
| Extra | comenta la URL en el PR | — |

Claves del diseño:

- **`vercel build` corre en el runner de GitHub**, no en Vercel: si el build de
  Astro falla, el paso de deploy nunca se ejecuta. Ese es el punto de la opción B.
- **`--prebuilt`** sube el resultado ya construido (`.vercel/output`), así el
  build ocurre exactamente una vez y lo que se probó es lo que se publica.
- `oven-sh/setup-bun` está en el runner porque `vercel build` detecta `bun.lock`
  y usa Bun para instalar dependencias.
- `permissions: pull-requests: write` existe solo para que el bot pueda comentar
  la URL del preview.

## Rollback

Dos caminos:

- **Dashboard:** Project → Deployments → deployment anterior → ⋯ → *Promote to
  Production* (instantáneo, no requiere rebuild).
- **Git:** `git revert` del commit malo y push a `main` — el pipeline despliega
  la versión revertida. Preferible, porque deja el repo y producción sincronizados.

## Mantenimiento

- **Rotar `VERCEL_TOKEN`** cuando expire: repetir pasos 3–4. Si el pipeline
  falla con `403`/`Not authorized`, casi siempre es el token vencido.
- Variables de entorno futuras (p. ej. la API key del backend del formulario):
  se crean en Vercel (Project → Settings → Environment Variables) y
  `vercel pull` las inyecta al build automáticamente — no se tocan los workflows.
