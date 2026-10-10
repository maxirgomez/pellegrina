import type { PellegrinaSuitcaseBlock as Block } from '@tn/core'

import { SuitcaseSection } from './SuitcaseSection'

export function PellegrinaSuitcaseBlock({ block }: { block: Block }) {
  return (
    <section className="sec bag" id="valija" data-stage={block.stageLabel || 'Valija'}>
      <div className="wrap">
        <SuitcaseSection block={block} />
      </div>
    </section>
  )
}
