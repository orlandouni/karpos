import {defineField, defineType} from 'sanity'

export const menuSemanal = defineType({
  name: 'menuSemanal',
  title: 'Menú de la semana',
  type: 'document',
  fields: [
    defineField({
      name: 'semana',
      title: 'Texto de la semana',
      type: 'string',
      description: 'Ejemplo: "Del 30 de junio al 4 de julio"',
    }),
    defineField({
      name: 'dias',
      title: 'Días',
      type: 'array',
      of: [
        defineField({
          name: 'dia',
          title: 'Día',
          type: 'object',
          fields: [
            defineField({
              name: 'nombre',
              title: 'Día',
              type: 'string',
              options: {
                list: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
              },
            }),
            defineField({name: 'platillo', title: 'Platillo', type: 'string'}),
            defineField({name: 'descripcion', title: 'Descripción', type: 'text', rows: 2}),
            defineField({name: 'precio', title: 'Precio (MXN)', type: 'number'}),
          ],
          preview: {
            select: {title: 'platillo', subtitle: 'nombre'},
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Menú de la semana'}),
  },
})
