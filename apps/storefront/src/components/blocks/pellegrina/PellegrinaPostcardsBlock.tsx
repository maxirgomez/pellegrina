import type { PellegrinaPostcardsBlock as Block } from '@tn/core'

import { PostcardFlip } from './PostcardFlip'

export function PellegrinaPostcardsBlock({ block }: { block: Block }) {
  const items = block.items ?? []
  return (
    <section className="sec" id="postales" data-stage={block.stageLabel || 'Postales'}>
      <div className="wrap">
        {block.legLabel ? (
          <div className="leg">
            <span className="dot" style={{ background: 'var(--aire)' }} />
            <span className="dash" />
            <strong>{block.legLabel}</strong>
          </div>
        ) : null}
        {block.heading ? <h2>{block.heading}</h2> : null}
        <div className="tst-grid">
          {items.map((item, index) => (
            <PostcardFlip key={item.id || `${item.fromPlace}-${index}`} item={item} />
          ))}
          <div className="next-card">
            {block.nextCardTitle ? <h3>{block.nextCardTitle}</h3> : null}
            {block.nextCardBody ? <p>{block.nextCardBody}</p> : null}
            {block.nextCardCta ? (
              <div>
                <a
                  className={`btn btn-wa${block.nextCardCta.url.startsWith('http') ? '' : ' js-wa'}`}
                  href={block.nextCardCta.url.startsWith('http') ? block.nextCardCta.url : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {block.nextCardCta.text}
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
