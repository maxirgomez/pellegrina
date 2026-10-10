import type { Block } from 'payload'

export const PellegrinaGuides: Block = {
  slug: 'pellegrinaGuides',
  labels: { singular: 'Pellegrina Guides', plural: 'Pellegrina Guides' },
  fields: [
    { name: 'stageLabel', type: 'text' },
    { name: 'legLabel', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'richText' },
    {
      name: 'includes',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    { name: 'price', type: 'text' },
    { name: 'priceNote', type: 'text' },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'text', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'pages',
      type: 'array',
      labels: { singular: 'Guide page', plural: 'Guide pages' },
      fields: [
        { name: 'kicker', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'body', type: 'richText' },
        { name: 'note', type: 'textarea' },
      ],
    },
  ],
}
