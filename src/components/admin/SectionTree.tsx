'use client'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { getSectionDef } from '@/lib/section-registry'
import type { SectionRow } from '@/lib/supabase/pages'

interface SectionTreeProps {
  sections: SectionRow[]
  activeSectionId: string | null
  onSelect: (section: SectionRow) => void
  onToggleVisible: (id: string, visible: boolean) => void
  onDelete: (id: string) => void
  onReorder: (sections: SectionRow[]) => void
  onAddSection: () => void
}

function SortableItem({
  section,
  isActive,
  onSelect,
  onToggleVisible,
  onDelete,
}: {
  section: SectionRow
  isActive: boolean
  onSelect: () => void
  onToggleVisible: (visible: boolean) => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: section.id,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }
  const def = getSectionDef(section.type)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm mb-1 transition-colors ${
        isActive
          ? 'border-[#051c33] bg-[#051c33]/5'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-400 hover:text-gray-600 select-none px-1"
        onClick={e => e.stopPropagation()}
      >
        ☰
      </span>
      <span className="text-base">{def?.icon ?? '📄'}</span>
      <span className={`flex-1 font-medium truncate ${isActive ? 'text-[#051c33]' : 'text-gray-700'}`}>
        {section.type === 'custom' && (section.settings as Record<string, unknown>)?.internalName
          ? String((section.settings as Record<string, unknown>).internalName)
          : def?.label ?? section.type}
      </span>
      <button
        onClick={e => {
          e.stopPropagation()
          onToggleVisible(!section.is_visible)
        }}
        className="text-gray-400 hover:text-gray-700 text-xs px-1 flex-shrink-0"
        title={section.is_visible ? 'Ocultar sección' : 'Mostrar sección'}
      >
        {section.is_visible ? '👁' : '🚫'}
      </button>
      <button
        onClick={e => {
          e.stopPropagation()
          if (confirm('¿Eliminar esta sección? Esta acción no se puede deshacer.')) {
            onDelete()
          }
        }}
        className="text-red-400 hover:text-red-600 text-xs px-1 flex-shrink-0"
        title="Eliminar sección"
      >
        🗑️
      </button>
    </div>
  )
}

export function SectionTree({
  sections,
  activeSectionId,
  onSelect,
  onToggleVisible,
  onDelete,
  onReorder,
  onAddSection,
}: SectionTreeProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sections.findIndex(s => s.id === active.id)
    const newIndex = sections.findIndex(s => s.id === over.id)
    const reordered = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({
      ...s,
      sort_order: i,
    }))
    onReorder(reordered)
  }

  return (
    <div>
      <button
        onClick={onAddSection}
        className="w-full mb-3 py-2 px-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#051c33] hover:text-[#051c33] transition-colors"
      >
        + Agregar sección
      </button>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sections.map(section => (
            <SortableItem
              key={section.id}
              section={section}
              isActive={section.id === activeSectionId}
              onSelect={() => onSelect(section)}
              onToggleVisible={v => onToggleVisible(section.id, v)}
              onDelete={() => onDelete(section.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {sections.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-6">
          No hay secciones aún.
          <br />
          Haz clic en &quot;+ Agregar sección&quot;.
        </p>
      )}
    </div>
  )
}
