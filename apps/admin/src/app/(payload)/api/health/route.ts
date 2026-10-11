import config from '@payload-config'
import { getPayload } from 'payload'

/** Diagnostic: surfaces Payload init errors without leaking secrets. */
export async function GET() {
  try {
    const payload = await getPayload({ config })
    const pages = await payload.find({ collection: 'pages', limit: 1 })
    return Response.json({
      ok: true,
      pages: pages.totalDocs,
      db: 'connected',
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const safe = message
      .replace(/postgresql:\/\/[^@]+@/gi, 'postgresql://***@')
      .replace(/password[^,\s]*/gi, 'password=***')
    console.error('[health]', message)
    return Response.json({ ok: false, error: safe }, { status: 500 })
  }
}
