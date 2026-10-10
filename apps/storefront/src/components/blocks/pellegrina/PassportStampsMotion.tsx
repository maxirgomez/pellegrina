'use client'

import { useEffect } from 'react'

export function PassportStampsMotion() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) return
    document.documentElement.classList.add('js-motion')
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement
            setTimeout(() => el.classList.add('inked'), Number(el.dataset.d || 0))
            io.unobserve(el)
          }
        }),
      { threshold: 0.6 },
    )
    document.querySelectorAll('.vstamp').forEach((s, i) => {
      ;(s as HTMLElement).dataset.d = String(i * 220)
      io.observe(s)
    })
    const t = setTimeout(() => {
      document.querySelectorAll('.vstamp').forEach((s) => s.classList.add('inked'))
    }, 9000)
    return () => {
      clearTimeout(t)
      io.disconnect()
    }
  }, [])
  return null
}
