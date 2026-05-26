# Blog / Noticias Sanity Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the Blog/Noticias section of Allura Healthcare to Sanity CMS, rendering published posts at `/es/blog` and `/en/blog` with category filtering via URL params, ISR, and full bilingual support.

**Architecture:** Two new async server-component templates (`BlogListTemplate`, `BlogPostTemplate`) receive Sanity data as props — same pattern as `ServiceCategoryTemplate`/`ServiceDetailTemplate`. The existing `blog/page.tsx` is replaced with a Sanity-powered version; a new `blog/[slug]/page.tsx` handles detail. Schemas (`blogPost`, `category`) already exist and require no changes.

**Tech Stack:** Next.js 14 App Router · next-intl · Sanity v3 / next-sanity@9 · GROQ · `@portabletext/react` (transitive dep of next-sanity) · ISR (`revalidate=0` dev / `3600` prod) · Tailwind CSS

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/sanity/lib/queries.ts` | Modify (append) | 3 new types + 4 new GROQ queries |
| `src/components/templates/BlogListTemplate.tsx` | Create | Blog listing UI: hero, category filter links, post grid, empty state |
| `src/components/templates/BlogPostTemplate.tsx` | Create | Post detail UI: featured image hero, meta bar, portable text body |
| `src/app/[locale]/blog/page.tsx` | Replace | Listing page: fetch categories + posts, pass to template |
| `src/app/[locale]/blog/[slug]/page.tsx` | Create | Detail page: fetch post, generateMetadata, generateStaticParams |

---

## Task 1: Add GROQ queries and TypeScript types

**Files:**
- Modify: `src/sanity/lib/queries.ts` (append after line 366)

### Context
The file already exports `serviceCategoryBySlugQuery`, `serviceBySlugQuery`, and related types. Append the blog types and queries at the end. Do not touch existing code.

- [ ] **Step 1: Open `src/sanity/lib/queries.ts` and append the following block at the very end of the file**

```typescript
// ─── Blog ────────────────────────────────────────────────────────────────────

export interface BlogCategory {
  _id: string
  title: LocaleString
  slug: { current: string }
  color?: string
}

export interface BlogPostListItem {
  _id: string
  title: LocaleString
  slug: { current: string }
  excerpt: LocaleString
  publishedAt: string
  featuredImage?: SanityImageLocaleAlt
  categories?: BlogCategory[]
  author?: { name: string }
}

export interface BlogPostDetail {
  _id: string
  title: LocaleString
  slug: { current: string }
  excerpt: LocaleString
  publishedAt: string
  featuredImage?: SanityImageLocaleAlt
  body?: {
    es: import('@portabletext/types').PortableTextBlock[]
    en: import('@portabletext/types').PortableTextBlock[]
  }
  categories?: BlogCategory[]
  author?: {
    name: string
    photo?: SanityImage
  }
  seo?: {
    metaTitle?: LocaleString
    metaDescription?: LocaleString
    ogImage?: SanityImage
    noIndex?: boolean
    canonicalUrl?: string
  }
}

export const blogCategoriesQuery = groq`
  *[_type == "category"] | order(title.es asc) {
    _id,
    title,
    slug,
    color
  }
`

export const blogPostListQuery = groq`
  *[
    _type == "blogPost"
    && status == "published"
    && (!defined($categorySlug) || $categorySlug in categories[]->slug.current)
  ] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featuredImage {
      asset->{ _id, url, metadata { dimensions } },
      alt
    },
    "categories": categories[]->{ _id, title, slug, color },
    "author": author->{ name }
  }
`

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug && status == "published"][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featuredImage {
      asset->{ _id, url, metadata { dimensions } },
      alt
    },
    body {
      es[] {
        ...,
        markDefs[] {
          ...,
          _type == "link" => { "href": href }
        }
      },
      en[] {
        ...,
        markDefs[] {
          ...,
          _type == "link" => { "href": href }
        }
      }
    },
    "categories": categories[]->{ _id, title, slug, color },
    "author": author->{ name, photo { asset->{ _id, url, metadata { dimensions } } } },
    seo {
      metaTitle,
      metaDescription,
      ogImage { asset->{ _id, url, metadata { dimensions } } },
      noIndex,
      canonicalUrl
    }
  }
`

export const blogPostSlugsQuery = groq`
  *[_type == "blogPost" && status == "published"] {
    "slug": slug.current
  }
