# Fase 1 — Landing con Payload CMS + Next.js

> **Cómo levantar el proyecto:** ver [SETUP.md](./SETUP.md).  
> Estructura: `apps/storefront` (Next 15) + `apps/admin` (Payload 3 + Postgres) + `packages/*`. Tooling: **pnpm workspaces** (sin Turbo).

**Duración estimada:** 2 semanas  
**Stack:** Next.js 15 (App Router) · Payload CMS 3.x · TypeScript · Tailwind CSS · Docker · Coolify/Hetzner  
**Skills que demostrás:** React, Next.js, TypeScript, Docker, CMS headless, Server Components, Tailwind

---


## Etapa 1.1 — Scaffold del monorepo y tooling (días 1-2)

**Objetivo:** Tener el proyecto arrancando en local con la estructura correcta desde el primer commit.

- [ ] Inicializar monorepo con la estructura definida:
  ```
  apps/
    storefront/     ← Next.js 15 (App Router)
    admin/          ← Payload CMS 3.x
  packages/
    core/           ← (vacío por ahora, se usa en Fase 2)
    infrastructure/ ← (vacío por ahora)
  ```
- [ ] Configurar `tsconfig` base con paths aliases compartidos
- [ ] Setup de ESLint + Prettier con config compartida
- [ ] Inicializar Git con `.gitignore`, conventional commits (opcional: commitlint)
- [ ] Elegir gestor de monorepo: `pnpm workspaces` (recomendado, zero cost) o Turborepo
- [ ] README mínimo con instrucciones de setup

**Entregable:** `pnpm dev` levanta storefront en :3000 y admin en :3001 (o el puerto que Payload use).

---

## Etapa 1.2 — Payload CMS: Collections y bloques editables (días 3-5)

**Objetivo:** El admin de Payload permite crear y editar páginas con bloques flexibles tipo ACF Flexible Content.

- [ ] Configurar Payload 3.x con MongoDB o PostgreSQL (elegir uno y documentar por qué)
- [ ] Crear collection `Pages` con campo `slug` único y campo `layout` de tipo `blocks`
- [ ] Definir bloques editables:
  - **Hero:** título (richText), subtítulo, CTA (texto + URL), imagen de fondo (upload)
  - **Features:** array de items (ícono, título, descripción)
  - **Pricing:** array de planes (nombre, precio, features list, CTA, flag "destacado")
  - **CTA Section:** título, descripción, botón (texto + URL), variante (primario/secundario)
  - **Testimonials:** array de testimonios (nombre, cargo, texto, avatar)
  - **FAQ:** array de preguntas/respuestas (acordeón)
- [ ] Crear collection `Media` para uploads (imágenes)
- [ ] Crear `Global` para settings del sitio: nombre, logo, links de redes, metadata SEO default
- [ ] Seedear una página "Home" con datos de ejemplo para no laburar con la UI vacía

**Entregable:** En `/admin` podés crear una página, agregar/reordenar bloques, subir imágenes, y el JSON sale limpio por la API.

---

## Etapa 1.3 — Frontend Next.js: renderizado de bloques (días 5-8)

**Objetivo:** El storefront renderiza dinámicamente los bloques que vienen de Payload.

- [ ] Configurar fetch a la API de Payload desde Server Components (RSC)
  - Local API (si Payload y Next corren en el mismo proceso) o REST/GraphQL
  - Decidir: ¿Payload embebido en Next.js o proceso separado? (documentar trade-off)
- [ ] Crear page `app/[[...slug]]/page.tsx` que resuelve la página por slug
- [ ] Crear componente `BlockRenderer` que mapea `block.blockType` → componente React
- [ ] Implementar componentes de cada bloque con Tailwind:
  - `HeroBlock` — responsive, imagen optimizada con `next/image`
  - `FeaturesBlock` — grid responsive (1-2-3 cols)
  - `PricingBlock` — cards con highlight en plan destacado
  - `CTABlock` — dos variantes visuales
  - `TestimonialsBlock` — carousel o grid
  - `FAQBlock` — acordeón con `<details>` nativo o estado local
