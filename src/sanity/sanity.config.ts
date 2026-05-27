import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

export const sanityConfig = defineConfig({
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  title: 'Allura Healthcare CMS',
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            // ── HOME ─────────────────────────────────────────────
            S.listItem()
              .title('🏠 Página de inicio')
              .id('homePage')
              .child(S.document().schemaType('homePage').documentId('homePage')),

            S.divider(),

            // ── CONFIGURACIÓN ────────────────────────────────────
            S.listItem()
              .title('⚙️ Configuración global')
              .child(
                S.list()
                  .title('Configuración global')
                  .items([
                    S.listItem()
                      .title('Datos del sitio')
                      .id('siteSettings')
                      .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
                    S.listItem()
                      .title('Navegación')
                      .id('navigation')
                      .child(S.document().schemaType('navigation').documentId('navigation')),
                  ])
              ),
            S.listItem()
              .title('🔍 SEO y medición')
              .child(
                S.list()
                  .title('SEO y medición')
                  .items([
                    S.listItem()
                      .title('SEO global')
                      .id('siteSettings-seo')
                      .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
                    S.listItem()
                      .title('Scripts y analítica')
                      .id('trackingScripts')
                      .child(S.document().schemaType('trackingScripts').documentId('trackingScripts')),
                  ])
              ),

            S.divider(),

            // ── CONTENIDO PRINCIPAL ───────────────────────────────
            S.documentTypeListItem('page').title('📄 Páginas'),
            S.listItem()
              .title('🦷 Servicios')
              .child(
                S.list()
                  .title('Servicios')
                  .items([
                    S.documentTypeListItem('serviceCategory').title('Categorías'),
                    S.documentTypeListItem('service').title('Servicios'),
                  ])
              ),
            S.listItem()
              .title('📝 Blog')
              .child(
                S.list()
                  .title('Blog')
                  .items([
                    S.documentTypeListItem('blogPost').title('Entradas'),
                    S.documentTypeListItem('category').title('Categorías'),
                  ])
              ),

            S.divider(),

            // ── SOCIAL PROOF Y MEDIA ──────────────────────────────
            S.documentTypeListItem('testimonial').title('⭐ Testimonios'),
            S.documentTypeListItem('faq').title('❓ Preguntas frecuentes'),
            S.documentTypeListItem('galleryItem').title('🖼️ Galería'),
            S.documentTypeListItem('video').title('🎬 Videos'),
            S.documentTypeListItem('caseStudy').title('🏆 Casos de éxito'),
            S.documentTypeListItem('teamMember').title('👥 Equipo'),

            S.divider(),

            // ── MARKETING ─────────────────────────────────────────
            S.listItem()
              .title('🎯 Promociones y popups')
              .child(
                S.list()
                  .title('Promociones y popups')
                  .items([
                    S.documentTypeListItem('promotion').title('Promociones'),
                    S.documentTypeListItem('popup').title('Popups'),
                  ])
              ),

            S.divider(),
          ]),
    }),
    visionTool(),
  ],
})
