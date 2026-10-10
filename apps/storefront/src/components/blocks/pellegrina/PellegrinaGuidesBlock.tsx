import type { PellegrinaGuidesBlock as Block } from '@tn/core'

import { RichText } from '@/components/RichText'

import { GuidesBook } from './GuidesBook'

export function PellegrinaGuidesBlock({ block }: { block: Block }) {
  return (
    <section className="sec" id="guias" data-stage={block.stageLabel || 'Guías'}>
      <div className="wrap guide-grid">
        <div className="guide-text">
          {block.legLabel ? (
            <div className="leg">
              <span className="dot" />
              <span className="dash" />
              <strong>{block.legLabel}</strong>
            </div>
          ) : null}
          {block.heading ? <h2>{block.heading}</h2> : null}
          {block.body ? <RichText value={block.body} as="p" /> : null}
          {block.includes?.length ? (
            <ul className="incl">
              {block.includes.map((row) => (
                <li key={row.id || row.item}>{row.item}</li>
              ))}
            </ul>
          ) : null}
          {block.price ? (
            <div className="price">
              <b>{block.price}</b>
              {block.priceNote ? <span>{block.priceNote}</span> : null}
            </div>
          ) : null}
          {block.cta ? (
            <div className="ctas">
              <a
                className={`btn btn-wa${block.cta.url.startsWith('http') ? '' : ' js-wa'}`}
                href={block.cta.url.startsWith('http') ? block.cta.url : '#'}
                data-msg={block.cta.text}
                target="_blank"
                rel="noopener noreferrer"
              >
                {block.cta.text}
              </a>
            </div>
          ) : null}
        </div>
        <GuidesBook pages={block.pages || []} />
      </div>
    </section>
  )
}
