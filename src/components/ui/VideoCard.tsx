'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { VideoItem } from '@/sanity/lib/queries'

interface VideoCardProps {
  video: VideoItem
  locale: string
}

function getEmbedUrl(platform: string, videoId: string): string {
  if (platform === 'youtube') return `https://www.youtube.com/embed/${videoId}`
  if (platform === 'vimeo') return `https://player.vimeo.com/video/${videoId}`
  return ''
}

export function VideoCard({ video, locale }: VideoCardProps) {
  const [open, setOpen] = useState(false)
  const loc = locale as 'es' | 'en'

  const title = video.title[loc] || video.title.es
  const description = video.description?.[loc] || video.description?.es
  const thumbnailUrl = video.thumbnail?.asset?.url
  const altText = video.thumbnail?.alt?.[loc] || video.thumbnail?.alt?.es || title
  const embedUrl = getEmbedUrl(video.platform, video.videoId)
  const isInstagram = video.platform === 'instagram'

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm group">
      {/* Thumbnail / Player */}
      <div className="relative aspect-video bg-brand-navy overflow-hidden">
        {open && embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={() => !isInstagram && setOpen(true)}
            aria-label={`Ver video: ${title}`}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={altText}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="absolute inset-0 bg-brand-navy/80" />
            )}
            {isInstagram ? (
              <a
                href={`https://www.instagram.com/p/${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 bg-white/90 rounded-full px-4 py-2 text-brand-navy text-sm font-body font-semibold"
                onClick={(e) => e.stopPropagation()}
              >
                Ver en Instagram ↗
              </a>
            ) : (
              <span className="relative z-10 w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-brand-navy ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            )}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-heading text-base text-brand-navy mb-1 line-clamp-2">{title}</h3>
        {description && (
          <p className="font-body text-sm text-brand-silver line-clamp-2">{description}</p>
        )}
        {video.category && (
          <span className="mt-2 inline-block px-2 py-0.5 rounded-full bg-brand-light text-brand-navy text-xs font-body">
            {video.category}
          </span>
        )}
      </div>
    </div>
  )
}
