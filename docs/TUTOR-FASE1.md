# Tutor — Fase 1 (Tierra Noble)

Este documento explica **por qué** se construyó el monorepo como está, no solo *qué* hay en cada carpeta. Pensalo como la voz del mentor al lado del checklist de `readme.md`. Para “cómo levantarlo”, usá [SETUP.md](../SETUP.md).

---

## Decisiones que cerramos antes de codear

| Decisión | Elegimos | Por qué |
|---|---|---|
| Alcance de esta entrega | Etapas **1.1–1.4** | Coolify/Hetzner (1.5) necesita *tu* servidor y dominio; Lighthouse polish (1.6) se hace cuando la landing ya corre. Entregar infra de deploy sin servidor es teatro. |
| Monorepo tooling | **pnpm workspaces** solo | El readme lo recomienda. Turborepo suma cache/pipelines; en Fase 1 con 2 apps no duele todavía. `ponytail: add Turbo when CI builds se vuelven lentos.` |
| Payload | **`apps/admin` separado** del storefront | Cumple el árbol del readme (`:3000` / `:3001`), permite CORS explícito y un deploy futuro de admin aparte. Embebido es más simple, pero acopla release del front al CMS. |
| Base de datos | **PostgreSQL** | Payload 3 lo soporta bien; en el ecosistema Next/Coolify es más familiar que Mongo; backups y tooling (pgAdmin) son cotidianos. |
| Contenido inicial | **Script seed** | Un dump de DB no se lee en git y se pudre. Un seed se corre en cada máquina/`docker compose` y documenta el shape de los bloques. |
| `BotonGuardar.jsx` | **Eliminado** | Era un órfano fuera del monorepo; no aportaba al contrato de bloques. |

---

## 1.1 — Monorepo y tooling

### Qué hay

```
apps/storefront/   → Next.js 15 (landing)
apps/admin/        → Payload 3 + Next (CMS)
packages/core/     → tipos compartidos de bloques (contrato)
packages/infrastructure/ → stub vacío (Fase 2)
```

Raíz: `pnpm-workspace.yaml`, `tsconfig.base.json`, ESLint flat + Prettier compartidos (`@typescript-eslint/parser` para `.ts`/`.tsx`), `.gitignore` que ignora `.env*`.

### Por qué así

1. **Workspaces, no un solo `package.json` gigante**  
   Cada app tiene sus deps y scripts. Si Payload pincha una versión de Next distinta al storefront, el dolor queda acotado.

2. **`packages/core` con tipos de bloques**  
   El error clásico en CMS + front es que el admin inventa un campo y el React no lo sabe tipar. El contrato vive en un solo lugar (`packages/core/src/blocks.ts`). El admin *espeja* esos campos en Payload; el storefront *consume* el contrato. No es un package “enterprise”: es un archivo de tipos con `exports`.

3. **Sin Turborepo**  
   Menos YAML mágico. `pnpm --filter` alcanza para `dev` / `build` / `seed`.

4. **Scripts en la raíz**  
   `pnpm dev` levanta las dos apps en paralelo. Eso es el entregable de 1.1: un solo comando mental para el día a día.

### Mental model

```
pnpm (workspace)
 ├─ @tn/admin        habla con Postgres
 ├─ @tn/storefront   habla con HTTP REST de admin
 └─ @tn/core         solo tipos (sin runtime pesado)
```

---

## 1.2 — Payload: collections y bloques

### Mental model del CMS

Payload no es “WordPress lite”: es un **CMS headless** donde vos modelás colecciones (tablas/documentos) y el admin UI se genera solo. El front **no** lee la DB: lee la **API** (`/api/pages`, `/api/globals/...`).

### Por qué `pages` + `layout` tipo blocks

Es el patrón “Flexible Content” de ACF: una página tiene un array ordenable de *bloques*. Cada bloque tiene un `blockType` (`hero`, `features`, …). El editor reordena; el front mapea `blockType → React component`.

