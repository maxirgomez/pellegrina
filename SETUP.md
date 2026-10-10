# Setup — Tierra Noble (Fase 1.1–1.4)

Monorepo **pnpm workspaces** (sin Turborepo): `apps/storefront`, `apps/admin`, `packages/*`.

## Requisitos

- Node.js ≥ 20.9 (recomendado 20 LTS en Docker; local puede ser 20–26)
- [pnpm](https://pnpm.io) ≥ 9 (`npm i -g pnpm` o Corepack)
- Docker Desktop (opcional, recomendado para Postgres)
- Generar secreto: `openssl rand -hex 32`

## 1. Variables de entorno

```powershell
Copy-Item .env.example .env
# Editá .env: PAYLOAD_SECRET, SEED_ADMIN_*, DATABASE_URI
```

Ver todas las keys documentadas en `.env.example`.

## 2. Opción A — Docker Compose (dev)

```powershell
# Solo DB (si corrés apps con pnpm local):
docker compose up -d db

# Stack completo (db + admin :3001 + storefront :3000):
docker compose up --build

# Maildev opcional:
docker compose --profile mail up -d maildev
```

Hot reload: los Dockerfiles usan target `dev` y montan el código fuente. **No** se monta `node_modules` del host.

## 3. Opción B — Local con pnpm + Postgres en Docker

```powershell
docker compose up -d db
pnpm install
pnpm --filter @tn/admin seed
pnpm dev
```

- Storefront: http://localhost:3000  
- Admin: http://localhost:3001/admin  

Scripts útiles:

| Script | Qué hace |
|---|---|
| `pnpm dev` | storefront + admin en paralelo |
| `pnpm dev:storefront` | solo :3000 |
| `pnpm dev:admin` | solo :3001 |
| `pnpm seed` | Home page + usuario admin |
| `pnpm build` / `pnpm lint` | build / lint del workspace |

## 4. Seed

Con Postgres arriba y `.env` cargado:

```powershell
pnpm seed
```

Crea (o actualiza):

- Usuario admin: `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` (defaults en `.env.example`)
- Global `site-settings`
- Página `home` con bloques hero, features, pricing, testimonials, faq, cta

## 5. Tutor

Guía detallada de la fase: `docs/TUTOR-FASE1.md` (stub / en progreso). Checklist de etapas: `readme.md`.

## TLS / npm en esta máquina

Si `npm`/`pnpm` fallan con `UNABLE_TO_VERIFY_LEAF_SIGNATURE`:

```powershell
$env:NODE_OPTIONS="--use-system-ca"
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"   # solo si system-ca no alcanza
# o en .npmrc del repo: strict-ssl=false
```

Si `pnpm install` se cuelga en el linkeo (Windows/Desktop), usar `cmd` + `node-linker=hoisted` (ya en `.npmrc`) y:

```cmd
pnpm install --config.strict-ssl=false --ignore-scripts
pnpm rebuild sharp
```

## Postgres ports

`docker compose` expone la DB en **host `5434`** (porque 5432/5433 suelen estar ocupados). Ajustá `DATABASE_URI` en `.env` si cambiás el mapping.
