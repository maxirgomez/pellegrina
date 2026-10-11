import config from '@payload-config'
import { getPayload } from 'payload'

/** Diagnostic: surfaces Payload init errors without leaking secrets. */
export async function GET() {
  const push = true
  try {
    const payload = await getPayload({ config })
    const pages = await payload.find({ collection: 'pages', limit: 1 })
    return Response.json({
      ok: true,
      pages: pages.totalDocs,
      db: 'connected',
      push,
      pool: 'session',
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const cause =
      err instanceof Error && err.cause instanceof Error
        ? err.cause.message
        : err instanceof Error && err.cause
          ? String(err.cause)
          : undefined
    const safe = [message, cause]
      .filter(Boolean)
      .join(' | ')
      .replace(/postgresql:\/\/[^@]+@/gi, 'postgresql://***@')
      .replace(/password[^,\s]*/gi, 'password=***')
    console.error('[health]', message, cause)
    return Response.json({ ok: false, error: safe, push }, { status: 500 })
  }
}
