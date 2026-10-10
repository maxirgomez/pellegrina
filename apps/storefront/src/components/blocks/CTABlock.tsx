import type { CtaBlock as CtaBlockType } from '@tn/core'

export function CTABlock({ block }: { block: CtaBlockType }) {
  const secondary = block.variant === 'secondary'

  return (
    <section id="cta" className="px-6 py-20">
      <div
        className={`mx-auto max-w-3xl rounded-2xl px-8 py-12 text-center ${
          secondary
            ? 'border border-accent bg-white'
            : 'bg-accent text-white'
        }`}
      >
        <h2 className="font-display text-3xl">{block.title}</h2>
        {block.description ? (
          <p className={`mt-4 ${secondary ? 'text-muted' : 'text-white/90'}`}>
            {block.description}
          </p>
        ) : null}
        {block.button?.text && block.button?.url ? (
          <a
            href={block.button.url}
            className={`mt-8 inline-flex rounded-md px-6 py-3 text-sm font-semibold ${
              secondary
                ? 'bg-accent text-white'
                : 'bg-white text-accent'
            }`}
          >
            {block.button.text}
          </a>
        ) : null}
      </div>
    </section>
  )
}
