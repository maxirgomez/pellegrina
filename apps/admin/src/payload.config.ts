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
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  cors: [storefrontOrigin],
  csrf: [storefrontOrigin],
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  // ponytail: sharp typings drift vs Payload SharpDependency across versions
  sharp: sharp as any,
})

