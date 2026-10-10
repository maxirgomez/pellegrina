import type { Block } from 'payload'

export const PellegrinaPassport: Block = {
  slug: 'pellegrinaPassport',
  labels: { singular: 'Pellegrina Passport', plural: 'Pellegrina Passports' },
  fields: [
    { name: 'stageLabel', type: 'text' },
    { name: 'legLabel', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'steps',
      type: 'array',
      fields: [
        { name: 'stepNumber', type: 'text', required: true },
        { name: 'stampLabel', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'richText' },
        {
          name: 'tags',
          type: 'array',
          fields: [{ name: 'label', type: 'text', required: true }],
        },
      ],
    },
  ],
}