- [ ] Metadata SEO dinámica: `generateMetadata()` desde los datos de Payload
- [ ] Tipografía y color system base con CSS variables en Tailwind config

**Entregable:** La landing se ve completa en el browser, con contenido real viniendo del CMS. Cambiar un título en `/admin` se refleja en el front.

---

## Etapa 1.4 — Dockerización del entorno de desarrollo (días 8-10)

**Objetivo:** Un solo `docker compose up` levanta todo el stack para desarrollo.

- [ ] `Dockerfile` para `apps/storefront` (multi-stage: deps → build → run)
- [ ] `Dockerfile` para `apps/admin` (Payload)
- [ ] `docker-compose.yml` con servicios:
  - `storefront` (Next.js, hot reload con volume mount)
  - `admin` (Payload, hot reload)
  - `db` (MongoDB o PostgreSQL)
  - `maildev` (opcional, para testing de emails)
- [ ] `.env.example` con todas las variables documentadas
- [ ] Verificar que hot reload funciona dentro de los containers
- [ ] Documentar en README: requisitos, setup, y cómo agregar un bloque nuevo

**Entregable:** Clonar repo → copiar `.env` → `docker compose up` → stack corriendo. Nada de "instalate Node 20, MongoDB, etc."

---

## Etapa 1.5 — Deploy a Hetzner con Coolify (días 10-12)

**Objetivo:** La landing está online en un dominio real, deployada automáticamente.

- [ ] Servidor Hetzner configurado con Coolify instalado
- [ ] Crear proyecto en Coolify con los servicios:
  - App Next.js (storefront)
  - App Payload (admin)
  - Base de datos (managed por Coolify)
