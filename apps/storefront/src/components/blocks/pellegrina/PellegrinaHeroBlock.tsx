import type { PellegrinaHeroBlock as Block } from '@tn/core'

import { RichText } from '@/components/RichText'
import { mediaUrl } from '@/lib/payload'

import { TypewriterTitle } from './TypewriterTitle'

const chipBg: Record<string, string> = {
  agua: 'var(--agua)',
  aire: 'var(--aire)',
  tierra: 'var(--tierra)',
}

export function PellegrinaHeroBlock({ block }: { block: Block }) {
  // Fallback: maqueta static asset so parallax always has a target without CMS upload
  const globe = mediaUrl(block.globeImage) || '/pellegrina/globe.webp'
  const stamp = mediaUrl(block.stampImage)

  return (
    <section className="hero" id="despegue" data-stage={block.stageLabel || 'Despegue'}>
      <img className="hero-globe" id="heroGlobe" src={globe} alt="" aria-hidden="true" />
      <div className="wrap hero-grid">
        <article className="postcard" aria-label="Postal de bienvenida">
          <div className="pc-msg">
            {block.greeting ? <p className="hi">{block.greeting}</p> : null}
            <TypewriterTitle text={block.typedTitle} signature={block.signature} />
          </div>
          <div className="pc-side">
            <div className="stamp-box">
              <div className="stamp">
                {stamp ? (
                  <img src={stamp} alt={block.stampAlt || 'Logo Pellegrina'} width={94} height={112} />
                ) : (
                  <div style={{ display: 'grid', placeItems: 'center', height: '100%', fontSize: 14, color: 'var(--ink-soft)' }}>
                    Pellegrina
                  </div>
                )}
              </div>
              <svg className="postmark" viewBox="0 0 100 100" aria-hidden="true">
                <defs>
                  <path id="pm" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
                </defs>
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth={2} />
                <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth={1.2} />
                <text fontSize="10.5" fontWeight="700" letterSpacing="2.2" fill="currentColor" fontFamily="Karla, sans-serif">
                  <textPath href="#pm">ANTES · DURANTE · DESPUÉS ·</textPath>
                </text>
                <text x="50" y="54" textAnchor="middle" fontSize="11" fontWeight="800" fill="currentColor" fontFamily="Karla, sans-serif">
                  ARG
                </text>
              </svg>
            </div>
            <div className="addr">
              {block.addressLines?.map((line) => (
                <div key={line.id || line.label}>
                  {line.label}:<b>{line.value}</b>
                </div>
              ))}
            </div>
          </div>
        </article>
        <div className="hero-copy">
          {block.lead ? <RichText className="lead" value={block.lead} as="p" /> : null}
          <div className="ctas">
            {block.primaryCta ? (
              <a
                className={`btn btn-wa${block.primaryCta.url.startsWith('http') ? '' : ' js-wa'}`}
                href={block.primaryCta.url.startsWith('http') ? block.primaryCta.url : '#'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" />
                </svg>
                {block.primaryCta.text}
              </a>
            ) : null}
            {block.secondaryCta ? (
              <a className="btn btn-line" href={block.secondaryCta.url}>
                {block.secondaryCta.text}
              </a>
            ) : null}
          </div>
          {block.chips?.length ? (
            <div className="chips" aria-label="Formas de charlar">
              {block.chips.map((c) => (
                <span key={c.id || c.label}>
                  <i style={{ background: chipBg[c.color || 'agua'] || chipBg.agua }} />
                  {c.label}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
