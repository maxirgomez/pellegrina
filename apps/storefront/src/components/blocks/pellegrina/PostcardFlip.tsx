'use client'

import type { PostcardItem } from '@tn/core'
import { useEffect, useRef, useState } from 'react'

export function PostcardFlip({ item }: { item: PostcardItem }) {
  const flipRef = useRef<HTMLButtonElement>(null)
  const [pressed, setPressed] = useState(false)
  const lock = useRef(false)

  useEffect(() => {
    const flip = flipRef.current
    if (!flip) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer:fine)').matches
    const setTilt = (ty: number, tx: number) => {
      flip.style.setProperty('--ty', `${ty}deg`)
      flip.style.setProperty('--tx', `${tx}deg`)
    }
    if (reduce) return
    if (finePointer) {
      const onMove = (e: PointerEvent) => {
        if (lock.current) return
        const r = flip.getBoundingClientRect()
        flip.classList.add('tilting')
        setTilt(((e.clientX - r.left) / r.width - 0.5) * 14, -((e.clientY - r.top) / r.height - 0.5) * 10)
      }
      const onLeave = () => {
        flip.classList.remove('tilting')
        setTilt(0, 0)
      }
      flip.addEventListener('pointermove', onMove)
      flip.addEventListener('pointerleave', onLeave)
      return () => {
        flip.removeEventListener('pointermove', onMove)
        flip.removeEventListener('pointerleave', onLeave)
      }
    }
  }, [])

  useEffect(() => {
    const flip = flipRef.current
    if (!flip || !('IntersectionObserver' in window)) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const io = new IntersectionObserver(
      (es) => {
        if (!es[0]?.isIntersecting) return
        io.disconnect()
        setTimeout(() => {
          flip.style.setProperty('--ty', '-26deg')
          setTimeout(() => {
            flip.style.setProperty('--ty', '0deg')
            flip.style.setProperty('--tx', '0deg')
          }, 520)
        }, 300)
      },
      { threshold: 0.7 },
    )
    io.observe(flip)
    return () => io.disconnect()
  }, [])

  const onClick = () => {
    const flip = flipRef.current
    if (!flip) return
    flip.classList.remove('tilting')
    flip.style.setProperty('--ty', '0deg')
    flip.style.setProperty('--tx', '0deg')
    lock.current = true
    setTimeout(() => {
      lock.current = false
    }, 900)
    setPressed((p) => !p)
  }

  return (
    <button
      type="button"
      className="flip"
      ref={flipRef}
      aria-pressed={pressed}
      aria-label={`Postal ${item.who}. Tocá para darla vuelta.`}
      onClick={onClick}
    >
      <div className="flip-in">
        <div className="face front">
          <div className="route-big">
            <span>{item.fromPlace}</span>
            <svg viewBox="0 0 110 30" fill="none" aria-hidden="true">
              <path d="M2 24 C30 2, 70 2, 100 18" stroke="currentColor" strokeWidth={2} strokeDasharray="5 5" />
              <path d="M96 10l8 9-11 2" stroke="currentColor" strokeWidth={2} />
            </svg>
            <span>{item.toPlace}</span>
          </div>
          <div>
            <p className="who">{item.who}</p>
            <span className="hint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" />
                <path d="M18 3v4h-4M6 21v-4h4" />
              </svg>
              Dala vuelta
            </span>
          </div>
        </div>
        <div className="face back">
          <blockquote>{item.quote}</blockquote>
          <p className="who">{item.who}</p>
        </div>
      </div>
    </button>
  )
}
