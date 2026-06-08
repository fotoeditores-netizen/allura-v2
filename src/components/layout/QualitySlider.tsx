"use client";

import Image from "next/image";

type LogoItem = { src: string; alt: string }

const DEFAULT_LOGOS: LogoItem[] = [
  { src: "/images/imagenes_web/ITI-transparent-logo.png",                        alt: "ITI – International Team for Implantology" },
  { src: "/images/imagenes_web/sco-sociedad-colombiana-de-ortodoncia.png",        alt: "SCO – Sociedad Colombiana de Ortodoncia" },
  { src: "/images/imagenes_web/asociacion-colombiana-de-prostodoncia.png",        alt: "Asociación Colombiana de Prostodoncia" },
  { src: "/images/imagenes_web/american-association-of-orthodondists.png",        alt: "American Association of Orthodontists" },
  { src: "/images/imagenes_web/world-federation-of-orthodontists.png",            alt: "World Federation of Orthodontists" },
  { src: "/images/imagenes_web/ProColombia.png",                                  alt: "ProColombia" },
  { src: "/images/imagenes_web/greater-medellin-convention-&-visitors-bureau.png", alt: "Greater Medellín Convention & Visitors Bureau" },
  { src: "/images/imagenes_web/anato-antioquia-choco.png",                        alt: "ANATO Antioquia Chocó" },
  { src: "/images/imagenes_web/marca-pais-colombia.png",                          alt: "Marca País Colombia" },
];

function parseLogos(raw: string | undefined): LogoItem[] {
  if (!raw) return DEFAULT_LOGOS
  try {
    const parsed = JSON.parse(raw) as LogoItem[]
    return parsed.length > 0 ? parsed : DEFAULT_LOGOS
  } catch {
    return DEFAULT_LOGOS
  }
}

export function QualitySlider({ qualityLogos }: { qualityLogos?: string }) {
  const logos = parseLogos(qualityLogos)
  const track = [...logos, ...logos]

  return (
    <>
      <div className="quality-wrapper overflow-hidden w-full">
        <div
          className="quality-track flex items-center"
          style={{ gap: "var(--gap)" }}
        >
          {track.map(({ src, alt }, i) => (
            <div
              key={`${alt}-${i}`}
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: "var(--item-w)", height: "88px" }}
            >
              <Image
                src={src}
                alt={alt}
                width={240}
                height={88}
                className="max-h-full w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