`
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors related to the new types.

- [ ] **Step 3: Commit**

```bash
git add src/sanity/lib/queries.ts
git commit -m "feat(blog): add GROQ queries and TypeScript types for blog"
```

---

## Task 2: Create BlogListTemplate

**Files:**
- Create: `src/components/templates/BlogListTemplate.tsx`

### Context
This is an async server component (uses `getTranslations`). It receives Sanity data as props and renders the full blog listing page. The `blog` i18n namespace already has: `heroEyebrow`, `heroTitle`, `heroSubtitle`, `comingSoon`. The filter "All / Todos" link points to `/blog` without query params. Category filter links use `<Link href="?categoria=<slug>">` which preserves the current locale prefix automatically via next-intl's `Link`.

Pattern references:
- `ServiceCategoryTemplate` for async server component structure with `getTranslations`
- `src/app/[locale]/blog/page.tsx` for the existing visual design (hero, filter bar, post grid)

- [ ] **Step 1: Create `src/components/templates/BlogListTemplate.tsx` with the following content**

```typescript
import Image from "next/image";
import { Link } from "@/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABanner } from "@/components/sections/CTABanner";
import { getTranslations } from "next-intl/server";
import type { BlogPostListItem, BlogCategory } from "@/sanity/lib/queries";

