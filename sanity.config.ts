'use client'

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

const singletonTypes = new Set(['menuSemanal', 'contacto'])

export default defineConfig({
  name: 'karpos',
  title: 'KARPOS · Panel',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: '/studio',
  plugins: [structureTool({structure}), visionTool()],
  schema: {
    types: schemaTypes,
    // Oculta los dos tipos del botón "crear nuevo" para que tu mamá
    // solo edite los documentos que ya existen.
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (input, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? input.filter(({action}) => action !== 'unpublish' && action !== 'delete' && action !== 'duplicate')
        : input,
  },
})
