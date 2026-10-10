import type { FeaturesBlock as FeaturesBlockType } from '@tn/core'

export function FeaturesBlock({ block }: { block: FeaturesBlockType }) {
  return (
    <section id="features" className="bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl">
        {block.heading ? (
          <h2 className="mb-12 text-center font-display text-3xl text-ink">
            {block.heading}
          </h2>
        ) : null}
        <ul className="grid gap-8 sm:grid-cols-3">
          {(block.items || []).map((item, i) => (
            <li key={item.id || i} className="text-center">
              {item.icon ? <div className="mb-3 text-3xl">{item.icon}</div> : null}
              <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
              {item.description ? (
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
