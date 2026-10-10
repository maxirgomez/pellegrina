'use client'

import type { PellegrinaSuitcaseBlock } from '@tn/core'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { RichText } from '@/components/RichText'

const KEY = 'pellegrina-valija'

type Season = 'verano' | 'invierno'

type State = { season: Season; verano: Record<string, 1>; invierno: Record<string, 1> }

function slug(s: string) {
  return s.normalize('NFD').replace(/[^\w]+/g, '-').toLowerCase()
}

function loadState(): State {
  const base: State = { season: 'verano', verano: {}, invierno: {} }
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (s?.season) return { ...base, ...s }
  } catch {
    /* ignore */
  }
  return base
}

export function SuitcaseSection({ block }: { block: PellegrinaSuitcaseBlock }) {
  const { categories, tipMessage, doneCtaLabel, doneCtaSub, footerNote } = block
  const [state, setState] = useState<State>(() =>
    typeof window === 'undefined' ? { season: 'verano', verano: {}, invierno: {} } : loadState(),
  )
  const [initial, setInitial] = useState(true)
  const wasFull = useRef(false)
  const listsRef = useRef<HTMLDivElement>(null)
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const save = useCallback((next: State) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }, [])

  const filtered = useMemo(() => {
    const season = state.season
    return (categories || []).filter(
      (c) => c.season === season || c.season === 'ambas',
    )
  }, [categories, state.season])

  const stats = useMemo(() => {
    let done = 0
    let total = 0
    const checked = state[state.season]
    filtered.forEach((cat) => {
      cat.items?.forEach((it) => {
        total++
        const id = `i-${state.season}-${slug(cat.name)}-${slug(it.label)}`
        if (checked[id]) done++
      })
    })
    return { done, total, p: total ? done / total : 0 }
  }, [filtered, state])

  const restart = (el: Element, cls: string) => {
    el.classList.remove(cls)
    void (el as HTMLElement).getBoundingClientRect()
    el.classList.add(cls)
  }

  const flyDot = (fromEl: Element) => {
    if (reduce) return
    const bagbar = document.getElementById('bagbar')
    const miniCase = document.getElementById('miniCase')
    const bigCase = document.querySelector('.meter .suitcase')
    const target = bagbar?.classList.contains('show') ? miniCase : bigCase
    if (!target) return
    const a = fromEl.getBoundingClientRect()
    const b = target.getBoundingClientRect()
    if (b.bottom < 0 || b.top > window.innerHeight) return
    const sx = a.left + a.width / 2 - 7
    const sy = a.top + a.height / 2 - 7
    const tx = b.left + b.width / 2 - 7
    const ty = b.top + b.height * 0.5 - 7
    const dx = tx - sx
    const dy = ty - sy
    const lift = Math.min(120, Math.abs(dy) * 0.3 + 40)
    const dot = document.createElement('div')
    dot.className = 'fly'
    document.body.appendChild(dot)
    dot.animate(
      [
        { transform: `translate(${sx}px,${sy}px) scale(1)` },
        { transform: `translate(${sx + dx * 0.5}px,${sy + dy * 0.5 - lift}px) scale(1.15)`, offset: 0.45 },
        { transform: `translate(${tx}px,${ty}px) scale(.45)`, opacity: 0.6 },
      ],
      { duration: 650, easing: 'cubic-bezier(.45,0,.35,1)' },
    ).onfinish = () => {
      dot.remove()
      // maqueta: bounce the suitcase/mini-case when the flying item lands
      restart(target, 'bump')
    }
  }

  const bagMessage = useMemo(() => {
    const { p } = stats
    const docsDone = listsRef.current?.querySelector('.cat.done') != null
    if (tipMessage && p === 0) return tipMessage
    if (p === 0) return 'Arrancá por la documentación: es lo único que no se compra allá.'
    if (p < 0.35) return docsDone ? 'Documentación lista. Ahora sí, la ropa.' : 'Buen arranque. ¿Ya tenés el DNI o pasaporte a mano?'
    if (p < 0.7) return 'Vas por la mitad. ¿Te acordaste del protector solar?'
    if (p < 1) return 'Ya casi. Revisá el botiquín antes de cerrar.'
    return '¡Valija lista! Solo te falta el destino.'
  }, [stats, tipMessage])

  useEffect(() => {
    const bbDone = document.getElementById('bbDone')
    const bbTotal = document.getElementById('bbTotal')
    if (bbDone) bbDone.textContent = String(stats.done)
    if (bbTotal) bbTotal.textContent = String(stats.total)
  }, [stats.done, stats.total])

  useEffect(() => {
    const full = stats.p === 1
    const bigCase = document.querySelector('.meter .suitcase')
    bigCase?.classList.toggle('closed', full)
    const tag = document.getElementById('bagTag')
    if (tag) tag.hidden = !full
    const fill = document.getElementById('fill') as SVGRectElement | null
    if (fill) {
      const h = 52 * stats.p
      fill.setAttribute('y', String(74 - h))
      fill.setAttribute('height', String(h))
    }
    document.getElementById('bbFill')?.style.setProperty('width', `${stats.p * 100}%`)
    if (full && !wasFull.current && !initial && !reduce) {
      if (tag) setTimeout(() => restart(tag, 'swing'), 0)
      if (bigCase) setTimeout(() => restart(bigCase, 'bump'), 600)
    }
    wasFull.current = full
    setInitial(false)
  }, [stats, initial, reduce])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    let bagIn = false
    let meterIn = true
    const bagbar = document.getElementById('bagbar')
    const lists = document.getElementById('lists')
    const meter = document.querySelector('.meter')
    if (!bagbar || !lists || !meter) return
    const sync = () => bagbar.classList.toggle('show', bagIn && !meterIn)
    const io1 = new IntersectionObserver((es) => {
      bagIn = es[0]?.isIntersecting ?? false
      sync()
    }, { rootMargin: '-35% 0px -35% 0px' })
    const io2 = new IntersectionObserver((es) => {
      meterIn = es[0]?.isIntersecting ?? true
      sync()
    })
    io1.observe(lists)
    io2.observe(meter)
    return () => {
      io1.disconnect()
      io2.disconnect()
    }
  }, [])

  const toggle = (id: string, checked: boolean, box: Element) => {
    setState((prev) => {
      const bucket = { ...prev[prev.season] }
      if (checked) {
        bucket[id] = 1
        flyDot(box)
      } else delete bucket[id]
      const next = { ...prev, [prev.season]: bucket }
      save(next)
      return next
    })
  }

  const reset = () => {
    setState((prev) => {
      const next = { ...prev, [prev.season]: {} }
      save(next)
      return next
    })
  }

  const hl = state.season === 'verano' ? 'var(--aire)' : 'var(--agua)'

  return (
    <>
      <div className="bag-top">
        <div>
          {block.legLabel ? (
            <div className="leg">
              <span className="dot" style={{ background: '#fff' }} />
              <span className="dash" />
              <strong>{block.legLabel}</strong>
            </div>
          ) : null}
          {block.heading ? <h2>{block.heading}</h2> : null}
          {block.intro ? <p className="intro">{block.intro}</p> : null}
          <div className="season" role="group" aria-label="Temporada">
            {(['verano', 'invierno'] as Season[]).map((s) => (
              <button
                key={s}
                type="button"
                data-season={s}
                aria-pressed={state.season === s}
                onClick={() => setState((p) => ({ ...p, season: s }))}
              >
                {s === 'verano' ? '☀ Primavera / verano' : '❄ Otoño / invierno'}
              </button>
            ))}
          </div>
        </div>
        <div className="meter" aria-live="polite">
        <div className="meter-row">
          <svg className="suitcase" viewBox="0 0 84 84" aria-hidden="true">
            <defs>
              <clipPath id="sc">
                <rect x="10" y="22" width="64" height="52" rx="10" />
              </clipPath>
            </defs>
            <path className="handle" d="M30 22v-8a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v8" fill="none" stroke="#1d1a17" strokeWidth={3} />
            <rect x="10" y="22" width="64" height="52" rx="10" fill="#ffffff" stroke="#1d1a17" strokeWidth={3} />
            <rect id="fill" clipPath="url(#sc)" x="10" y="74" width="64" height="0" fill="#a9d6e1" />
            <rect x="10" y="22" width="64" height="52" rx="10" fill="none" stroke="#1d1a17" strokeWidth={3} />
            <line x1="30" y1="22" x2="30" y2="74" stroke="#1d1a17" strokeWidth={2.5} />
            <line x1="54" y1="22" x2="54" y2="74" stroke="#1d1a17" strokeWidth={2.5} />
            <rect className="strap" x="8" y="43" width="68" height="9" rx="2" fill="#b45f2e" stroke="#1d1a17" strokeWidth={2} />
            <rect className="strap" x="38" y="41" width="8" height="13" rx="1.5" fill="#fbf8f2" stroke="#1d1a17" strokeWidth={2} />
          </svg>
          <div>
            <div className="count">
              <span id="cDone">{stats.done}</span>
              <small>
                {' '}
                de <span id="cTotal">{stats.total}</span>
              </small>
            </div>
            <div style={{ fontSize: 14, color: 'var(--ink-soft)' }}>cosas en la valija</div>
          </div>
        </div>
        <p className="msg" id="bagMsg">
          {bagMessage}
        </p>
        <a
          className="tag js-wa"
          id="bagTag"
          hidden={stats.p < 1}
          data-msg="Hola Jaz! Ya tengo la valija lista. ¿Me ayudás a elegir a dónde llevarla?"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>
            <b>{doneCtaLabel || '¿A dónde la llevamos?'}</b>
            <span>{doneCtaSub || 'Contame y armamos el viaje'}</span>
          </span>
        </a>
        <div className="acts">
          <button type="button" className="linkbtn" id="bagReset" onClick={reset}>
            Vaciar la valija
          </button>
        </div>
        </div>
      </div>
      <div className="lists" id="lists" ref={listsRef}>
        {filtered.map((cat) => {
          const items = cat.items || []
          const n = items.filter((it) => {
            const id = `i-${state.season}-${slug(cat.name)}-${slug(it.label)}`
            return state[state.season][id]
          }).length
          const full = items.length > 0 && n === items.length
          return (
            <div
              key={cat.id || cat.name}
              className={`cat${full ? ' done' : ''}`}
              style={{ ['--hl' as string]: hl }}
              data-done={full ? '1' : '0'}
            >
              <div className="cat-h">
                <h3>{cat.name.toUpperCase()}</h3>
                <span className={full ? 'stamp-in' : ''}>{full ? '¡COMPLETO!' : `${n}/${items.length}`}</span>
              </div>
              {items.map((it) => {
                const id = `i-${state.season}-${slug(cat.name)}-${slug(it.label)}`
                const checked = !!state[state.season][id]
                return (
                  <label key={it.id || it.label} className="item" htmlFor={id}>
                    <input
                      type="checkbox"
                      id={id}
                      checked={checked}
                      onChange={(e) => toggle(id, e.target.checked, e.target.nextElementSibling!)}
                    />
                    <span className="box">
                      <svg viewBox="0 0 12 12">
                        <path d="M2 6.5l2.5 2.5L10 3.5" />
                      </svg>
                    </span>
                    <span className="t">{it.label}</span>
                  </label>
                )
              })}
            </div>
          )
        })}
      </div>
      {footerNote ? (
        <RichText className="foot-note" value={footerNote} as="p" />
      ) : (
        <p className="foot-note">
          Las cantidades van a depender de los días de viaje.{' '}
          <a href="#" className="js-wa" data-msg="Hola Jaz! Tengo una duda con la valija." target="_blank" rel="noopener noreferrer">
            Escribime y lo vemos juntos/as
          </a>
          .
        </p>
      )}
    </>
  )
}
