import Image from 'next/image'
import type { TestimonialsBlock as TestimonialsBlockType } from '@tn/core'

import { mediaUrl } from '@/lib/payload'

export function TestimonialsBlock({ block }: { block: TestimonialsBlockType }) {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl">
        {block.heading ? (
          <h2 className="mb-12 text-center font-display text-3xl text-ink">
            {block.heading}
          </h2>
        ) : null}
        <ul className="grid gap-8 sm:grid-cols-2">
          {(block.items || []).map((item, i) => {
            const avatar = mediaUrl(typeof item.avatar === 'object' ? item.avatar : null)
            return (
              <li key={item.id || i} className="rounded-xl bg-surface p-6">
                <blockquote className="text-ink">&ldquo;{item.quote}&rdquo;</blockquote>
                <div className="mt-4 flex items-center gap-3">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold">
                      {item.name.slice(0, 1)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    {item.role ? <p className="text-sm text-muted">{item.role}</p> : null}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
