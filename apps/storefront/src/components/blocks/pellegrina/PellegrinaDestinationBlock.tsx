import type { PellegrinaDestinationBlock as Block } from '@tn/core'

import { buildWaLink } from '@/lib/pellegrinaWa'

import { DestinationTicketForm } from './DestinationTicketForm'

const toneBg: Record<string, string> = {
  agua: 'var(--agua)',
  aire: 'var(--aire)',
  tierra: '#f2d3bf',
}

type Contact = {
  whatsappNumber?: string | null
  contactEmail?: string | null
}

export function PellegrinaDestinationBlock({ block, contact }: { block: Block; contact: Contact }) {
  return (
    <section className="sec dest" id="contacto" data-stage={block.stageLabel || 'Próximo destino'}>
      <div className="wrap dest-grid">
        <div className="dest-side">
          {block.legLabel ? (
            <div className="leg">
              <span className="dot" />
              <span className="dash" />
              <strong>{block.legLabel}</strong>
            </div>
          ) : null}
          {block.heading ? <h2>{block.heading}</h2> : null}
          {block.intro ? <p className="intro">{block.intro}</p> : null}
          <div className="ways-big">
            {block.ways?.map((way) => {
              const bg = toneBg[way.tone || 'agua'] || toneBg.agua
              const inner = (
                <>
                  <span className="ic" style={{ background: bg }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                      <path d="M4 4h16v12H8l-4 4V4z" />
                    </svg>
                  </span>
                  <span>
                    <b>{way.title}</b>
                    {way.description ? <span>{way.description}</span> : null}
                  </span>
                </>
              )
              if (way.whatsapp) {
                return (
                  <a
                    key={way.id || way.title}
                    className="way js-wa"
                    href={buildWaLink(contact.whatsappNumber, null)}
                    style={{ textDecoration: 'none' }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {inner}
                  </a>
                )
              }
              return (
                <div key={way.id || way.title} className="way">
                  {inner}
                </div>
              )
            })}
          </div>
        </div>
        <DestinationTicketForm
          enabled={block.formEnabled !== false}
          whatsappNumber={contact.whatsappNumber}
          contactEmail={contact.contactEmail}
        />
      </div>
    </section>
  )
}
