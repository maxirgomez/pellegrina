import type { FaqBlock as FaqBlockType } from '@tn/core'

export function FAQBlock({ block }: { block: FaqBlockType }) {
  return (
    <section className="bg-surface px-6 py-20">
      <div className="mx-auto max-w-3xl">
        {block.heading ? (
          <h2 className="mb-10 text-center font-display text-3xl text-ink">
            {block.heading}
          </h2>
        ) : null}
        <div className="space-y-3">
          {(block.items || []).map((item, i) => (
            <details
              key={item.id || i}
              className="group rounded-lg border border-black/10 bg-white px-4 py-3"
            >
              <summary className="cursor-pointer list-none font-medium text-ink marker:content-none">
                {item.question}
              </summary>
              <p className="mt-2 text-sm text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
