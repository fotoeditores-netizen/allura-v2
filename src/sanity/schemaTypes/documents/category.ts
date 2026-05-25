// src/sanity/schemaTypes/documents/category.ts
import { defineType, defineField } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const category = defineType({
  name: 'category',
  title: 'Categoría de blog',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }] }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title.es', maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Descripción', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'text', rows: 2 }, { name: 'en', title: 'English', type: 'text', rows: 2 }] }),
    defineField({ name: 'color', title: 'Color (hex)', type: 'string', description: 'Ej: #8b9fb3', validation: (Rule) => Rule.custom((val: string | undefined) => { if (!val) return true; if (/^#[0-9A-Fa-f]{6}$/.test(val)) return true; return 'Formato hex requerido: #RRGGBB' }) }),
  ],
  preview: {
    select: { title: 'title.es' },
    prepare({ title }) { return { title: title || 'Sin título' } },
  },
})
