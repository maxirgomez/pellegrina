import { captchaPassed } from '@/lib/recaptchaScore'

type GoogleVerify = {
  success: boolean
  score?: number
  action?: string
  'error-codes'?: string[]
}

const DEFAULT_MIN = 0.5

export type RecaptchaResult =
  | { ok: true; skipped?: boolean; score?: number }
  | { ok: false; error: string; score?: number; codes?: string[] }

/** Server-side reCAPTCHA v3 verify. Skips when secret unset (local). */
export async function verifyRecaptchaToken(
  token: string | undefined,
  expectedAction = 'ticket_form',
): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  // ponytail: sin secret en local el form sigue; en prod setear RECAPTCHA_SECRET_KEY
  if (!secret) return { ok: true, skipped: true }

  const trimmed = typeof token === 'string' ? token.trim() : ''
  if (!trimmed) return { ok: false, error: 'missing_token' }

  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE || DEFAULT_MIN) || DEFAULT_MIN
  const params = new URLSearchParams({ secret, response: trimmed })

  const googleRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  if (!googleRes.ok) return { ok: false, error: 'verify_upstream' }

  const data = (await googleRes.json()) as GoogleVerify
  const score = typeof data.score === 'number' ? data.score : 0
  const actionOk = !data.action || data.action === expectedAction
  const ok = captchaPassed(Boolean(data.success), score, minScore) && actionOk

  if (!ok) {
    return { ok: false, error: 'low_score', score, codes: data['error-codes'] }
  }

  return { ok: true, score }
}
