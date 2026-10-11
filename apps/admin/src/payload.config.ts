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

/** Prefer cloud URLs; append Supabase transaction-pooler flags Drizzle/pg need. */
function resolveDatabaseUri(): string {
  let uri =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URI ||
    ''
  if (!uri) return ''

  const isSupabasePooler = /pooler\.supabase\.com|:6543\b/.test(uri)
  if (!isSupabasePooler) return uri

  const join = (u: string) => (u.includes('?') ? '&' : '?')
  if (!/[?&]sslmode=/.test(uri)) uri += `${join(uri)}sslmode=require`
  if (!/[?&]pgbouncer=/.test(uri)) uri += `${join(uri)}pgbouncer=true`
  // node-pg: disable prepared statements (unsupported in transaction pooler)
  if (!/[?&]prepareThreshold=/.test(uri)) uri += `${join(uri)}prepareThreshold=0`
  return uri
}

const databaseUri = resolveDatabaseUri()
const usingSupabasePooler = /pooler\.supabase\.com|:6543\b/.test(databaseUri)

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
    },
    // ponytail: empty Supabase needs one push/seed; set PAYLOAD_DATABASE_PUSH=true once, then off
    push: process.env.PAYLOAD_DATABASE_PUSH === 'true',
    // Transaction pooler (Supavisor :6543) is unreliable with Payload txs
    ...(usingSupabasePooler ? { transactionOptions: false as const } : {}),
  }),
  cors: [storefrontOrigin],
  csrf: [storefrontOrigin],
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  // ponytail: sharp typings drift vs Payload SharpDependency across versions
  sharp: sharp as any,
})

