import type { CollectionConfig } from 'payload'

import { CTA } from './blocks/CTA'
import { FAQ } from './blocks/FAQ'
import { Features } from './blocks/Features'
import { Hero } from './blocks/Hero'
import { PellegrinaDestination } from './blocks/PellegrinaDestination'
import { PellegrinaGuides } from './blocks/PellegrinaGuides'
import { PellegrinaHero } from './blocks/PellegrinaHero'
import { PellegrinaPassport } from './blocks/PellegrinaPassport'
import { PellegrinaPostcards } from './blocks/PellegrinaPostcards'
import { PellegrinaSuitcase } from './blocks/PellegrinaSuitcase'
import { PellegrinaValues } from './blocks/PellegrinaValues'
import { PellegrinaWhy } from './blocks/PellegrinaWhy'
import { Pricing } from './blocks/Pricing'
import { Testimonials } from './blocks/Testimonials'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data || typeof data.slug !== 'string') return data
        const normalized = data.slug.replace(/^\/+|\/+$/g, '')
        data.slug = normalized === '' ? 'home' : normalized
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Usá "home" para la portada (/). No uses "/".',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        PellegrinaHero,
        PellegrinaWhy,
        PellegrinaPassport,
        PellegrinaValues,
        PellegrinaGuides,
        PellegrinaSuitcase,
        PellegrinaPostcards,
        PellegrinaDestination,
        // Legacy Tierra Noble demo blocks
        Hero,
        Features,
        Pricing,
        CTA,
        Testimonials,
        FAQ,
      ],
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