Ventaja pedagógica: una segunda página (etapa 1.6) reutiliza los mismos bloques sin código nuevo de layout.

### Colecciones

| Slug | Rol |
|---|---|
| `users` | Auth del admin (`/admin`). Sin esto, el panel está abierto. |
| `media` | Uploads. `read: () => true` porque la landing necesita servir imágenes públicamente. |
| `pages` | Contenido de landing. `slug` único; `home` = `/`. |

### Global `site-settings`

Nombre, logo, redes, SEO default. Va en Global (no Collection) porque hay **una** instancia, no N filas.

### CORS / CSRF

`STOREFRONT_URL` en `payload.config.ts` alimenta `cors` y `csrf`. En producción **nunca** `*`: el storefront es el único origen de confianza. Eso es el trade-off de “admin separado”: hay que cablear CORS a propósito (y eso es bueno, porque te obliga a pensar el borde).

### Seed

`apps/admin/src/seed/index.ts`:

1. Crea usuario admin (env `SEED_ADMIN_*`).
2. Upsert del global.
3. Upsert de página `home` con un ejemplo de **cada** bloque.

El richText de Payload 3 usa **Lexical**. El seed arma un documento Lexical mínimo (párrafo + texto). En el storefront convertimos eso a texto plano con un helper naive (`lexicalToPlainText`) — marcado como `ponytail` porque el upgrade natural es el renderer oficial de Lexical.

### Secretos

`PAYLOAD_SECRET` **no** tiene default útil en código. Si falta, Payload/seed fallan. Eso es fail-fast a propósito (mejor que un secret hardcodeado en git).

---

## 1.3 — Storefront: renderizado de bloques

### Flujo de datos (RSC)

```
Browser → Next Server Component
            → fetch(`${PAYLOAD_URL}/api/pages?where[slug][equals]=home&depth=2`)
            → BlockRenderer
            → HeroBlock | FeaturesBlock | …
```

Todo el fetch es en **Server Components**. No hay `useEffect` para cargar la página: el HTML sale con contenido. `revalidate: 30` es un ISR liviano para no golpear Payload en cada request de preview.

### Catch-all `app/[[...slug]]/page.tsx`

- `/` → slug lógico `home`
- `/foo` → slug `foo`
- `/a/b` → slug `a/b` (por si más adelante hay nesting)

`[[...slug]]` (doble corchete) también matchea la raíz; `[...slug]` no.

### `BlockRenderer`

Un `switch` sobre `block.blockType`. Si llega un tipo desconocido, **skipea** (`null`) en vez de tirar 500. Eso evita que un bloque nuevo en el admin tumbe todo el sitio hasta que exista el componente React.

### Por qué REST y no Local API

Con procesos separados, Local API de Payload (mismo proceso Node) no aplica. REST es el contrato estable entre contenedores/puertos. Más verboso que importar `getPayload()`, pero honesto con la topología.

### `env.ts` + Zod

Si falta `PAYLOAD_URL`, la app **explota al primer request** con un mensaje claro. Preferible a un 500 opaco por `fetch(undefined/...)`.

### Headers de seguridad

En `next.config.ts`: `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS, y `poweredByHeader: false`. Son baratos y cubren el checklist del readme sin un middleware complejo.

### Design tokens

Tokens en `@theme` dentro de `globals.css` (`--color-ink`, `--color-accent`, `--font-display`, …). Tailwind 4 via `@import 'tailwindcss'`; en markup usá utilidades de tema (`text-ink`, `bg-accent`, `font-display`), no `*[var(--…)]`. No hay un design system completo: hay un sistema de color mínimo para que los bloques no se peleen.

### Atajos conscientes (`ponytail`)

- Lexical → plain text (no renderer rico).
- Testimonials en **grid**, no carousel (menos deps, mejor a11y nativa).
- FAQ con `<details>` nativo (cero JS de acordeón).

---

## 1.4 — Docker

### Qué levanta `docker compose`

| Servicio | Rol |
|---|---|
| `db` | Postgres 16 alpine, healthcheck, puerto 5432 expuesto en **dev** |
| `admin` | Payload en :3001, target `dev` |
| `storefront` | Next en :3000, habla a `http://admin:3001` por red interna |
| `maildev` | Perfil opcional `mail` |

