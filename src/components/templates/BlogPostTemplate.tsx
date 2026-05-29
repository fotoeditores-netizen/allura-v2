import Image from "next/image";
import { Link } from "@/navigation";
import { CTABanner } from "@/components/sections/CTABanner";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { ChevronLeft } from "lucide-react";
import type { BlogPostDetail } from "@/types/cms";

interface BlogPostTemplateProps {
  post: BlogPostDetail;
  locale: string;
}

function formatDate(isoString: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(isoString));
  } catch {
    return isoString;
  }
}

const portableTextComponents = {
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-heading text-2xl md:text-3xl text-brand-navy mt-10 mb-4 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-heading text-xl text-brand-navy mt-8 mb-3 leading-tight">
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="font-heading text-lg text-brand-navy mt-6 mb-2">
        {children}
      </h4>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="font-body text-base text-brand-silver leading-relaxed mb-5">
        {children}
      </p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-brand-blue pl-5 my-6 italic font-body text-brand-silver">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-brand-navy">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    underline: ({ children }: { children?: React.ReactNode }) => (
      <span className="underline">{children}</span>
    ),
    link: ({ value, children }: { value?: { href?: string }; children?: React.ReactNode }) => (
      <a
        href={value?.href || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-blue underline hover:text-brand-navy transition-colors"
      >
        {children}
      </a>
    ),
  },
};

export function BlogPostTemplate({ post, locale }: BlogPostTemplateProps) {
  const loc = locale as "es" | "en";
  const title = post.title?.[loc] || post.title?.es || "";
  const excerpt = post.excerpt?.[loc] || post.excerpt?.es || "";
  const bodyBlocks: PortableTextBlock[] = (post.body?.[loc] ?? []) as PortableTextBlock[];
  const featuredImageUrl = post.featuredImage?.asset?.url;
  const featuredImageAlt =
    post.featuredImage?.alt?.[loc] ||
    post.featuredImage?.alt?.es ||
    title;

  return (
    <>
      {/* Hero with featured image */}
      <section className="relative pt-40 pb-24 overflow-hidden min-h-[420px]">
        {featuredImageUrl ? (
          <Image
            src={featuredImageUrl}
            alt={featuredImageAlt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-navy" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/75 via-brand-navy/60 to-brand-navy/90" />

        <div className="relative z-10 container-allura px-6 md:px-12">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-body text-sm text-white/70 hover:text-white mb-8 transition-colors"
          >
            <ChevronLeft size={16} />
            {loc === "en" ? "Back to Blog" : "Volver al Blog"}
          </Link>

          {/* Category badges */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((cat) => (
                <span
                  key={cat._id}
                  className="font-body text-xs tracking-wide uppercase px-3 py-1 rounded-full bg-white/10 text-white"
                >
                  {cat.title?.[loc] || cat.title?.es}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white leading-tight max-w-3xl mb-6">
            {title}
          </h1>

          {/* Excerpt */}
          <p className="font-body text-base text-white/75 max-w-2xl leading-relaxed">
            {excerpt}
          </p>
        </div>
      </section>

      {/* Meta bar */}
      <section className="bg-white border-b border-brand-light">
        <div className="container-allura px-6 md:px-12 py-4 flex flex-wrap gap-6 items-center">
          <span className="font-body text-sm text-brand-silver">
            {post.publishedAt ? formatDate(post.publishedAt, locale) : ""}
          </span>
          {post.author && (
            <span className="font-body text-sm text-brand-silver">
              {loc === "en" ? "By" : "Por"} {post.author.name}
            </span>
          )}
        </div>
      </section>

      {/* Article body */}
      <section className="section-padding bg-white">
        <div className="container-allura max-w-3xl">
          {bodyBlocks.length > 0 ? (
            <PortableText
              value={bodyBlocks}
              components={portableTextComponents}
            />
          ) : (
            <p className="font-body text-brand-silver italic">
              {loc === "en"
                ? "Content not available in English yet."
                : "Contenido no disponible aún."}
            </p>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
