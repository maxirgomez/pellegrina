import { NextResponse } from 'next/server'
import { Resend } from 'resend'

import { buildTicketMessage, buildTicketSubject, type TicketPayload } from '@/lib/ticketEmail'
import { verifyRecaptchaToken } from '@/lib/verifyRecaptcha'

const ACTION = 'ticket_form'

function str(v: unknown, max = 500): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_EMAIL_FROM
  const to = process.env.CONTACT_EMAIL_TO

  if (!apiKey || !from || !to) {
    return NextResponse.json(
      { ok: false, error: 'email_not_configured' },
      { status: 503 },
    )
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  const captcha = await verifyRecaptchaToken(str(body.captchaToken, 4000), ACTION)
  if (!captcha.ok) {
    return NextResponse.json(
      { ok: false, error: captcha.error },
      { status: captcha.error === 'missing_token' ? 400 : 403 },
    )
  }

  const payload: TicketPayload = {
    nombre: str(body.nombre, 120),
    destino: str(body.destino, 200),
    fechas: str(body.fechas, 200) || undefined,
    quienes: str(body.quienes, 200) || undefined,
    pref: str(body.pref, 40) || 'WhatsApp',
    email: str(body.email, 200) || undefined,
    extra: str(body.extra, 4000) || undefined,
  }

  if (!payload.nombre) {
    return NextResponse.json({ ok: false, error: 'missing_nombre' }, { status: 400 })
  }
  if (!payload.destino) {
    return NextResponse.json({ ok: false, error: 'missing_destino' }, { status: 400 })
  }
  if (payload.pref === 'email' && !payload.email) {
    return NextResponse.json({ ok: false, error: 'missing_email' }, { status: 400 })
  }

  const text = buildTicketMessage(payload)
  const subject = buildTicketSubject(payload)

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    text,
    ...(payload.email ? { replyTo: payload.email } : {}),
  })

  if (error) {
    console.error('Resend error:', error)
    return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, message: text, subject })
}
