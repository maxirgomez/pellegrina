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
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const storefrontOrigin = process.env.STOREFRONT_URL || 'http://localhost:3000'

/**
 * Prefer cloud URLs. Supabase transaction pooler (:6543) cannot run DDL / drizzle push,
 * so rewrite to session mode (:5432) on the same pooler host (works from Vercel IPv4).
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

  // Transaction → Session pooler (DDL + Payload txs need session)
  if (/:6543\b/.test(uri)) {
    uri = uri.replace(/:6543\b/, ':5432')
    uri = uri
      .replace(/[?&]pgbouncer=true/gi, '')
      .replace(/[?&]prepareThreshold=\d+/gi, '')
      .replace(/\?&/, '?')
      .replace(/[?&]$/, '')
  }

  const join = (u: string) => (u.includes('?') ? '&' : '?')
  // Vercel Node rejects Supabase chain with sslmode=require → use no-verify
  if (/[?&]sslmode=/.test(uri)) {
    uri = uri.replace(/([?&]sslmode=)[^&]*/i, '$1no-verify')
  } else {
    uri += `${join(uri)}sslmode=no-verify`
  }
  return uri
}

const databaseUri = resolveDatabaseUri()
const isSupabaseDb = /supabase\.com|:6543\b/.test(databaseUri)

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
      // Supabase pooler presents a chain Node rejects on Vercel without this
      ...(isSupabaseDb ? { ssl: { rejectUnauthorized: false } } : {}),
    },
    // push only runs when NODE_ENV!==production; prod uses migrations on connect
    push: false,
    prodMigrations: migrations,
  }),
  cors: [storefrontOrigin],
  csrf: [storefrontOrigin],
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  // ponytail: sharp typings drift vs Payload SharpDependency across versions
  sharp: sharp as any,
})