### Por qué multi-stage + `USER node`

Imagen final sin toolchain de build y sin correr como root. En **dev** usamos target `dev` con volumes del código; los `node_modules` viven en **named volumes**, no en el host — evita el clásico “Windows mount rompe binarios nativos”.

### Base image pinneada

`node:20.11-alpine`, no `node:latest`. Reproducible mañana.

### `.env.example`

Todas las keys con comentario. El `.env` real está en `.gitignore`. En Compose, `DATABASE_URI` apunta al hostname `db`; en local pnpm, a `localhost`.

---

## Cómo se relacionan las piezas (mapa mental)

```
┌─────────────┐   REST /api/*    ┌──────────────┐
│ storefront  │ ───────────────► │ admin/Payload│
│  :3000      │                  │  :3001       │
└─────────────┘                  └──────┬───────┘
                                        │ SQL
                                        ▼
                                 ┌─────────────┐
                                 │  Postgres   │
                                 └─────────────┘
```

1. Editás un título en `/admin`.
2. Payload guarda en Postgres.
3. El storefront, en el próximo fetch (o tras revalidate), muestra el cambio.

Eso **es** el entregable de Fase 1: contenido editable → API limpia → UI de bloques.

---

## Qué quedó fuera a propósito (y cuándo sumarlo)

| Ítem | Cuándo |
|---|---|
| Coolify / dominio / SSL (1.5) | Cuando tengas VPS Hetzner + DNS |
| Lighthouse ≥ 90, sitemap, OG (1.6) | Cuando la Home se vea estable |
| Turborepo | Cuando CI tarde de más |
| Rate limit en login Payload | Antes de exponer admin a internet |
| Subdominio `admin.` o IP allowlist | Mismo momento que 1.5 |
| Renderer Lexical rico | Cuando el marketing pida tipografía en el hero |

---

## Cómo agregar un bloque nuevo (receta)

1. **Contrato**: tipo en `packages/core/src/blocks.ts` + unión `LayoutBlock`.
2. **Admin**: archivo en `apps/admin/src/collections/blocks/` y registrarlo en `Pages.ts`.
3. **Front**: componente en `apps/storefront/src/components/blocks/` + `case` en `BlockRenderer`.
4. **Seed** (opcional): un ejemplo en `seed/index.ts` para no testear a mano.
5. Reiniciar admin si hace falta regenerar tipos (`pnpm --filter @tn/admin generate:types`).

Si te salteás el paso 1, el día 3 el front y el CMS ya no hablan el mismo idioma.

---

## Comandos del día a día

Ver [SETUP.md](../SETUP.md). Resumen:

```powershell
Copy-Item .env.example .env   # una vez; editar PAYLOAD_SECRET
docker compose up -d db
pnpm install
pnpm seed
pnpm dev
```

- Landing: http://localhost:3000  
- Admin: http://localhost:3001/admin  

Si npm/pnpm fallan por certificados en esta máquina:

```powershell
$env:NODE_OPTIONS="--use-system-ca"
```

---

## Checklist mental “¿entendí Fase 1?”

- [ ] Sé por qué hay dos apps y no una sola Next con Payload embebido.
- [ ] Sé qué es un `blockType` y dónde se mapea a React.
- [ ] Sé que el storefront **no** toca Postgres.
- [ ] Sé por qué el seed existe (reproducibilidad) frente a un dump.
- [ ] Sé qué env vars son secretos y cuáles son URLs públicas.
