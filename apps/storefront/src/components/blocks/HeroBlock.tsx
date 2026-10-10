import Image from 'next/image'
import type { HeroBlock as HeroBlockType } from '@tn/core'

import { mediaUrl } from '@/lib/payload'
import { lexicalToPlainText } from '@/lib/richtext'

export function HeroBlock({ block }: { block: HeroBlockType }) {
  const title = lexicalToPlainText(block.title)
  const bg = mediaUrl(
    typeof block.backgroundImage === 'object' ? block.backgroundImage : null,
  )

  return (
    <section className="relative isolate overflow-hidden bg-surface px-6 py-24 sm:py-32">
      {bg ? (
        <Image
          src={bg}
          alt=""
          fill
          priority
          className="absolute inset-0 -z-10 object-cover opacity-40"
          sizes="100vw"
        />
      ) : null}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
          {title}
        </h1>
        {block.subtitle ? (
          <p className="mt-6 text-lg text-muted">{block.subtitle}</p>
        ) : null}
        {block.cta?.text && block.cta?.url ? (
          <a
            href={block.cta.url}
            className="mt-10 inline-flex rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            {block.cta.text}
          </a>
        ) : null}
      </div>
    </section>
  )
}
