import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * One-shot: upsert Pellegrina home layout on empty prod.
 * Auth: header x-seed-secret === PAYLOAD_SECRET
 */
export async function POST(req: Request) {
  const secret = req.headers.get('x-seed-secret')
  if (!secret || secret !== process.env.PAYLOAD_SECRET) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  try {
    const { seedHomeContent } = await import('../../../../seed/index')
    const payload = await getPayload({ config })
    const result = await seedHomeContent(payload)
    return Response.json({ ok: true, ...result })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[bootstrap-home]', message)
    return Response.json({ ok: false, error: message }, { status: 500 })
  }
}
