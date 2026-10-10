/** Shared block contract for storefront + admin. Pellegrina landing (maqueta). */

export type MediaRef = {
  id: number | string
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  filename?: string | null
}

export type CtaLink = {
  text: string
  url: string
}

/** Lexical richText JSON from Payload (or pre-serialized). */
export type LexicalDoc = unknown

export type ChipItem = {
  id?: string
  label: string
  color?: 'agua' | 'aire' | 'tierra' | null
}

export type PellegrinaHeroBlock = {
  blockType: 'pellegrinaHero'
  id?: string
  stageLabel?: string | null
  greeting?: string | null
  /** Plain string used by typewriter; also shown as h1 fallback */
  typedTitle: string
  signature?: string | null
  stampAlt?: string | null
  stampImage?: MediaRef | number | string | null
  addressLines?: { id?: string; label: string; value: string }[] | null
  lead?: LexicalDoc | string | null
  primaryCta?: CtaLink | null
  secondaryCta?: CtaLink | null
  chips?: ChipItem[] | null
  globeImage?: MediaRef | number | string | null
}

export type PellegrinaWhyBlock = {
  blockType: 'pellegrinaWhy'
  id?: string
  stageLabel?: string | null
  legLabel?: string | null
  word?: string | null
  pronunciation?: string | null
  dictionaryBody?: LexicalDoc | string | null
  heading?: string | null
  highlight?: string | null
  body?: LexicalDoc | string | null
}

export type PassportStep = {
  id?: string
  stepNumber: string
  stampLabel: string
  title: string
  description?: LexicalDoc | string | null
  tags?: { id?: string; label: string }[] | null
}

export type PellegrinaPassportBlock = {
  blockType: 'pellegrinaPassport'
  id?: string
  stageLabel?: string | null
  legLabel?: string | null
  heading?: string | null
  intro?: string | null
  steps?: PassportStep[] | null
}

export type ValueItem = {
  id?: string
  title: string
  description?: LexicalDoc | string | null
  tone?: 'agua' | 'aire' | null
}

export type PellegrinaValuesBlock = {
  blockType: 'pellegrinaValues'
  id?: string
  stageLabel?: string | null
  legLabel?: string | null
  heading?: string | null
  items?: ValueItem[] | null
}

export type GuidePage = {
  id?: string
  kicker?: string | null
  title?: string | null
  body?: LexicalDoc | string | null
  note?: string | null
}

export type PellegrinaGuidesBlock = {
  blockType: 'pellegrinaGuides'
  id?: string
  stageLabel?: string | null
  legLabel?: string | null
  heading?: string | null
  body?: LexicalDoc | string | null
  includes?: { id?: string; item: string }[] | null
  price?: string | null
  priceNote?: string | null
  cta?: CtaLink | null
  pages?: GuidePage[] | null
}

export type PackingItem = {
  id?: string
  label: string
}

export type PackingCategory = {
  id?: string
  name: string
  season: 'verano' | 'invierno' | 'ambas'
  items?: PackingItem[] | null
}

export type PellegrinaSuitcaseBlock = {
  blockType: 'pellegrinaSuitcase'
  id?: string
  stageLabel?: string | null
  legLabel?: string | null
  heading?: string | null
  intro?: string | null
  tipMessage?: string | null
  doneCtaLabel?: string | null
  doneCtaSub?: string | null
  footerNote?: LexicalDoc | string | null
  categories?: PackingCategory[] | null
}

export type PostcardItem = {
  id?: string
  fromPlace: string
  toPlace: string
  who: string
  quote: string
}

export type PellegrinaPostcardsBlock = {
  blockType: 'pellegrinaPostcards'
  id?: string
  stageLabel?: string | null
  legLabel?: string | null
  heading?: string | null
  items?: PostcardItem[] | null
  nextCardTitle?: string | null
  nextCardBody?: string | null
  nextCardCta?: CtaLink | null
}

export type ContactWay = {
  id?: string
  title: string
  description?: string | null
  tone?: 'agua' | 'aire' | 'tierra' | null
  /** If set, renders as WhatsApp link using site settings number */
  whatsapp?: boolean | null
}

export type PellegrinaDestinationBlock = {
  blockType: 'pellegrinaDestination'
  id?: string
  stageLabel?: string | null
  legLabel?: string | null
  heading?: string | null
  intro?: string | null
  ways?: ContactWay[] | null
  formEnabled?: boolean | null
}

/** @deprecated Tierra Noble demo blocks — kept for existing content */
export type HeroBlock = {
  blockType: 'hero'
  id?: string
  title?: LexicalDoc
  subtitle?: string | null
  cta?: CtaLink | null
  backgroundImage?: MediaRef | number | string | null
}

export type FeatureItem = {
  id?: string
  icon?: string | null
  title: string
  description?: string | null
}

export type FeaturesBlock = {
  blockType: 'features'
  id?: string
  heading?: string | null
  items?: FeatureItem[] | null
}

export type PricingPlan = {
  id?: string
  name: string
  price: string
  features?: { id?: string; feature: string }[] | null
  cta?: CtaLink | null
  featured?: boolean | null
}

export type PricingBlock = {
  blockType: 'pricing'
  id?: string
  heading?: string | null
  plans?: PricingPlan[] | null
}

export type CtaBlock = {
  blockType: 'cta'
  id?: string
  title: string
  description?: string | null
  button?: CtaLink | null
  variant?: 'primary' | 'secondary' | null
}

export type TestimonialItem = {
  id?: string
  name: string
  role?: string | null
  quote: string
  avatar?: MediaRef | number | string | null
}

export type TestimonialsBlock = {
  blockType: 'testimonials'
  id?: string
  heading?: string | null
  items?: TestimonialItem[] | null
}

export type FaqItem = {
  id?: string
  question: string
  answer: string
}

export type FaqBlock = {
  blockType: 'faq'
  id?: string
  heading?: string | null
  items?: FaqItem[] | null
}

export type LayoutBlock =
  | PellegrinaHeroBlock
  | PellegrinaWhyBlock
  | PellegrinaPassportBlock
  | PellegrinaValuesBlock
  | PellegrinaGuidesBlock
  | PellegrinaSuitcaseBlock
  | PellegrinaPostcardsBlock
  | PellegrinaDestinationBlock
  | HeroBlock
  | FeaturesBlock
  | PricingBlock
  | CtaBlock
  | TestimonialsBlock
  | FaqBlock

export type CmsPage = {
  id: number | string
  title: string
  slug: string
  layout?: LayoutBlock[] | null
  meta?: {
    title?: string | null
    description?: string | null
  } | null
}

/** Site-wide contact used by WA buttons / form (globals). */
export type PellegrinaSiteContact = {
  siteName: string
  whatsappNumber?: string | null
  whatsappDefaultMessage?: string | null
  contactEmail?: string | null
  instagramUrl?: string | null
}
