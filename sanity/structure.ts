import type {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('KARPOS')
    .items([
      S.listItem()
        .title('Menú de la semana')
        .id('menuSemanal')
        .child(S.document().schemaType('menuSemanal').documentId('menuSemanal')),
      S.listItem()
        .title('Datos de contacto')
        .id('contacto')
        .child(S.document().schemaType('contacto').documentId('contacto')),
    ])
