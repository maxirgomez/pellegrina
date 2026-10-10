import { z } from 'zod'

const schema = z.object({
  PAYLOAD_URL: z.string().url('PAYLOAD_URL must be a valid URL'),
  NEXT_PUBLIC_PAYLOAD_URL: z.string().url().optional(),
})

export type StorefrontEnv = z.infer<typeof schema>

/** Fail-fast env validation for server components / build */
export function getEnv(): StorefrontEnv {
  const parsed = schema.safeParse({
    PAYLOAD_URL: process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL,
    NEXT_PUBLIC_PAYLOAD_URL: process.env.NEXT_PUBLIC_PAYLOAD_URL,
  })

  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
    throw new Error(`Invalid storefront env: ${msg}`)
  }

  return {
    ...parsed.data,
    PAYLOAD_URL: parsed.data.PAYLOAD_URL,
    NEXT_PUBLIC_PAYLOAD_URL: parsed.data.NEXT_PUBLIC_PAYLOAD_URL || parsed.data.PAYLOAD_URL,
  }
}

export function getPayloadBaseUrl(): string {
  return getEnv().PAYLOAD_URL.replace(/\/$/, '')
}
