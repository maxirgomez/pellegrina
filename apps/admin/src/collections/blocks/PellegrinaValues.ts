import type { Block } from 'payload'

export const PellegrinaValues: Block = {
  slug: 'pellegrinaValues',
  labels: { singular: 'Pellegrina Values', plural: 'Pellegrina Values' },
  fields: [
    { name: 'stageLabel', type: 'text' },
    { name: 'legLabel', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'richText' },
        {
          name: 'tone',
          type: 'select',
          options: [
            { label: 'Agua', value: 'agua' },
            { label: 'Aire', value: 'aire' },
          ],
        },
      ],
    },
  ],
}
