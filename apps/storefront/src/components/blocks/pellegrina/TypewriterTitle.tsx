'use client'

import { useEffect, useRef } from 'react'

export function TypewriterTitle({ text, signature }: { text: string; signature?: string | null }) {
  const hRef = useRef<HTMLHeadingElement>(null)
  const signRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const h = hRef.current
    const sign = signRef.current
    if (!h) return
    if (reduce) {
      h.textContent = text
      return
    }
    let i = 0
    let cancelled = false
    sign?.classList.add('pre')
    h.replaceChildren()
    const caret = document.createElement('span')
    caret.className = 'caret'
    const node = document.createTextNode('')
    h.append(node, caret)
    const step = () => {
      if (cancelled) return
      node.data = text.slice(0, ++i)
      if (i < text.length) {
        // ponytail: Math.random only in useEffect (post-hydrate)
        setTimeout(step, text[i - 1] === ' ' ? 40 : 18 + Math.random() * 18)
      } else {
        setTimeout(() => {
          if (!cancelled) sign?.classList.remove('pre')
        }, 150)
        setTimeout(() => {
          if (!cancelled) caret.remove()
        }, 1500)
      }
    }
    step()
    return () => {
      cancelled = true
    }
  }, [text, signature])

  return (
    <>
      {/* Full text on SSR + first client paint; effect rewrites DOM after hydrate */}
      <h1 id="typed" ref={hRef} suppressHydrationWarning>
        {text}
      </h1>
      {signature ? (
        <p className="sign" ref={signRef}>
          {signature}
        </p>
      ) : null}
    </>
  )
}
