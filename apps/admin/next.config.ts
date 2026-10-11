import { config as loadEnv } from 'dotenv'
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

// Load monorepo root .env for local `pnpm dev`
loadEnv({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.env') })

const nextConfig: NextConfig = {
  // Docker/self-host uses standalone; Vercel breaks with it
  ...(process.env.VERCEL ? {} : { output: 'standalone' as const }),
  poweredByHeader: false,
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }],
  },

  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
