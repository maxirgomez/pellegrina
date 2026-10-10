import type { Block } from 'payload'

export const PellegrinaHero: Block = {
  slug: 'pellegrinaHero',
  labels: { singular: 'Pellegrina Hero', plural: 'Pellegrina Heroes' },
  fields: [
    { name: 'stageLabel', type: 'text' },
    { name: 'greeting', type: 'text' },
    {
      name: 'typedTitle',
      type: 'text',
      required: true,
      admin: { description: 'Plain string for typewriter / h1 fallback' },
    },
    { name: 'signature', type: 'text' },
    { name: 'stampAlt', type: 'text' },
    {
      name: 'stampImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'addressLines',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'lead', type: 'richText' },
    {
      name: 'primaryCta',
      type: 'group',
      fields: [
        { name: 'text', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'secondaryCta',
      type: 'group',
      fields: [
        { name: 'text', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'chips',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'color',
          type: 'select',
          options: [
            { label: 'Agua', value: 'agua' },
            { label: 'Aire', value: 'aire' },
            { label: 'Tierra', value: 'tierra' },
          ],
        },
      ],
    },
    {
      name: 'globeImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
