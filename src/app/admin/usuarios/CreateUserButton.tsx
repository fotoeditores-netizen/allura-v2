'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'

export function CreateUserButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('editor')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const res = await fetch('/api/admin/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error ?? 'Error al crear usuario'); setSaving(false); return }
    setOpen(false)
    setEmail('')
    setPassword('')
    setRole('editor')
    router.refresh()
    setSaving(false)
  }

  const inputCls = 'w-full border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#051c33]'
  const labelCls = 'block text-sm font-medium text-[#051c33] mb-1'

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-[#051c33] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#051c33]/90 transition-colors"
      >
        <Plus size={16} /> Nuevo usuario
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#051c33]">Crear nuevo usuario</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className={labelCls}>Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputCls} placeholder="usuario@ejemplo.com" />
              </div>
              <div>
                <label className={labelCls}>Contraseña *</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className={inputCls} placeholder="Mínimo 6 caracteres" />
              </div>
              <div>
                <label className={labelCls}>Rol</label>
                <select value={role} onChange={e => setRole(e.target.value)} className={inputCls}>
                  <option value="editor">Editor — puede editar contenido</option>
                  <option value="admin">Admin — acceso completo</option>
                </select>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-[#051c33] text-white py-2 rounded-lg text-sm disabled:opacity-60 hover:bg-[#051c33]/90 transition-colors">
                  {saving ? 'Creando...' : 'Crear usuario'}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border border-[#8b9fb3]/40 rounded-lg text-sm text-[#051c33] hover:bg-[#eaeeef] transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