interface BlogListTemplateProps {
  posts: BlogPostListItem[];
  categories: BlogCategory[];
  activeCategorySlug?: string;
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

export async function BlogListTemplate({
  posts,
  categories,
  activeCategorySlug,
  locale,
}: BlogListTemplateProps) {
  const t = await getTranslations("blog");
  const loc = locale as "es" | "en";

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy pt-40 pb-20 px-6 md:px-12 text-center">
        <SectionHeading
          eyebrow={t("heroEyebrow")}
          title={t("heroTitle")}
          subtitle={t("heroSubtitle")}
          centered
          light
        />
      </section>

      {/* Category filter */}
      <section className="bg-white border-b border-brand-light">
        <div className="container-allura px-6 md:px-12 py-5 flex flex-wrap gap-3">
          {/* "All" pill */}
          <Link
            href="/blog"
            className={`px-4 py-1.5 rounded-full font-body text-sm transition-colors ${
              !activeCategorySlug
                ? "bg-brand-navy text-white"
                : "bg-brand-light text-brand-navy hover:bg-brand-blue/20"
            }`}
          >
            {loc === "en" ? "All" : "Todos"}
          </Link>
          {/* Category pills */}
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/blog?categoria=${cat.slug.current}`}
              className={`px-4 py-1.5 rounded-full font-body text-sm transition-colors ${
                activeCategorySlug === cat.slug.current
                  ? "bg-brand-navy text-white"
                  : "bg-brand-light text-brand-navy hover:bg-brand-blue/20"
              }`}
            >
              {cat.title?.[loc] || cat.title?.es}
            </Link>
          ))}
        </div>
      </section>

      {/* Posts grid */}
      <section className="section-padding bg-white">
        <div className="container-allura">
          {posts.length === 0 ? (
            /* Empty state */
            <div className="text-center py-20">
              <p className="font-heading text-2xl text-brand-navy mb-4">
                {loc === "en" ? "No articles found" : "No hay artículos"}
              </p>
              <p className="font-body text-brand-silver mb-8">{t("comingSoon")}</p>
              <Link
                href="/servicios"
                className="inline-flex items-center gap-2 px-7 py-3 bg-brand-navy text-white rounded-full font-body text-sm hover:bg-brand-blue transition-colors"
              >
                {loc === "en" ? "Explore our services" : "Explorar servicios"}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {posts.map(({ _id, slug, title, excerpt, publishedAt, featuredImage, categories: postCats, author }, i) => (
                <article
                  key={_id}
                  className={`group ${
                    i % 2 === 0 ? "bg-white" : "bg-brand-light"
                  } rounded-2xl overflow-hidden border border-brand-light hover:shadow-md hover:border-brand-blue/30 transition-all duration-200`}
                >
                  <Link href={`/blog/${slug.current}`}>
                    {/* Featured image */}
                    <div className="aspect-video relative bg-brand-light overflow-hidden">
                      {featuredImage?.asset?.url ? (
                        <Image
                          src={featuredImage.asset.url}
                          alt={featuredImage.alt?.[loc] || featuredImage.alt?.es || title?.[loc] || ""}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <p className="font-body text-xs text-brand-silver">{t("imagePlaceholder")}</p>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      {/* Category badge */}
                      {postCats && postCats.length > 0 && (
                        <p
                          className="font-body text-xs tracking-wide uppercase mb-2"
                          style={{ color: postCats[0].color || "#8b9fb3" }}
                        >
                          {postCats[0].title?.[loc] || postCats[0].title?.es}
                        </p>
                      )}

                      {/* Title */}
                      <h3 className="font-heading text-lg text-brand-navy mb-3 leading-snug group-hover:text-brand-blue transition-colors">
                        {title?.[loc] || title?.es}
                      </h3>

                      {/* Excerpt */}
                      <p className="font-body text-sm text-brand-silver leading-relaxed mb-5">
                        {excerpt?.[loc] || excerpt?.es}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between">
                        <span className="font-body text-xs text-brand-silver">
                          {formatDate(publishedAt, locale)}
                        </span>
                        {author && (
                          <span className="font-body text-xs text-brand-silver">
                            {author.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/templates/BlogListTemplate.tsx
git commit -m "feat(blog): add BlogListTemplate with category filter and empty state"
```

---

## Task 3: Create BlogPostTemplate

**Files:**
- Create: `src/components/templates/BlogPostTemplate.tsx`

### Context
This is an async server component. It renders the full article detail: featured image hero, meta bar (date + author), bilingual portable text body, and CTABanner.

`@portabletext/react` is available as a transitive dependency of `next-sanity` — no need to install it separately. Import as `import { PortableText } from "@portabletext/react"`.

The `body` field on `BlogPostDetail` is `{ es: PortableTextBlock[]; en: PortableTextBlock[] }`. Use `post.body?.[loc] ?? []` to get the correct language array.

- [ ] **Step 1: Create `src/components/templates/BlogPostTemplate.tsx` with the following content**

```typescript
import Image from "next/image";
import { Link } from "@/navigation";
import { CTABanner } from "@/components/sections/CTABanner";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { ChevronLeft } from "lucide-react";
import type { BlogPostDetail } from "@/sanity/lib/queries";

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
            {formatDate(post.publishedAt, locale)}
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/templates/BlogPostTemplate.tsx
git commit -m "feat(blog): add BlogPostTemplate with PortableText renderer"
```

---

## Task 4: Replace blog listing page

**Files:**
- Replace: `src/app/[locale]/blog/page.tsx`

### Context
The current file renders hardcoded posts from i18n messages. Replace it entirely with a Sanity-powered version. Key points:
- `searchParams.categoria` is the active category slug filter (or undefined for "all")
- Pass `$categorySlug: searchParams.categoria ?? null` to the GROQ query — the query uses `!defined($categorySlug)` to show all posts when null
- Two fetches run in parallel with `Promise.all`
- `generateMetadata` keeps the same i18n keys that already exist (`blog.metaTitle`, `blog.metaDesc`)

- [ ] **Step 1: Replace the entire content of `src/app/[locale]/blog/page.tsx` with**

```typescript
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { client } from "@/sanity/lib/client";
import {
  blogCategoriesQuery,
  blogPostListQuery,
  type BlogCategory,
  type BlogPostListItem,
} from "@/sanity/lib/queries";
import { BlogListTemplate } from "@/components/templates/BlogListTemplate";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
  };
}

export default async function BlogPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { categoria?: string };
}) {
  const categorySlug = searchParams.categoria ?? null;

  const [categories, posts] = await Promise.all([
    client.fetch<BlogCategory[]>(blogCategoriesQuery, {}, { next: { revalidate } }),
    client.fetch<BlogPostListItem[]>(
      blogPostListQuery,
      { categorySlug },
      { next: { revalidate } }
    ),
  ]);

  return (
    <BlogListTemplate
      posts={posts ?? []}
      categories={categories ?? []}
      activeCategorySlug={categorySlug ?? undefined}
      locale={locale}
    />
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/blog/page.tsx
git commit -m "feat(blog): connect blog listing page to Sanity with category filter"
```

---

## Task 5: Create blog post detail page

**Files:**
- Create: `src/app/[locale]/blog/[slug]/page.tsx`

### Context
This is the detail page for individual blog posts. Key points:
- `generateStaticParams` pre-builds all published post slugs at build time. With 0 posts it returns `[]` (build still passes).
- `generateMetadata` uses `seo.metaTitle` / `seo.metaDescription` from Sanity with fallback to the post title/excerpt.
- If the post is not found (null from Sanity), call `notFound()` to return a 404.
- The `locale` from `params` is available in both `generateMetadata` and the page component.

- [ ] **Step 1: Create `src/app/[locale]/blog/[slug]/page.tsx` with the following content**

```typescript
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import {
  blogPostBySlugQuery,
  blogPostSlugsQuery,
  type BlogPostDetail,
} from "@/sanity/lib/queries";
import { BlogPostTemplate } from "@/components/templates/BlogPostTemplate";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(
    blogPostSlugsQuery,
    {},
    { next: { revalidate } }
  );
  return (slugs ?? []).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const post = await client.fetch<BlogPostDetail | null>(
    blogPostBySlugQuery,
    { slug },
    { next: { revalidate } }
  );

  if (!post) {
    return { title: "Not Found" };
  }

  const loc = locale as "es" | "en";
  return {
    title:
      post.seo?.metaTitle?.[loc] ??
      post.title?.[loc] ??
      post.title?.es ??
      "Blog — Allura Healthcare",
    description:
      post.seo?.metaDescription?.[loc] ??
      post.excerpt?.[loc] ??
      post.excerpt?.es,
    robots: post.seo?.noIndex ? { index: false } : undefined,
  };
}

export default async function BlogPostPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const post = await client.fetch<BlogPostDetail | null>(
    blogPostBySlugQuery,
    { slug },
    { next: { revalidate } }
  );

  if (!post) {
    notFound();
  }

  return <BlogPostTemplate post={post} locale={locale} />;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/blog/[slug]/page.tsx
git commit -m "feat(blog): add blog post detail page with generateStaticParams and SEO"
```

---

## Task 6: Install @portabletext/react and run build

**Files:**
- No file changes — install dependency and run build

### Context
`@portabletext/react` is available as a transitive dep of `next-sanity` in `node_modules`, but it is NOT listed in `package.json`. This means the import works locally but may break in CI or future installs. Add it as an explicit dependency to make it production-safe.

- [ ] **Step 1: Install `@portabletext/react` as an explicit dependency**

```bash
npm install @portabletext/react
```

Expected output: package added to `dependencies` in `package.json`.

- [ ] **Step 2: Run full Next.js build**

```bash
npm run build
```

Expected: build completes with no TypeScript errors. The output should show the new blog routes:
```
○ /[locale]/blog
○ /[locale]/blog/[slug]
```
(Static or ISR routes — exact symbol depends on whether Sanity has any published posts at build time.)

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(blog): add @portabletext/react as explicit dependency"
```

---

## Task 7: Manual local verification

**Files:** None — verification only

### Context
Run the dev server and verify the following routes work correctly in both locales. The blog page will show an empty state if no posts exist in Sanity Studio yet — that is expected and correct.

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Verify these URLs load without errors**

| URL | Expected |
|-----|----------|
| `http://localhost:3000/es/blog` | Blog listing, empty state or posts |
| `http://localhost:3000/en/blog` | Same in English |
| `http://localhost:3000/es/blog?categoria=<any-slug>` | Filtered view (empty state if no posts) |
| `http://localhost:3000/es/blog/un-slug-inexistente` | 404 page |

- [ ] **Step 3: Check browser console for errors**

Expected: no hydration errors, no missing key warnings, no 500s.

- [ ] **Step 4: Verify the existing service pages still work**

```
http://localhost:3000/es/servicios
http://localhost:3000/es/servicios/aligners
```

Expected: pages render normally (no regression from adding blog code).

---

## Self-Review Checklist

**Spec coverage:**
- [x] Schema `blogPost` — exists, no changes needed (Task 1 documents this)
- [x] Schema `category` — exists, no changes needed (Task 1 documents this)
- [x] Author via `teamMember` reference — schema already handles this, queried in Task 1
- [x] Título ES/EN — `title: LocaleString` (Task 1)
- [x] Slug ES/EN — single slug, both locales (design decision, Task 5)
- [x] Extracto ES/EN — `excerpt: LocaleString` (Task 1)
- [x] Imagen destacada con alt text — `featuredImage: SanityImageLocaleAlt` (Task 1)
- [x] Contenido enriquecido — `body: { es, en }` PortableText (Tasks 1, 3)
- [x] Estado borrador/publicado — filtered by `status == "published"` in query (Task 1)
- [x] Fecha de publicación — `publishedAt` queried and displayed (Tasks 1, 2, 3)
- [x] Categorías — `categories[]->` in query, filter pills in template (Tasks 1, 2)
- [x] SEO por artículo — `seo` field in `BlogPostDetail`, used in `generateMetadata` (Tasks 1, 5)
- [x] Página listado — `blog/page.tsx` replaced (Task 4)
- [x] Página detalle — `blog/[slug]/page.tsx` created (Task 5)
- [x] Rutas `/es` y `/en` — `[locale]` param used in both pages (Tasks 4, 5)
- [x] Fallback sin artículos — empty state in `BlogListTemplate` (Task 2)
- [x] Diseño visual consistente — uses `bg-brand-navy`, `font-heading`, `font-body`, `SectionHeading`, `CTABanner` matching site patterns (Tasks 2, 3)
- [x] Build + tests — Task 6
