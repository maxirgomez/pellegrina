import type { Block } from 'payload'

export const PellegrinaDestination: Block = {
  slug: 'pellegrinaDestination',
  labels: { singular: 'Pellegrina Destination', plural: 'Pellegrina Destinations' },
  fields: [
    { name: 'stageLabel', type: 'text' },
    { name: 'legLabel', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'ways',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        {
          name: 'tone',
          type: 'select',
          options: [
            { label: 'Agua', value: 'agua' },
            { label: 'Aire', value: 'aire' },
            { label: 'Tierra', value: 'tierra' },
          ],
        },
        {
          name: 'whatsapp',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Link using site settings WhatsApp number' },
        },
      ],
    },
    {
      name: 'formEnabled',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
