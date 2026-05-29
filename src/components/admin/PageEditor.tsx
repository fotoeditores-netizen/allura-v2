// src/components/admin/PageEditor.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PageRow, SectionRow } from '@/lib/supabase/pages'
import { SECTION_REGISTRY } from '@/lib/section-registry'
import { SectionTree } from './SectionTree'
import { SectionFormRouter } from './SectionFormRouter'

interface PageEditorProps {
  page: PageRow
  initialSections: SectionRow[]
}

export function PageEditor({ page, initialSections }: PageEditorProps) {
  const router = useRouter()
  const [sections, setSections] = useState<SectionRow[]>(initialSections)
  const [activeSection, setActiveSection] = useState<SectionRow | null>(null)
  const [activeSettings, setActiveSettings] = useState<Record<string, unknown>>({})
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [previewKey, setPreviewKey] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)

  const previewUrl = `http://localhost:3000/es${page.slug === '/' ? '' : page.slug}?preview=true`

  function handleSelect(section: SectionRow) {
    setActiveSection(section)
    setActiveSettings(section.settings ?? {})
    setMessage(null)
  }

  async function handleSave() {
    if (!activeSection) return
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...activeSection, settings: activeSettings }),
      })
      if (!res.ok) throw new Error('Error al guardar')
      const updated: SectionRow = await res.json()
      setSections(prev => prev.map(s => s.id === updated.id ? updated : s))
      setActiveSection(updated)
      setPreviewKey(k => k + 1)
      setMessage('✅ Guardado correctamente')
    } catch {
      setMessage('❌ Error al guardar. Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleVisible(id: string, visible: boolean) {
    const section = sections.find(s => s.id === id)
    if (!section) return
    const res = await fetch('/api/admin/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...section, is_visible: visible }),
    })
    if (res.ok) {
      setSections(prev => prev.map(s => s.id === id ? { ...s, is_visible: visible } : s))
      if (activeSection?.id === id) setActiveSection(prev => prev ? { ...prev, is_visible: visible } : prev)
      setPreviewKey(k => k + 1)
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/sections?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setSections(prev => prev.filter(s => s.id !== id))
      if (activeSection?.id === id) {
        setActiveSection(null)
        setActiveSettings({})
      }
      setPreviewKey(k => k + 1)
    }
  }

  async function handleReorder(reordered: SectionRow[]) {
    setSections(reordered)
    await fetch('/api/admin/sections/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reordered.map(s => ({ id: s.id, sort_order: s.sort_order }))),
    })
    setPreviewKey(k => k + 1)
  }

  async function handleAddSection(type: string) {
    const def = SECTION_REGISTRY.find(d => d.type === type)
    if (!def) return
    setShowAddModal(false)
    const res = await fetch('/api/admin/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_id: page.id,
        type,
        sort_order: sections.length,
        is_visible: true,
        settings: def.defaultSettings,
      }),
    })
    if (res.ok) {
      const newSection: SectionRow = await res.json()
      setSections(prev => [...prev, newSection])
      handleSelect(newSection)
      setPreviewKey(k => k + 1)
    }
  }

  async function handlePublish() {
    setPublishing(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/pages/${page.id}/publish`, { method: 'POST' })
      if (!res.ok) throw new Error('Error al publicar')
      setMessage('🚀 Página publicada')
      router.refresh()
    } catch {
      setMessage('❌ Error al publicar')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left panel */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col overflow-hidden flex-shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/paginas')}
            className="text-gray-400 hover:text-gray-700 text-sm flex-shrink-0"
          >
            ← Volver
          </button>
          <span className="text-sm font-semibold text-[#051c33] truncate">
            {page.title_i18n?.es ?? page.slug}
          </span>
        </div>

        {/* Section tree + form */}
        <div className="flex-1 overflow-y-auto p-4">
          <SectionTree
            sections={sections}
            activeSectionId={activeSection?.id ?? null}
            onSelect={handleSelect}
            onToggleVisible={handleToggleVisible}
            onDelete={handleDelete}
            onReorder={handleReorder}
            onAddSection={() => setShowAddModal(true)}
          />

          {activeSection && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3 tracking-wide">
                {SECTION_REGISTRY.find(d => d.type === activeSection.type)?.icon}{' '}
                {SECTION_REGISTRY.find(d => d.type === activeSection.type)?.label ?? activeSection.type}
              </p>
              <SectionFormRouter
                type={activeSection.type}
                settings={activeSettings}
                onChange={setActiveSettings}
              />
              {message && (
                <p className="text-xs mt-2 py-1">{message}</p>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-3 w-full py-2 bg-[#051c33] text-white text-sm font-medium rounded-lg hover:bg-[#051c33]/90 disabled:opacity-60 transition-colors"
              >
                {saving ? 'Guardando...' : 'Guardar sección'}
              </button>
            </div>
          )}
        </div>

        {/* Publish button */}
        <div className="p-4 border-t border-gray-100">
          {message && !activeSection && (
            <p className="text-xs mb-2">{message}</p>
          )}
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="w-full py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-60 transition-colors"
          >
            {publishing ? 'Publicando...' : '🚀 Publicar página'}
          </button>
        </div>
      </div>

      {/* Right panel — iframe preview */}
      <div className="flex-1 bg-gray-100 overflow-hidden">
        <iframe
          key={previewKey}
          src={previewUrl}
          className="w-full h-full border-0"
          title={`Preview: ${page.slug}`}
        />
      </div>

      {/* Add section modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-[#051c33] mb-4">Agregar sección</h2>
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
              {SECTION_REGISTRY.map(def => (
                <button
                  key={def.type}
                  onClick={() => handleAddSection(def.type)}
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl hover:border-[#051c33] hover:bg-[#051c33]/5 text-sm text-left transition-colors"
                >
                  <span className="text-xl flex-shrink-0">{def.icon}</span>
                  <span className="text-gray-700 font-medium leading-tight">{def.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
