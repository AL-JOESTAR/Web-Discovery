import Link from "next/link";
import type { Article, GalleryImage } from "@/lib/types";
import { formatDate, readingTime } from "@/lib/utils";

function CategoryBadge({
  article,
  onDark = false,
}: {
  article: Article;
  onDark?: boolean;
}) {
  if (!article.category) return null;
  return (
    <Link
      href={`/kategori/${article.category.slug}`}
      className={
        onDark
          ? "inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm hover:bg-white/25"
          : "inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent hover:bg-accent/20"
      }
    >
      {article.category.name}
    </Link>
  );
}

function ArticleMeta({ article }: { article: Article }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span>{formatDate(article.published_at || article.created_at)}</span>
      <span>•</span>
      <span>{readingTime(article.content_html)} menit baca</span>
    </div>
  );
}

function ArticleContent({ article }: { article: Article }) {
  return (
    <div
      className="tiptap-content"
      dangerouslySetInnerHTML={{ __html: article.content_html || "" }}
    />
  );
}

function GalleryGrid({
  items,
  className = "",
}: {
  items: GalleryImage[];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className={`my-10 grid gap-4 sm:grid-cols-2 ${className}`}>
      {items.map((img, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${img.url}-${i}`}
          src={img.url}
          alt={img.alt || `Gambar ${i + 1}`}
          className="aspect-[4/3] w-full rounded-2xl object-cover"
        />
      ))}
    </div>
  );
}

function GalleryStrip({ items }: { items: GalleryImage[] }) {
  if (items.length === 0) return null;
  return (
    <div className="my-10">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
        Galeri
      </p>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
        {items.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${img.url}-${i}`}
            src={img.url}
            alt={img.alt || `Gambar ${i + 1}`}
            className="aspect-[4/3] w-72 shrink-0 snap-start rounded-xl object-cover"
          />
        ))}
      </div>
    </div>
  );
}

function ClassicLayout({ article }: { article: Article }) {
  return (
    <>
      <header>
        <CategoryBadge article={article} />
        <h1 className="mt-4 font-serif text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          {article.title}
        </h1>
        <div className="mt-4 text-stone-400">
          <ArticleMeta article={article} />
        </div>
      </header>

      {article.cover_image && (
        <div className="my-8 overflow-hidden rounded-3xl shadow-lg shadow-stone-900/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.cover_image}
            alt={article.title}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      <ArticleContent article={article} />

      <GalleryGrid items={article.gallery} />
    </>
  );
}

function HeroLayout({ article }: { article: Article }) {
  return (
    <>
      <header className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <CategoryBadge article={article} />
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {article.excerpt}
            </p>
          )}
          <div className="mt-4 text-stone-400">
            <ArticleMeta article={article} />
          </div>
        </div>
        <div>
          {article.cover_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.cover_image}
              alt={article.title}
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-lg shadow-stone-900/10 sm:aspect-[4/3]"
            />
          )}
        </div>
      </header>

      <div className="mx-auto mt-12 max-w-3xl">
        <ArticleContent article={article} />
        <GalleryGrid items={article.gallery} />
      </div>
    </>
  );
}

function MagazineLayout({ article }: { article: Article }) {
  const onDark = Boolean(article.cover_image);

  return (
    <>
      <header className="relative min-h-[min(70svh,40rem)] overflow-hidden rounded-none sm:rounded-3xl">
        {article.cover_image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.cover_image}
              alt={article.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-section-dark via-section-dark/50 to-section-dark/10" />
          </>
        ) : (
          <div className="absolute inset-0 bg-stone-100" />
        )}
        <div
          className={`relative flex min-h-[min(70svh,40rem)] flex-col justify-end p-6 sm:p-10 lg:p-14 ${
            onDark ? "text-white" : "text-foreground"
          }`}
        >
          <CategoryBadge article={article} onDark={onDark} />
          <h1 className="hero-title mt-4 max-w-3xl text-balance">
            {article.title}
          </h1>
          {article.excerpt && (
            <p
              className={`mt-4 max-w-xl text-base leading-relaxed sm:text-lg ${
                onDark ? "text-stone-200" : "text-muted"
              }`}
            >
              {article.excerpt}
            </p>
          )}
          <div className={`mt-4 ${onDark ? "text-stone-300" : "text-stone-400"}`}>
            <ArticleMeta article={article} />
          </div>
        </div>
      </header>

      <div className="container-page mx-auto max-w-3xl">
        <ArticleContent article={article} />
        <GalleryStrip items={article.gallery} />
      </div>
    </>
  );
}

export function ArticleLayout({ article }: { article: Article }) {
  const template = article.template || "classic";
  if (template === "hero") return <HeroLayout article={article} />;
  if (template === "magazine") return <MagazineLayout article={article} />;
  return <ClassicLayout article={article} />;
}
