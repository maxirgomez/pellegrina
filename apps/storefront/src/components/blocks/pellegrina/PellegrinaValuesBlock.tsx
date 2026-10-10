import type { PellegrinaValuesBlock as Block } from '@tn/core'

import { RichText } from '@/components/RichText'

function slug(title: string) {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

type Mark = 'compass' | 'ear' | 'heart' | 'person'

const TITLE_MARK: Record<string, Mark> = {
  honestidad: 'compass',
  escucha: 'ear',
  gratitud: 'heart',
  valoracion: 'person',
}

const FALLBACK_MARKS: Mark[] = ['compass', 'ear', 'heart', 'person']

/** Organic blob paths (viewBox 0 0 56 56) — each silhouette reads differently */
const BLOB_PATHS = [
  // pebble / bean (Honestidad)
  'M28 4c12 1 24 10 24 24 0 13-11 24-24 24S4 41 4 28 16 3 28 4z',
  // soft diamond / kite (Escucha)
  'M28 3c8 6 22 12 24 25 1 11-8 23-24 25C12 51 3 40 4 28 5 14 20 -3 28 3z',
  // rounded square / cloud (Gratitud)
  'M18 8c10-6 22-2 28 8 5 8 4 20-4 28-7 7-19 9-28 4C5 33 2 20 8 12c4-5 6-5 10-4z',
  // teardrop / drop (Valoración)
  'M28 2c14 10 26 18 24 32-2 12-14 20-24 20S6 46 4 34C2 20 14 12 28 2z',
] as const

function MarkGlyph({ mark }: { mark: Mark }) {
  const common = {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (mark) {
    case 'compass':
      return (
        <g transform="translate(16 16)" {...common}>
          <path d="M12 3l2.5 9L12 21l-2.5-9z" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
        </g>
      )
    case 'ear':
      return (
        <g transform="translate(16 16)" {...common}>
          <path d="M5 9a7 7 0 0 1 14 0c0 4-3 4-3 8a3 3 0 0 1-6 0" />
          <path d="M9 9a3 3 0 0 1 6 0" />
        </g>
      )
    case 'heart':
      return (
        <g transform="translate(16 16)" {...common}>
          <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
        </g>
      )
    case 'person':
      return (
        <g transform="translate(16 16)" {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
        </g>
      )
  }
}

function ValueMark({
  title,
  index,
  tone,
}: {
  title: string
  index: number
  tone: 'agua' | 'aire'
}) {
  const mark = TITLE_MARK[slug(title)] || FALLBACK_MARKS[index % 4]
  const blob = BLOB_PATHS[index % 4]
  const fill = tone === 'aire' ? 'var(--aire)' : 'var(--agua)'

  return (
    <svg
      className={`blob blob-shape-${(index % 4) + 1}`}
      viewBox="0 0 56 56"
      width={56}
      height={56}
      aria-hidden="true"
    >
      <path d={blob} fill={fill} />
      <MarkGlyph mark={mark} />
    </svg>
  )
}

export function PellegrinaValuesBlock({ block }: { block: Block }) {
  return (
    <section className="sec vals" id="valores" data-stage={block.stageLabel || 'Brújula'}>
      <div className="wrap">
        {block.legLabel ? (
          <div className="leg">
            <span className="dot" style={{ background: 'var(--tierra)' }} />
            <span className="dash" />
            <strong>{block.legLabel}</strong>
          </div>
        ) : null}
        {block.heading ? <h2>{block.heading}</h2> : null}
        <div className="val-grid">
          {block.items?.map((item, i) => {
            const shape = (i % 4) + 1
            const tone = item.tone === 'aire' ? 'aire' : 'agua'
            return (
              <article key={item.id || i} className={`val val-shape-${shape}`}>
                <ValueMark title={item.title} index={i} tone={tone} />
                <h3>{item.title}</h3>
                {item.description ? <RichText className="val-body" value={item.description} /> : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
