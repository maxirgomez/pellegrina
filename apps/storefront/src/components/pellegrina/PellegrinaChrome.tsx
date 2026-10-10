'use client'

import type { PellegrinaSiteContact } from '@tn/core'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { buildWaLink } from '@/lib/pellegrinaWa'

import { usePellegrinaFlight } from './usePellegrinaFlight'

type Props = PellegrinaSiteContact & {
  logoUrl?: string | null
  children: React.ReactNode
  showBagbar?: boolean
}

export function PellegrinaChrome({
  siteName,
  whatsappNumber,
  whatsappDefaultMessage,
  contactEmail: _contactEmail,
  instagramUrl,
  logoUrl,
  children,
  showBagbar = false,
}: Props) {
  const mainRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const fabRef = useRef<HTMLAnchorElement>(null)
  const [stageNum, setStageNum] = useState('1/1')
  const [stageName, setStageName] = useState('Despegue')
  const { flightRef, fBaseRef, fRevealRef, fMaskRef, pinsRef, planeRef, drawFlight, state } =
    usePellegrinaFlight(mainRef)

  const waHref = buildWaLink(whatsappNumber, whatsappDefaultMessage)

  useEffect(() => {
    document.querySelectorAll<HTMLAnchorElement>('.js-wa').forEach((a) => {
      const msg = a.dataset.msg
      a.href = buildWaLink(whatsappNumber, whatsappDefaultMessage, msg)
    })
  }, [whatsappNumber, whatsappDefaultMessage])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fab = fabRef.current
    if (reduce || !fab) return
    let t: ReturnType<typeof setTimeout>
    const arm = () => {
      clearTimeout(t)
      t = setTimeout(() => fab.classList.add('pulse'), 25000)
    }
    const onAct = () => {
      if (!fab.classList.contains('pulse')) arm()
    }
    ;['pointerdown', 'keydown'].forEach((ev) =>
      window.addEventListener(ev, onAct, { passive: true }),
    )
    arm()
    return () => {
      clearTimeout(t)
      ;['pointerdown', 'keydown'].forEach((ev) => window.removeEventListener(ev, onAct))
    }
  }, [])

  const globeRef = useRef({ s: 0, px: 0, py: 0 })

  const applyGlobe = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const globe = document.getElementById('heroGlobe') as HTMLElement | null
    if (!globe) return
    const G = globeRef.current
    globe.style.transform = `translate3d(${G.px}px, ${G.s * 0.25 + G.py}px, 0) rotate(${G.s * 0.03}deg)`
  }, [])

  const onScroll = useCallback(() => {
    const y = window.scrollY
    const max = document.documentElement.scrollHeight - window.innerHeight
    const p = max > 0 ? y / max : 0
    navRef.current?.classList.toggle('scrolled', y > 8)
    fabRef.current?.classList.toggle('open', y > 500 && p < 0.9)

    const F = state.current
    const stages = mainRef.current?.querySelectorAll('[data-stage]')
    if (stages?.length) {
      let idx = 0
      F.tops.forEach((t, i) => {
        if (t < y + window.innerHeight * 0.45) idx = i
      })
      const el = stages[idx] as HTMLElement
      setStageName(el.dataset.stage || '')
      setStageNum(`${idx + 1}/${stages.length}`)
    }
    if (y < 1400) {
      globeRef.current.s = y
      applyGlobe()
    }
    drawFlight(y)
  }, [applyGlobe, drawFlight, state])

  useEffect(() => {
    let ticking = false
    const handler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          onScroll()
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', handler)
  }, [onScroll])

  // Hero globe parallax on pointer (maqueta)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer:fine)').matches
    if (reduce || !fine) return
    const hero = document.querySelector('.hero')
    if (!hero) return
    const onMove = (e: Event) => {
      const pe = e as PointerEvent
      globeRef.current.px = (pe.clientX / window.innerWidth - 0.5) * 24
      globeRef.current.py = (pe.clientY / window.innerHeight - 0.5) * 18
      applyGlobe()
    }
    hero.addEventListener('pointermove', onMove)
    return () => hero.removeEventListener('pointermove', onMove)
  }, [applyGlobe])

  const brandLabel = siteName || 'Pellegrina Viajes'
  const brandParts = brandLabel.toUpperCase().includes('PELLEGRINA')
    ? { main: 'PELLEGRINA', sub: 'VIAJES' }
    : { main: brandLabel.toUpperCase(), sub: '' }

  return (
    <>
      <header className="nav" id="nav" ref={navRef}>
        <div className="wrap nav-in">
          <Link className="brand" href="#despegue" aria-label={`${brandLabel}, inicio`}>
            {logoUrl ? (
              <img src={logoUrl} alt="" width={44} height={44} />
            ) : (
              <span
                className="inline-flex size-11 items-center justify-center rounded-full bg-(--agua-soft) text-sm font-bold"
                aria-hidden
              >
                P
              </span>
            )}
            <span>
              <b>{brandParts.main}</b>
              {brandParts.sub ? <small>{brandParts.sub}</small> : null}
            </span>
          </Link>
          <div className="stage" aria-live="polite">
            <em id="stageNum">{stageNum}</em>
            <span id="stageName">{stageName}</span>
          </div>
          <a className="btn btn-wa js-wa" href={waHref} target="_blank" rel="noopener noreferrer">
            Escribime
          </a>
        </div>
      </header>

      <main id="main" ref={mainRef}>
        <svg id="flight" aria-hidden="true" ref={flightRef}>
          <defs>
            <mask id="flightMask" maskUnits="userSpaceOnUse" ref={fMaskRef}>
              <path
                id="flightReveal"
                ref={fRevealRef}
                fill="none"
                stroke="#fff"
                strokeWidth={8}
                pathLength={1000}
                strokeDasharray="1000 1000"
                strokeDashoffset={1000}
              />
            </mask>
          </defs>
          <path className="base" id="flightBase" ref={fBaseRef} />
          <path className="done" id="flightDone" mask="url(#flightMask)" />
          <g id="flightPins" ref={pinsRef} />
          <g id="plane" className="plane" ref={planeRef}>
            <path
              transform="translate(-12,-12)"
              d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"
            />
          </g>
        </svg>
        {children}
      </main>

      <footer>
        <div className="wrap foot">
          <Link className="brand" href="#despegue">
            {logoUrl ? (
              <img src={logoUrl} alt="" width={44} height={44} loading="lazy" />
            ) : null}
            <span>
              <b>{brandParts.main}</b>
              {brandParts.sub ? <small>{brandParts.sub}</small> : null}
            </span>
          </Link>
          <nav aria-label="Redes y contacto">
            {instagramUrl ? (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            ) : null}
            <a className="js-wa" href={waHref} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </nav>
          <span>Viajes a tu medida, desde Argentina.</span>
        </div>
      </footer>

      {showBagbar ? (
        <div className="bagbar" id="bagbar" aria-hidden="true">
          <svg viewBox="0 0 84 84" id="miniCase">
            <path
              d="M30 22v-8a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v8"
              fill="none"
              stroke="#1d1a17"
              strokeWidth={5}
            />
            <rect x={10} y={22} width={64} height={52} rx={10} fill="#a9d6e1" stroke="#1d1a17" strokeWidth={5} />
          </svg>
          <div className="bb-t">
            <div className="bb-n">
              <span id="bbDone">0</span>
              <small>
                {' '}
                de <span id="bbTotal">0</span> en la valija
              </small>
            </div>
            <div className="bb-bar">
              <i id="bbFill" />
            </div>
          </div>
        </div>
      ) : null}

      <a
        className="fab js-wa"
        id="fab"
        ref={fabRef}
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribime por WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" />
        </svg>
        <span className="lbl">¿Charlamos?</span>
      </a>
    </>
  )
}
