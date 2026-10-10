/** Client helpers for Google reCAPTCHA v3 (no npm deps). */

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
const SCRIPT_ID = 'grecaptcha-v3'

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, opts: { action: string }) => Promise<string>
    }
  }
}

export function isRecaptchaConfigured(): boolean {
  return Boolean(SITE_KEY)
}

export function loadRecaptchaScript(): Promise<void> {
  if (!SITE_KEY || typeof window === 'undefined') return Promise.resolve()
  if (window.grecaptcha) return Promise.resolve()

  const existing = document.getElementById(SCRIPT_ID)
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('reCAPTCHA script failed')), {
        once: true,
      })
    })
  }

  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.id = SCRIPT_ID
    s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('No se pudo cargar reCAPTCHA'))
    document.head.appendChild(s)
  })
}

export async function getRecaptchaToken(action = 'ticket_form'): Promise<string | null> {
  if (!SITE_KEY) return null
  await loadRecaptchaScript()
  const g = window.grecaptcha
  if (!g) throw new Error('reCAPTCHA no disponible')
  await new Promise<void>((resolve) => g.ready(() => resolve()))
  return g.execute(SITE_KEY, { action })
}
