import { config as loadEnv } from 'dotenv'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

loadEnv({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.env') })

const payloadUrl = process.env.PPAYLOAD_URL || process.env.PAYLOAD_URL || ''

let payloadHostname = 'localhost'
try {
  if (payloadUrl) payloadHostname = new URL(payloadUrl).hostname
} catch {
  // ponytail: invalid URL falls back to localhost for next/image
}

const nextConfig: NextConfig = {
  ...(process.env.VERCEL ? {} : { output: 'standalone' as const }),
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: payloadHostname,
        pathname: '/api/media/**',
      },
      {
        protocol: 'https',
        hostname: payloadHostname,
        pathname: '/api/media/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains',
          },
        ],
      },
    ]
  },
}

export default nextConfig