- [ ] Configurar deploy automático desde branch `main` (push → build → deploy)
- [ ] Dominio con SSL (Let's Encrypt vía Coolify)
- [ ] Variables de entorno en Coolify (no hardcodeadas)
- [ ] Verificar que `/admin` no es accesible públicamente sin auth
- [ ] Healthcheck básico para cada servicio

**Entregable:** `https://tudominio.com` muestra la landing. Push a `main` → se redeploya solo.

---

## Etapa 1.6 — Polish y QA (días 12-14)

**Objetivo:** La landing está lista para mostrar como portfolio piece.

- [ ] Responsive check: mobile, tablet, desktop
- [ ] Performance: Lighthouse ≥ 90 en Performance y Accessibility
- [ ] Optimización de imágenes (formatos WebP/AVIF vía Payload o Next)
- [ ] `robots.txt` y `sitemap.xml` básicos
- [ ] Favicon y OG image
- [ ] Probar crear una segunda página desde el admin para validar que el sistema de bloques es realmente reutilizable
- [ ] Error handling: 404 custom, loading states

**Entregable:** Landing publicada, pulida, con buen score en Lighthouse, lista para linkear en CV/LinkedIn.

---

## Seguridad e infra enterprise-grade

Criterios transversales a todas las etapas. No es una etapa aparte — se aplican mientras construís.

### Secrets y variables de entorno

- [ ] `.env` y `.env.local` en `.gitignore` desde el primer commit
- [ ] `.env.example` con todas las keys vacías y comentarios que expliquen cada una
- [ ] `PAYLOAD_SECRET` generado con `openssl rand -hex 32` — nunca el default
- [ ] `DATABASE_URI` con credenciales solo en Coolify secrets (producción) y `.env.local` (desarrollo)
- [ ] Validación al arrancar: si falta una variable requerida, la app no levanta (fail fast). Payload ya lo hace parcialmente; en Next.js validar con un `env.ts` que parsee con Zod o chequeo manual
- [ ] Nunca hardcodear secrets en `docker-compose.yml`, `Dockerfile`, ni en código

### Docker hardening

- [ ] Correr containers como usuario no-root: `USER node` en el Dockerfile después del stage de build
- [ ] Multi-stage build: la imagen final no incluye `devDependencies`, archivos `.ts` fuente, ni herramientas de build
- [ ] Fijar versiones de base image con tag específico (`node:20.11-alpine`, nunca `node:latest`)
- [ ] `COPY package.json pnpm-lock.yaml` → `pnpm install` → `COPY . .` (en ese orden, para que el cache de layers funcione y no arrastre basura del host)
- [ ] No montar `node_modules` del host como volume en desarrollo — instalar dentro del container

### Headers de seguridad (Next.js)

- [ ] Configurar en `next.config.ts`:
  ```ts
  headers: [
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=()' },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  ]
  ```
- [ ] Desactivar `X-Powered-By` con `poweredByHeader: false`

### Payload admin: acceso restringido

- [ ] Auth de Payload protege `/admin` con login — verificar que no hay endpoints abiertos
- [ ] En producción: subdominio separado (`admin.tudominio.com`) o regla en Traefik/Coolify que restrinja `/admin` por IP
- [ ] Rate limiting en endpoint de login para prevenir brute force (`express-rate-limit` en Payload, que corre sobre Express)

### CORS y API

- [ ] Si Payload corre como proceso separado, configurar CORS para aceptar solo el dominio del storefront (nunca `origin: '*'` en producción)
- [ ] API endpoints de Payload: revisar qué collections están expuestas públicamente y cuáles requieren auth

### Base de datos

- [ ] Puerto de la DB no expuesto al host en producción (solo red interna de Docker)
- [ ] Usuario de DB dedicado con permisos solo sobre la base del proyecto, no superuser
- [ ] Backups diarios desde el día 1: Coolify tiene integración con S3-compatible (Hetzner Object Storage es barato)
- [ ] En `docker-compose.dev.yml` sí podés exponer el puerto para tooling local (pgAdmin, etc.)

### Dependencias

- [ ] Lockfile (`pnpm-lock.yaml`) siempre commiteado
- [ ] `pnpm audit` como paso en CI — falla en vulnerabilidades critical/high, warn en el resto
- [ ] Dependabot o Renovate (gratis en GitHub) configurado al menos para security patches
- [ ] Revisar licencias de dependencias antes de usar en producción (MIT/Apache OK, GPL cuidado)

### Lo que NO necesitás ahora pero dejás previsto

| Herramienta | Cuándo sumarlo | Por qué ahora no |
|---|---|---|
| Cloudflare / WAF | Cuando tengas clientes reales (Fase 3+) | Overkill para una landing sin tráfico |
| Logging centralizado (Loki + Grafana) | Fase 3-4, multi-tenant | Logs de Docker Compose alcanzan por ahora |
| Secrets manager (Vault, etc.) | Si manejás secrets de terceros a escala | Coolify env vars es suficiente para tu volumen |
| Monitoreo de uptime | Post-launch con clientes | Un healthcheck en Coolify cubre lo básico |

---

## Decisiones a tomar antes de arrancar

| Decisión | Opciones | Impacto |
|---|---|---|
| DB para Payload | MongoDB vs PostgreSQL | PG es más familiar en el ecosistema Next.js, pero Mongo es el default de Payload |
| Payload embebido o separado | Mismo proceso Next.js vs proceso aparte | Embebido simplifica infra pero acopla; separado escala mejor |
| Monorepo tooling | pnpm workspaces solo vs + Turborepo | Turbo agrega cache y pipelines, pero suma complejidad |
| Gestión de contenido seed | Script de seed vs dump de DB | Seed reproducible es mejor para desarrollo |

---

## Checklist de skills demostradas al terminar Fase 1

- ✅ React + Next.js 15 (App Router, RSC, generateMetadata)
- ✅ TypeScript end-to-end
- ✅ Tailwind CSS (responsive, design system)
- ✅ Headless CMS (Payload 3.x, content modeling, bloques flexibles)
- ✅ Docker + Docker Compose
- ✅ Deploy y CI/CD básico (Coolify)
- ✅ Monorepo structure
- ✅ Security hardening (headers, CORS, secrets management, non-root containers)
- ✅ Infrastructure as code (Docker multi-stage, Coolify secrets, backups)