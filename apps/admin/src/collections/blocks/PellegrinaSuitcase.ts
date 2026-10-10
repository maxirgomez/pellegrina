import type { Block } from 'payload'

export const PellegrinaSuitcase: Block = {
  slug: 'pellegrinaSuitcase',
  labels: { singular: 'Pellegrina Suitcase', plural: 'Pellegrina Suitcases' },
  fields: [
    { name: 'stageLabel', type: 'text' },
    { name: 'legLabel', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    { name: 'tipMessage', type: 'textarea' },
    { name: 'doneCtaLabel', type: 'text' },
    { name: 'doneCtaSub', type: 'text' },
    { name: 'footerNote', type: 'richText' },
    {
      name: 'categories',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'season',
          type: 'select',
          required: true,
          defaultValue: 'ambas',
          options: [
            { label: 'Verano', value: 'verano' },
            { label: 'Invierno', value: 'invierno' },
            { label: 'Ambas', value: 'ambas' },
          ],
        },
        {
          name: 'items',
          type: 'array',
          fields: [{ name: 'label', type: 'text', required: true }],
        },
      ],
    },
  ],
}
