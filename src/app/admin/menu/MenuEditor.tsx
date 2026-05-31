'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ChevronDown, ChevronRight, GripVertical } from 'lucide-react'
import type { MenuItem } from '@/lib/menu-defaults'

const uid = () => Math.random().toString(36).slice(2, 8)
const inputCls = 'w-full border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#051c33]'
const labelCls = 'block text-xs font-medium text-[#051c33] mb-1'

function emptyItem(): MenuItem {
  return { id: uid(), label: { es: '', en: '' }, href: '' }
}

interface ItemRowProps {
  item: MenuItem
  depth: number
  onChange: (updated: MenuItem) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}

function ItemRow({ item, depth, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: ItemRowProps) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = (item.children ?? []).length > 0
  const canAddChildren = depth === 0

  function updateChild(i: number, updated: MenuItem) {
    const children = [...(item.children ?? [])]
    children[i] = updated
    onChange({ ...item, children })
  }

  function deleteChild(i: number) {
    const children = (item.children ?? []).filter((_, idx) => idx !== i)
    onChange({ ...item, children })
  }

  function addChild() {
    onChange({ ...item, children: [...(item.children ?? []), emptyItem()] })
  }

  function moveChild(i: number, dir: -1 | 1) {
    const children = [...(item.children ?? [])]
    const j = i + dir
    if (j < 0 || j >= children.length) return;
    [children[i], children[j]] = [children[j], children[i]]
    onChange({ ...item, children })
  }

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden ${depth > 0 ? 'ml-6 border-dashed' : ''}`}>
      {/* Item header */}
      <div className="flex items-center gap-2 p-3 bg-white">
        <GripVertical size={14} className="text-gray-300 flex-shrink-0" />
        {hasChildren && (
          <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
        <div className="flex-1 grid grid-cols-2 gap-2">
          <div>
            <label className={labelCls}>Etiqueta ES</label>
            <input value={item.label.es} onChange={e => onChange({ ...item, label: { ...item.label, es: e.target.value } })} className={inputCls} placeholder="Nombre en español" />
          </div>
          <div>
            <label className={labelCls}>Label EN</label>
            <input value={item.label.en} onChange={e => onChange({ ...item, label: { ...item.label, en: e.target.value } })} className={inputCls} placeholder="Name in English" />
          </div>
        </div>
        <div className="w-44 flex-shrink-0">
          <label className={labelCls}>URL</label>
          <input value={item.href} onChange={e => onChange({ ...item, href: e.target.value })} className={inputCls} placeholder="/pagina" />
        </div>
        <div className="flex flex-col gap-0.5 flex-shrink-0">
          <button onClick={onMoveUp} disabled={isFirst} className="text-gray-300 hover:text-gray-600 disabled:opacity-30 p-0.5">▲</button>
          <button onClick={onMoveDown} disabled={isLast} className="text-gray-300 hover:text-gray-600 disabled:opacity-30 p-0.5">▼</button>
        </div>
        <button onClick={onDelete} className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 p-1">
          <Trash2 size={14} />
        </button>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="px-3 pb-3 space-y-2 bg-gray-50">
          {(item.children ?? []).map((child, i) => (
            <ItemRow
              key={child.id}
              item={child}
              depth={depth + 1}
              onChange={updated => updateChild(i, updated)}
              onDelete={() => deleteChild(i)}
              onMoveUp={() => moveChild(i, -1)}
              onMoveDown={() => moveChild(i, 1)}
              isFirst={i === 0}
              isLast={i === (item.children ?? []).length - 1}
            />
          ))}
        </div>
      )}

      {/* Add child button */}
      {canAddChildren && (
        <div className={`px-3 pb-3 ${hasChildren ? '' : 'pt-0'} bg-gray-50`}>
          <button onClick={addChild} className="flex items-center gap-1 text-xs text-[#8b9fb3] hover:text-[#051c33] transition-colors">
            <Plus size={12} /> Agregar subitem
          </button>
        </div>
      )}
    </div>
  )
}

export function MenuEditor({ initialItems }: { initialItems: MenuItem[] }) {
  const router = useRouter()
  const [items, setItems] = useState<MenuItem[]>(initialItems)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function updateItem(i: number, updated: MenuItem) {
    const next = [...items]
    next[i] = updated
    setItems(next)
  }

  function deleteItem(i: number) {
    setItems(items.filter((_, idx) => idx !== i))
  }

  function moveItem(i: number, dir: -1 | 1) {
    const next = [...items]
    const j = i + dir
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]]
    setItems(next)
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    })
    setSaving(false)
    setSaved(true)
    router.refresh()
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Items */}
      <div className="space-y-3">
        {items.map((item, i) => (
          <ItemRow
            key={item.id}
            item={item}
            depth={0}
            onChange={updated => updateItem(i, updated)}
            onDelete={() => deleteItem(i)}
            onMoveUp={() => moveItem(i, -1)}
            onMoveDown={() => moveItem(i, 1)}
            isFirst={i === 0}
            isLast={i === items.length - 1}
          />
        ))}
      </div>

      {/* Add item */}
      <button
        onClick={() => setItems([...items, emptyItem()])}
        className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-[#8b9fb3]/40 rounded-xl text-sm text-[#8b9fb3] hover:border-[#051c33] hover:text-[#051c33] transition-colors w-full justify-center"
      >
        <Plus size={16} /> Agregar item al menú
      </button>

      {/* Save */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-[#051c33] text-white text-sm font-medium rounded-lg hover:bg-[#051c33]/90 disabled:opacity-60 transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar menú'}
        </button>
        {saved && <span className="text-green-600 text-sm">✅ Menú guardado — los cambios se ven en el sitio</span>}
      </div>

      <p className="text-xs text-[#8b9fb3]">
        Los items de primer nivel aparecen en la barra de navegación. Los subitems aparecen como desplegable.
      </p>
    </div>
  )
}
