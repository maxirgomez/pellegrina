import type { Block } from 'payload'

export const Pricing: Block = {
  slug: 'pricing',
  labels: { singular: 'Pricing', plural: 'Pricing' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'plans',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'price', type: 'text', required: true },
        {
          name: 'features',
          type: 'array',
          fields: [{ name: 'feature', type: 'text', required: true }],
        },
        {
          name: 'cta',
          type: 'group',
          fields: [
            { name: 'text', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
        { name: 'featured', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
