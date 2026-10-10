'use client'

import type { GuidePage } from '@tn/core'
import { useCallback, useEffect, useRef, useState } from 'react'

import { RichText } from '@/components/RichText'

type Props = {
  pages: GuidePage[]
  siteLabel?: string
}

export function GuidesBook({ pages, siteLabel = 'Pellegrina Viajes' }: Props) {
  const bookRef = useRef<HTMLDivElement>(null)
  const [cur, setCur] = useState(0)
  const [busy, setBusy] = useState(false)
  const leafRefs = useRef<(HTMLDivElement | null)[]>([])

  const total = pages.length
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const animate = useCallback(
    (lf: HTMLDivElement, cls: string, after: () => void) => {
      if (reduce) {
        after()
        return
      }
      setBusy(true)
      const done = () => {
        lf.removeEventListener('animationend', onEnd)
        lf.classList.remove(cls)
        after()
        setBusy(false)
      }
      const onEnd = (e: AnimationEvent) => {
        if (e.target === lf) done()
      }
      lf.addEventListener('animationend', onEnd)
      setTimeout(() => {
        if (busy) done()
      }, 1200)
      lf.classList.add(cls)
    },
    [busy, reduce],
  )

  const go = useCallback(
    (dir: number) => {
      if (busy || !total) return
      if (dir > 0 && cur < total - 1) {
        const lf = leafRefs.current[cur]
        if (!lf) return
        setCur((c) => c + 1)
        animate(lf, 'turn', () => lf.classList.add('turned'))
      } else if (dir < 0 && cur > 0) {
        const nextCur = cur - 1
        const lf = leafRefs.current[nextCur]
        if (!lf) return
        lf.classList.remove('turned')
        setCur(nextCur)
        animate(lf, 'unturn', () => {})
      } else if (dir > 0 && cur === total - 1) {
        /* tap advance on last page — no-op like maqueta go(1) at end */
      }
    },
    [animate, busy, cur, total],
  )

  useEffect(() => {
    const book = bookRef.current
    if (!book) return
    let x0: number | null = null
    const onDown = (e: PointerEvent) => {
      x0 = e.clientX
    }
    const onUp = (e: PointerEvent) => {
      if (x0 === null) return
      const dx = e.clientX - x0
      x0 = null
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
      else go(1)
    }
    book.addEventListener('pointerdown', onDown)
    book.addEventListener('pointerup', onUp)
    book.addEventListener('pointercancel', () => {
      x0 = null
    })
    return () => {
      book.removeEventListener('pointerdown', onDown)
      book.removeEventListener('pointerup', onUp)
    }
  }, [go])

  if (!total) return null

  return (
    <div className="book-wrap">
      <div className="book" id="book" ref={bookRef} aria-label="Vista previa de guía. Tocá para pasar de página.">
        {pages.map((page, i) => (
          <div
            key={page.id || i}
            className="leaf"
            style={{ zIndex: total - i }}
            ref={(el) => {
              leafRefs.current[i] = el
            }}
          >
            <div className={`page${i === total - 1 ? ' cover' : ''}`}>
              {page.kicker ? <div className="k">{page.kicker}</div> : null}
              {page.title ? <h4>{page.title}</h4> : null}
              {page.body ? <RichText value={page.body} /> : null}
              {page.note ? <div className="note">{page.note}</div> : null}
              <div className="pg">
                <span>{siteLabel}</span>
                <span>{i + 1}</span>
              </div>
            </div>
            <div className="leaf-back" aria-hidden="true" />
          </div>
        ))}
      </div>
      <div className="book-ctrl">
        <button type="button" id="bookPrev" aria-label="Página anterior" disabled={cur === 0} onClick={() => go(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <span id="bookPos">
          Página {cur + 1} de {total}
        </span>
        <button
          type="button"
          id="bookNext"
          aria-label="Página siguiente"
          disabled={cur >= total - 1}
          onClick={() => go(1)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
      <p className="book-hint">Tocá o deslizá la página para hojear</p>
    </div>
  )
}
