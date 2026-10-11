import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const storefrontOrigin = process.env.STOREFRONT_URL || 'http://localhost:3000'

/**
 * Supabase on Vercel: keep transaction pooler (:6543). Session (:5432) caps at ~15
 * clients and returns EMAXCONNSESSION under serverless. DDL uses session only while
 * PAYLOAD_MIGRATING=true (build-time `payload migrate`).
 */
function resolveDatabaseUri(): string {
  let uri =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URI ||
    ''
  if (!uri) return uri

  const isSupabase = /supabase\.com|:6543\b/.test(uri)
  if (!isSupabase) return uri

  const migrating = process.env.PAYLOAD_MIGRATING === 'true'
  const join = (u: string) => (u.includes('?') ? '&' : '?')

  if (migrating && /:6543\b/.test(uri)) {
    // Session mode for DDL / migrate only
    uri = uri.replace(/:6543\b/, ':5432')
    uri = uri
      .replace(/[?&]pgbouncer=true/gi, '')
      .replace(/[?&]prepareThreshold=\d+/gi, '')
      .replace(/\?&/, '?')
      .replace(/[?&]$/, '')
  } else if (/pooler\.supabase\.com|:6543\b/.test(uri)) {
    // Transaction pooler flags for node-pg / Drizzle
    if (!/[?&]pgbouncer=/.test(uri)) uri += `${join(uri)}pgbouncer=true`
    if (!/[?&]prepareThreshold=/.test(uri)) uri += `${join(uri)}prepareThreshold=0`
  }

  if (/[?&]sslmode=/.test(uri)) {
    uri = uri.replace(/([?&]sslmode=)[^&]*/i, '$1no-verify')
  } else {
    uri += `${join(uri)}sslmode=no-verify`
  }
  return uri
}

const databaseUri = resolveDatabaseUri()
const isSupabaseDb = /supabase\.com|:6543\b/.test(databaseUri)
const serverURL = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001'
const trustedOrigins = [storefrontOrigin, serverURL].filter(
  (v, i, a) => Boolean(v) && a.indexOf(v) === i,
)

export default buildConfig({
  admin: {
    user: Users.slug,
    // Brand is warm/light; lock theme so OS dark mode doesn't take over
    theme: 'light',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · Pellegrina',
      description: 'Panel de administración — Pellegrina Viajes',
    },
    components: {
      graphics: {
        Logo: '/components/graphics/Logo',
        Icon: '/components/graphics/Icon',
      },
    },
  },
  collections: [Users, Media, Pages],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: databaseUri,
      // Serverless: tiny pool — session mode dies at 15; transaction mode still benefits
      max: isSupabaseDb ? 3 : 10,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
      ...(isSupabaseDb ? { ssl: { rejectUnauthorized: false } } : {}),
    },
    push: false,
    // Schema already applied at build; skip migrate-on-every-cold-start (was burning session slots)
    // prodMigrations: migrations — re-enable only if you drop build-time `payload migrate`
    ...(isSupabaseDb ? { transactionOptions: false as const } : {}),
  }),
  cors: trustedOrigins,
  csrf: trustedOrigins,
  serverURL,
  // ponytail: sharp typings drift vs Payload SharpDependency across versions
  sharp: sharp as any,
})

