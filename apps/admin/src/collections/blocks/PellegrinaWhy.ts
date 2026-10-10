import type { Block } from 'payload'

export const PellegrinaWhy: Block = {
  slug: 'pellegrinaWhy',
  labels: { singular: 'Pellegrina Why', plural: 'Pellegrina Why' },
  fields: [
    { name: 'stageLabel', type: 'text' },
    { name: 'legLabel', type: 'text' },
    { name: 'word', type: 'text' },
    { name: 'pronunciation', type: 'text' },
    { name: 'dictionaryBody', type: 'richText' },
    { name: 'heading', type: 'text' },
    { name: 'highlight', type: 'text' },
    { name: 'body', type: 'richText' },
  ],
}
