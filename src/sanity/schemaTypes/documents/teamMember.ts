// src/sanity/schemaTypes/documents/teamMember.ts
import { defineType, defineField } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Miembro del equipo',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({ name: 'name', title: 'Nombre completo', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({
      name: 'role', title: 'Cargo', type: 'object',
      fields: [
        { name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() },
        { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() },
      ],
    }),
    defineField({
      name: 'department', title: 'Departamento', type: 'string',
      options: { list: [{ title: 'Dental', value: 'dental' }, { title: 'Estética', value: 'aesthetic' }, { title: 'Medicina', value: 'medical' }, { title: 'Coordinación', value: 'coordination' }, { title: 'Gerencia', value: 'management' }] },
    }),
    defineField({ name: 'photo', title: 'Fotografía', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required(), fields: [{ name: 'alt', title: 'Texto alt', type: 'string', validation: (Rule) => Rule.required() }] }),
    defineField({ name: 'shortBio', title: 'Bio corta', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(200) }, { name: 'en', title: 'English', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(200) }] }),
    defineField({ name: 'fullBio', title: 'Bio completa', type: 'localePortableText' }),
    defineField({ name: 'specialties', title: 'Especialidades', type: 'array', of: [{ type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español', validation: (Rule) => Rule.required() }, { name: 'en', type: 'string', title: 'English', validation: (Rule) => Rule.required() }], preview: { select: { title: 'es' } } }], validation: (Rule) => Rule.max(5) }),
    defineField({ name: 'credentials', title: 'Credenciales / títulos', type: 'array', of: [{ type: 'string' }], validation: (Rule) => Rule.max(8) }),
    defineField({ name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url' }),
    defineField({ name: 'order', title: 'Orden de aparición', type: 'number', description: 'Menor número = aparece primero.' }),
    defineField({ name: 'isActive', title: 'Activo en el sitio', type: 'boolean', initialValue: true }),
    defineField({ name: 'isFeatured', title: 'Destacado en home', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role.es', media: 'photo' },
    prepare({ title, subtitle, media }) {
      return { title: title || 'Sin nombre', subtitle: subtitle || '', media }
    },
  },
})
