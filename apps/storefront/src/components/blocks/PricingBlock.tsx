import type { PricingBlock as PricingBlockType } from '@tn/core'

export function PricingBlock({ block }: { block: PricingBlockType }) {
  return (
    <section id="pricing" className="bg-surface px-6 py-20">
      <div className="mx-auto max-w-5xl">
        {block.heading ? (
          <h2 className="mb-12 text-center font-display text-3xl text-ink">
            {block.heading}
          </h2>
        ) : null}
        <ul className="grid gap-6 sm:grid-cols-2">
          {(block.plans || []).map((plan, i) => (
            <li
              key={plan.id || i}
              className={`rounded-xl border p-8 ${
                plan.featured
                  ? 'border-accent bg-white shadow-md'
                  : 'border-black/10 bg-white'
              }`}
            >
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold text-accent">{plan.price}</p>
              <ul className="mt-6 space-y-2 text-sm text-muted">
                {(plan.features || []).map((f, fi) => (
                  <li key={f.id || fi}>• {f.feature}</li>
                ))}
              </ul>
              {plan.cta?.text && plan.cta?.url ? (
                <a
                  href={plan.cta.url}
                  className="mt-8 inline-flex rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white"
                >
                  {plan.cta.text}
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
