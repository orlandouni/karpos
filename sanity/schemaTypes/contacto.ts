import {defineField, defineType} from 'sanity'

export const contacto = defineType({
  name: 'contacto',
  title: 'Datos de contacto',
  type: 'document',
  fields: [
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp (10 dígitos, sin lada de país)',
      type: 'string',
      description: 'Ejemplo: 6531234567',
    }),
    defineField({name: 'telefono', title: 'Teléfono', type: 'string'}),
    defineField({name: 'direccion', title: 'Dirección', type: 'text', rows: 2}),
    defineField({
      name: 'horario',
      title: 'Horario',
      type: 'string',
      description: 'Ejemplo: "Lunes a viernes, 12:00 a 5:00 pm"',
    }),
    defineField({name: 'facebook', title: 'Facebook (URL)', type: 'url'}),
    defineField({name: 'instagram', title: 'Instagram (URL)', type: 'url'}),
  ],
  preview: {
    prepare: () => ({title: 'Datos de contacto'}),
  },
})
