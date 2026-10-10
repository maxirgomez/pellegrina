import type { LayoutBlock, PellegrinaSiteContact } from '@tn/core'

import { CTABlock } from './CTABlock'
import { FAQBlock } from './FAQBlock'
import { FeaturesBlock } from './FeaturesBlock'
import { HeroBlock } from './HeroBlock'
import { PellegrinaDestinationBlock } from './pellegrina/PellegrinaDestinationBlock'
import { PellegrinaGuidesBlock } from './pellegrina/PellegrinaGuidesBlock'
import { PellegrinaHeroBlock } from './pellegrina/PellegrinaHeroBlock'
import { PellegrinaPassportBlock } from './pellegrina/PellegrinaPassportBlock'
import { PellegrinaPostcardsBlock } from './pellegrina/PellegrinaPostcardsBlock'
import { PellegrinaSuitcaseBlock } from './pellegrina/PellegrinaSuitcaseBlock'
import { PellegrinaValuesBlock } from './pellegrina/PellegrinaValuesBlock'
import { PellegrinaWhyBlock } from './pellegrina/PellegrinaWhyBlock'
import { PricingBlock } from './PricingBlock'
import { TestimonialsBlock } from './TestimonialsBlock'

type Props = {
  blocks: LayoutBlock[]
  contact?: PellegrinaSiteContact | null
}

export function BlockRenderer({ blocks, contact }: Props) {
  const siteContact = contact || { siteName: 'Pellegrina Viajes' }

  return (
    <>
      {blocks.map((block, index) => {
        const key = block.id || `${block.blockType}-${index}`
        switch (block.blockType) {
          case 'pellegrinaHero':
            return <PellegrinaHeroBlock key={key} block={block} />
          case 'pellegrinaWhy':
            return <PellegrinaWhyBlock key={key} block={block} />
          case 'pellegrinaPassport':
            return <PellegrinaPassportBlock key={key} block={block} />
          case 'pellegrinaValues':
            return <PellegrinaValuesBlock key={key} block={block} />
          case 'pellegrinaGuides':
            return <PellegrinaGuidesBlock key={key} block={block} />
          case 'pellegrinaSuitcase':
            return <PellegrinaSuitcaseBlock key={key} block={block} />
          case 'pellegrinaPostcards':
            return <PellegrinaPostcardsBlock key={key} block={block} />
          case 'pellegrinaDestination':
            return <PellegrinaDestinationBlock key={key} block={block} contact={siteContact} />
          case 'hero':
            return <HeroBlock key={key} block={block} />
          case 'features':
            return <FeaturesBlock key={key} block={block} />
          case 'pricing':
            return <PricingBlock key={key} block={block} />
          case 'cta':
            return <CTABlock key={key} block={block} />
          case 'testimonials':
            return <TestimonialsBlock key={key} block={block} />
          case 'faq':
            return <FAQBlock key={key} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}
