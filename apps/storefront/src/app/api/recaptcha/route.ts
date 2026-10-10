import { NextResponse } from 'next/server'

import { verifyRecaptchaToken } from '@/lib/verifyRecaptcha'

export async function POST(req: Request) {
  let body: { token?: string; action?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  const result = await verifyRecaptchaToken(body.token, body.action || 'ticket_form')
  if (!result.ok) {
    const status = result.error === 'missing_token' ? 400 : result.error === 'verify_upstream' ? 502 : 403
    return NextResponse.json(
      { ok: false, error: result.error, score: result.score, codes: result.codes },
      { status },
    )
  }

  return NextResponse.json({ ok: true, skipped: result.skipped, score: result.score })
}
