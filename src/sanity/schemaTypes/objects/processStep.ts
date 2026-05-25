// src/sanity/schemaTypes/objects/processStep.ts
import { defineType, defineField } from 'sanity'

export const processStep = defineType({
  name: 'processStep',
  title: 'Paso del proceso',
  type: 'object',
  fields: [
    defineField({
      name: 'stepNumber',
      title: 'Número de paso',
      type: 'string',
      description: 'Ej: 01, 02, 03',
      validation: (Rule) => Rule.required().max(3),
    }),
    defineField({
      name: 'title',
      title: 'Título del paso',
      type: 'object',
      fields: [
        { name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required().max(80) },
        { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required().max(80) },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'object',
      fields: [
        { name: 'es', title: 'Español', type: 'text', rows: 3, validation: (Rule) => Rule.required() },
        { name: 'en', title: 'English', type: 'text', rows: 3, validation: (Rule) => Rule.required() },
      ],
    }),
    defineField({
      name: 'image',
      title: 'Imagen del paso',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'duration',
      title: 'Duración estimada',
      type: 'object',
      description: 'Opcional. Ej: "3–5 días en Medellín"',
      fields: [
        { name: 'es', title: 'Español', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
    }),
  ],
  preview: {
    select: { step: 'stepNumber', title: 'title.es' },
    prepare({ step, title }) {
      return { title: `Paso ${step ?? '?'}: ${title ?? 'Sin título'}` }
    },
  },
})
