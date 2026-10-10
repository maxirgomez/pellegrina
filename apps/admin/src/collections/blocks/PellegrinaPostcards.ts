import type { Block } from 'payload'

export const PellegrinaPostcards: Block = {
  slug: 'pellegrinaPostcards',
  labels: { singular: 'Pellegrina Postcards', plural: 'Pellegrina Postcards' },
  fields: [
    { name: 'stageLabel', type: 'text' },
    { name: 'legLabel', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'fromPlace', type: 'text', required: true },
        { name: 'toPlace', type: 'text', required: true },
        { name: 'who', type: 'text', required: true },
        { name: 'quote', type: 'textarea', required: true },
      ],
    },
    { name: 'nextCardTitle', type: 'text' },
    { name: 'nextCardBody', type: 'textarea' },
    {
      name: 'nextCardCta',
      type: 'group',
      fields: [
        { name: 'text', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
