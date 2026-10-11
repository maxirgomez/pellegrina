import { getPayloadBaseUrl } from '@/env'

/** Diagnostic: Payload URL + whether home resolves (no secrets). */
export async function GET() {
  let base: string
  try {
    base = getPayloadBaseUrl()
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }

  const host = (() => {
    try {
      return new URL(base).host
    } catch {
      return 'invalid'
    }
  })()

  const candidates = ['home', '/']
  const results: Record<string, number | string> = {}
  for (const slug of candidates) {
    try {
      const res = await fetch(
        `${base}/api/pages?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`,
        { cache: 'no-store' },
      )
      if (!res.ok) {
        results[slug] = `http_${res.status}`
        continue
      }
      const data = (await res.json()) as { totalDocs?: number }
      results[slug] = data.totalDocs ?? 0
    } catch (err) {
      results[slug] = err instanceof Error ? err.message : 'fetch_failed'
    }
  }

  return Response.json({
    ok: true,
    payloadHost: host,
    pages: results,
  })
}
