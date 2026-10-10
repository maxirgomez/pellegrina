import type { PellegrinaWhyBlock as Block } from '@tn/core'

import { RichText } from '@/components/RichText'

export function PellegrinaWhyBlock({ block }: { block: Block }) {
  return (
    <section className="sec" id="nombre" data-stage={block.stageLabel || 'El nombre'}>
      <div className="wrap why-grid">
        <div className="dict">
          {block.word ? <div className="word">{block.word}</div> : null}
          {block.pronunciation ? (
            <p className="pron">
              <i>{block.pronunciation}</i>
            </p>
          ) : null}
          {block.dictionaryBody ? <RichText value={block.dictionaryBody} /> : null}
        </div>
        <div className="why-text">
          {block.legLabel ? (
            <div className="leg">
              <span className="dot" />
              <span className="dash" />
              <strong>{block.legLabel}</strong>
            </div>
          ) : null}
          {block.heading ? <h2>{block.heading}</h2> : null}
          {block.highlight ? <p className="big">{block.highlight}</p> : null}
          {block.body ? <RichText value={block.body} /> : null}
        </div>
      </div>
    </section>
  )
}
