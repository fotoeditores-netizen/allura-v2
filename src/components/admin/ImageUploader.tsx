'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploaderProps {
  folder: 'services' | 'blog' | 'team' | 'gallery' | 'site' | 'popups'
  currentUrl?: string
  onUpload: (url: string, path: string) => void
  label?: string
}

export function ImageUploader({
  folder,
  currentUrl,
  onUpload,
  label = 'Subir imagen',
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError(null)
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', folder)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Error al subir imagen')
      setPreview(json.url)
      onUpload(json.url, json.path)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al subir imagen')
    } finally {
      setLoading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-2">
      {preview && (
        <div className="relative w-40 h-32 rounded-lg overflow-hidden border border-[#8b9fb3]/30">
          <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      )}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-[#8b9fb3]/40 rounded-lg p-4 text-center hover:border-[#8b9fb3] transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          className="hidden"
          onChange={e => {
            if (e.target.files?.[0]) handleFile(e.target.files[0])
          }}
        />
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-[#8b9fb3]">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Subiendo...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-[#8b9fb3]">
            <Upload size={16} />
            <span className="text-sm">{label}</span>
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  )
}
