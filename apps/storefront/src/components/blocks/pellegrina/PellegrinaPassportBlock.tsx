import type { PellegrinaPassportBlock as Block } from '@tn/core'

import { RichText } from '@/components/RichText'

import { PassportStampsMotion } from './PassportStampsMotion'

export function PellegrinaPassportBlock({ block }: { block: Block }) {
  return (
    <section className="sec" id="itinerario" data-stage={block.stageLabel || 'Itinerario'} style={{ paddingTop: 0 }}>
      <PassportStampsMotion />
      <div className="wrap">
        {block.legLabel ? (
          <div className="leg">
            <span className="dot" style={{ background: 'var(--aire)' }} />
            <span className="dash" />
            <strong>{block.legLabel}</strong>
          </div>
        ) : null}
        {block.heading ? <h2>{block.heading}</h2> : null}
        {block.intro ? <p className="intro">{block.intro}</p> : null}
        <div className="passport">
          <div className="pp-head">
            <span>PASAPORTE DE VIAJE · PELLEGRINA</span>
            <span>Hojas 1 a {block.steps?.length || 3}</span>
          </div>
          <div className="pp-pages">
            {block.steps?.map((step, i) => (
              <div key={step.id || i} className="pp-step">
                <div
                  className={`vstamp${i === 1 ? ' rect' : ''}`}
                  style={{
                    ['--rot' as string]: i === 0 ? '-9deg' : i === 1 ? '6deg' : '-4deg',
                    ['--c' as string]: i === 1 ? 'var(--aire-deep)' : i === 2 ? 'var(--tierra)' : 'var(--agua-deep)',
                  }}
                >
                  <div>
                    <small>{step.stampLabel}</small>
                    <b>{step.stepNumber}</b>
                  </div>
                </div>
                <h3>{step.title}</h3>
                {step.description ? <RichText value={step.description} as="p" /> : null}
                {step.tags?.length ? (
                  <div className="ways">
                    {step.tags.map((t) => (
                      <span key={t.id || t.label}>{t.label}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
