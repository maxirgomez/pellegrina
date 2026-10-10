'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'

import { buildWaLink } from '@/lib/pellegrinaWa'
import { getRecaptchaToken, isRecaptchaConfigured, loadRecaptchaScript } from '@/lib/recaptcha'

const CAPTCHA_ACTION = 'ticket_form'

type Props = {
  whatsappNumber?: string | null
  contactEmail?: string | null
  enabled?: boolean | null
}

export function DestinationTicketForm({ whatsappNumber, contactEmail, enabled }: Props) {
  const [showMail, setShowMail] = useState(false)
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [destinoLabel, setDestinoLabel] = useState('')
  const torn = useRef(false)
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (isRecaptchaConfigured()) void loadRecaptchaScript().catch(() => {})
  }, [])

  if (enabled === false) return null

  const reveal = () => {
    setReady(true)
    document.getElementById('stub')?.setAttribute('hidden', '')
    const conf = document.getElementById('confirm')
    conf?.removeAttribute('hidden')
    if (!reduce && conf) {
      conf.classList.remove('thump')
      void conf.getBoundingClientRect()
      conf.classList.add('thump')
    }
    document.getElementById('ready')?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'nearest',
    })
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (busy) return
    const fd = new FormData(e.currentTarget)
    const nombre = String(fd.get('nombre') || '').trim()
    const destino = String(fd.get('destino') || '').trim()
    const fechas = String(fd.get('fechas') || '').trim()
    const quienes = String(fd.get('quienes') || '').trim()
    const pref = String(fd.get('pref') || 'WhatsApp')
    const email = String(fd.get('email') || '').trim()
    const extra = String(fd.get('msg') || '').trim()

    if (!nombre) {
      setErr('Contame tu nombre así sé cómo llamarte.')
      return
    }
    if (!destino) {
      setErr('Poné un destino, aunque sea "todavía no sé".')
      return
    }
    if (pref === 'email' && !/^\S+@\S+\.\S+$/.test(email)) {
      setErr('Revisá tu email: falta o tiene un error.')
      return
    }

    setBusy(true)
    setErr('')
    try {
      let captchaToken = ''
      if (isRecaptchaConfigured()) {
        captchaToken = (await getRecaptchaToken(CAPTCHA_ACTION)) || ''
        if (!captchaToken) {
          setErr('No pudimos verificar que sos humano. Probá de nuevo.')
          return
        }
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          destino,
          fechas,
          quienes,
          pref,
          email,
          extra,
          captchaToken,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; error?: string }

      if (!res.ok || !data.ok) {
        if (data.error === 'email_not_configured') {
          setErr('El envío por mail todavía no está configurado. Avisale a Jaz por WhatsApp.')
        } else if (data.error === 'low_score' || data.error === 'missing_token') {
          setErr('La verificación anti-bots falló. Probá de nuevo en un momento.')
        } else {
          setErr('No pudimos enviar tu pasaje. Probá de nuevo en un momento.')
        }
        return
      }

      const out = data.message || ''
      setMsg(out)
      setDestinoLabel(destino)

      if (torn.current) {
        reveal()
        return
      }
      torn.current = true
      const stub = document.getElementById('stub')
      if (reduce || !stub) {
        reveal()
        return
      }
      stub.classList.add('tear')
      setTimeout(reveal, 720)
    } catch {
      setErr('No pudimos enviar el formulario. Revisá tu conexión e intentá de nuevo.')
    } finally {
      setBusy(false)
    }
  }

  const waHref = buildWaLink(whatsappNumber, null, msg)
  const mailHref =
    contactEmail && msg
      ? `mailto:${contactEmail}?subject=${encodeURIComponent(`Mi próximo viaje: ${destinoLabel}`)}&body=${encodeURIComponent(msg)}`
      : '#'

  return (
    <form className="ticket" id="form" noValidate onSubmit={onSubmit}>
      <div className="ticket-main">
        <div className="confirm" id="confirm" hidden aria-hidden="true">
          <div>
            PASAJE<b>confirmado</b>PELLEGRINA
          </div>
        </div>
        <div className="ticket-head">
          <span className="t1">PASAJE · PELLEGRINA</span>
          <span className="t2">Clase: a tu medida</span>
        </div>
        <div className="field">
          <label htmlFor="f-nombre">NOMBRE DEL PASAJERO/A</label>
          <input id="f-nombre" name="nombre" autoComplete="given-name" placeholder="¿Cómo te llamás?" required />
        </div>
        <div className="field">
          <label htmlFor="f-destino">DESTINO SOÑADO</label>
          <input id="f-destino" name="destino" placeholder="Ej: Bariloche, Italia, todavía no sé…" required />
        </div>
        <div className="row2">
          <div className="field">
            <label htmlFor="f-fechas">FECHAS TENTATIVAS</label>
            <input id="f-fechas" name="fechas" placeholder="Ej: marzo, 10 días" />
          </div>
          <div className="field">
            <label htmlFor="f-quienes">¿QUIÉNES VIAJAN?</label>
            <input id="f-quienes" name="quienes" placeholder="Ej: en pareja, 2 adultos y 1 niño" />
          </div>
        </div>
        <fieldset className="field">
          <legend>¿CÓMO PREFERÍS QUE TE CONTACTE?</legend>
          <div className="pref">
            <label>
              <input
                type="radio"
                name="pref"
                id="p-wa"
                value="WhatsApp"
                defaultChecked
                onChange={() => setShowMail(false)}
              />
              <span>WhatsApp</span>
            </label>
            <label>
              <input
                type="radio"
                name="pref"
                id="p-mail"
                value="email"
                onChange={() => setShowMail(true)}
              />
              <span>Email</span>
            </label>
            <label>
              <input type="radio" name="pref" id="p-cafe" value="un café" onChange={() => setShowMail(false)} />
              <span>Un café</span>
            </label>
          </div>
        </fieldset>
        <div className="field" id="mailField" hidden={!showMail}>
          <label htmlFor="f-email">TU EMAIL</label>
          <input id="f-email" name="email" type="email" autoComplete="email" placeholder="tu@email.com" />
        </div>
        <div className="field">
          <label htmlFor="f-msg">ALGO MÁS QUE QUIERAS CONTARME</label>
          <textarea id="f-msg" name="msg" placeholder="Lo que tengas ganas: qué te imaginás, qué no querés, presupuesto…" />
        </div>
        <p className="err" id="err" role="alert">
          {err}
        </p>
        {isRecaptchaConfigured() ? (
          <p className="recaptcha-note">
            Este sitio está protegido por reCAPTCHA y aplican la{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Política de Privacidad
            </a>{' '}
            y los{' '}
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
              Términos de Servicio
            </a>{' '}
            de Google.
          </p>
        ) : null}
        <div className="ready" id="ready" hidden={!ready}>
          <b>¡Listo! Ya le llegó tu mensaje a Jaz.</b>
          <pre id="readyText">{msg}</pre>
          <div className="acts">
            <a className="btn btn-wa" id="sendWa" href={waHref} target="_blank" rel="noopener noreferrer">
              También por WhatsApp
            </a>
            <a className="btn btn-line" id="sendMail" href={mailHref}>
              Abrir en tu mail
            </a>
          </div>
          <div className="acts">
            <button
              type="button"
              className="linkbtn"
              id="copyMsg"
              onClick={() => {
                const ok = () => {
                  const btn = document.getElementById('copyMsg')
                  if (btn) btn.textContent = 'Copiado'
                  setTimeout(() => {
                    if (btn) btn.textContent = 'Copiar mensaje'
                  }, 2000)
                }
                if (navigator.clipboard) navigator.clipboard.writeText(msg).then(ok)
              }}
            >
              Copiar mensaje
            </button>
            <button type="submit" className="linkbtn">
              Actualizar con mis cambios
            </button>
          </div>
        </div>
      </div>
      <div className="ticket-stub" id="stub">
        <div className="stub-info">
          <span>
            EMBARQUE<b>cuando quieras</b>
          </span>
          <span>
            PUERTA<b>tu WhatsApp</b>
          </span>
        </div>
        <button className="btn btn-wa" type="submit" disabled={busy}>
          {busy ? 'Enviando…' : 'Preparar mi pasaje'}
        </button>
      </div>
    </form>
  )
}
