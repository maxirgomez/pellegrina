'use client'

import { useCallback, useEffect, useRef, type RefObject } from 'react'

const NS = 'http://www.w3.org/2000/svg'

type Pin = { g: SVGGElement; ring: SVGCircleElement | null; y: number; l: number }

export function usePellegrinaFlight(mainRef: RefObject<HTMLElement | null>) {
  const flightRef = useRef<SVGSVGElement>(null)
  const fBaseRef = useRef<SVGPathElement>(null)
  const fRevealRef = useRef<SVGPathElement>(null)
  const fMaskRef = useRef<SVGMaskElement>(null)
  const pinsRef = useRef<SVGGElement>(null)
  const planeRef = useRef<SVGGElement>(null)
  const state = useRef({
    len: 0,
    pins: [] as Pin[],
    tops: [] as number[],
    mainTop: 0,
    ready: false,
    arrived: false,
  })

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const findLen = useCallback((y: number) => {
    const fBase = fBaseRef.current
    const F = state.current
    if (!fBase || !F.len) return 0
    let lo = 0
    let hi = F.len
    for (let i = 0; i < 22; i++) {
      const mid = (lo + hi) / 2
      if (fBase.getPointAtLength(mid).y < y) lo = mid
      else hi = mid
    }
    return lo
  }, [])

  const restart = (el: Element, cls: string) => {
    el.classList.remove(cls)
    void (el as HTMLElement).getBoundingClientRect()
    el.classList.add(cls)
  }

  const drawFlight = useCallback(
    (scrollY: number) => {
      const F = state.current
      const fBase = fBaseRef.current
      const fReveal = fRevealRef.current
      const plane = planeRef.current
      if (!F.ready || !fBase || !fReveal || !plane) return
      const l = reduce
        ? F.len
        : Math.max(0, Math.min(F.len, findLen(scrollY + window.innerHeight * 0.55 - F.mainTop)))
      fReveal.setAttribute('stroke-dashoffset', String(1000 * (1 - l / F.len)))
      const p = fBase.getPointAtLength(l)
      const q = l < F.len - 3 ? fBase.getPointAtLength(l + 3) : fBase.getPointAtLength(l - 3)
      let ang = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI + 90
      if (l >= F.len - 3) ang += 180
      plane.setAttribute('transform', `translate(${p.x},${p.y}) rotate(${ang})`)
      plane.style.display = reduce || l >= F.len - 1 ? 'none' : ''
      F.pins.forEach((pin) => pin.g.classList.toggle('on', l >= pin.l - 2))
      const last = F.pins[F.pins.length - 1]
      if (last && l >= last.l - 2 && !F.arrived) {
        F.arrived = true
        if (!reduce && last.ring) restart(last.ring, 'go')
      }
      if (last && l < last.l - 40) F.arrived = false
    },
    [findLen, reduce],
  )

  const buildFlight = useCallback(() => {
    const main = mainRef.current
    const flight = flightRef.current
    const fBase = fBaseRef.current
    const fDone = document.getElementById('flightDone') as SVGPathElement | null
    const fReveal = fRevealRef.current
    const fMask = fMaskRef.current
    const pinsG = pinsRef.current
    if (!main || !flight || !fBase || !fDone || !fReveal || !fMask || !pinsG) return

    const stages = [...main.querySelectorAll<HTMLElement>('[data-stage]')]
    if (!stages.length) return

    const W = main.clientWidth
    const H = main.offsetHeight
    flight.setAttribute('viewBox', `0 0 ${W} ${H}`)
    flight.style.height = `${H}px`
    fMask.setAttribute('width', String(W))
    fMask.setAttribute('height', String(H))

    const wrapW = Math.min(1140, W)
    const pad = Math.min(40, Math.max(16, W * 0.04))
    const contentLeft = (W - wrapW) / 2 + pad
    const xL = Math.max(7, contentLeft / 2)
    const xR = W - xL
    let side = 0
    const X = () => (side ? xR : xL)
    const hero = stages[0]
    let d = `M${X()},${hero.offsetHeight * 0.55}`
    const pinDefs: [number, number, boolean][] = []

    for (let k = 1; k < stages.length; k++) {
      const prev = stages[k - 1]
      const next = stages[k]
      const yb = next.offsetTop
      const pb = parseFloat(getComputedStyle(prev).paddingBottom) || 0
      const pt = parseFloat(getComputedStyle(next).paddingTop) || 0
      const x0 = X()
      if (k === stages.length - 1) {
        const a = yb - pb * 0.85
        const yc = yb - pb * 0.2
        const xc = W / 2
        d += ` L${x0},${a} C${x0},${(a + yc) / 2} ${xc},${a} ${xc},${yc}`
        pinDefs.push([xc, yc, true])
      } else {
        const a = yb - Math.max(30, pb * 0.8)
        const c = yb + pt * 0.55
        const m = (a + c) / 2
        side = 1 - side
        const x1 = X()
        d += ` L${x0},${a} C${x0},${m} ${x1},${m} ${x1},${c}`
        pinDefs.push([x1, c, false])
      }
    }

    fBase.setAttribute('d', d)
    fDone.setAttribute('d', d)
    fReveal.setAttribute('d', d)
    const F = state.current
    F.len = fBase.getTotalLength()
    pinsG.innerHTML = ''

    const makePin = (x: number, y: number, end: boolean) => {
      const outer = document.createElementNS(NS, 'g')
      outer.setAttribute('transform', `translate(${x},${y})`)
      const s = end ? 1.35 : 1
      outer.innerHTML =
        (end ? `<circle class="ring" cx="0" cy="${-17 * s}" r="12"/>` : '') +
        `<g class="pin${end ? ' end' : ''}"><path d="M0,0 C${-7 * s},${-9 * s} ${-9 * s},${-13 * s} ${-9 * s},${-17 * s} a${9 * s},${9 * s} 0 1,1 ${18 * s},0 c0,${4 * s} ${-2 * s},${8 * s} ${-9 * s},${17 * s}z"/><circle cx="0" cy="${-17 * s}" r="${3 * s}"/></g>`
      pinsG.appendChild(outer)
      return {
        g: outer.querySelector('.pin') as SVGGElement,
        ring: outer.querySelector('.ring') as SVGCircleElement | null,
        y,
      }
    }

    F.pins = pinDefs.map(([x, y, end]) => {
      const p = makePin(x, y, end)
      return { ...p, l: findLen(y) }
    })
    F.mainTop = main.getBoundingClientRect().top + window.scrollY
    F.tops = stages.map((s) => s.getBoundingClientRect().top + window.scrollY)
    F.ready = true
    drawFlight(window.scrollY)
  }, [drawFlight, findLen, mainRef])

  useEffect(() => {
    const main = mainRef.current
    if (!main) return
    let rebuildQueued = false
    const queueBuild = () => {
      if (!rebuildQueued) {
        rebuildQueued = true
        requestAnimationFrame(() => {
          rebuildQueued = false
          buildFlight()
        })
      }
    }
    const ro = new ResizeObserver(queueBuild)
    ro.observe(main)
    window.addEventListener('resize', queueBuild)
    document.fonts?.ready.then(queueBuild)
    buildFlight()
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', queueBuild)
    }
  }, [buildFlight, mainRef])

  return { flightRef, fBaseRef, fRevealRef, fMaskRef, pinsRef, planeRef, drawFlight, state }
}
