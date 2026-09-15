import Link from "next/link";
import type { Article, GalleryImage } from "@/lib/types";
import { formatDate, readingTime } from "@/lib/utils";

function CategoryBadge({ article }: { article: Article }) {
  if (!article.category) return null;
  return (
    <Link
      href={`/kategori/${article.category.slug}`}
      className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent hover:bg-accent/20"
    >
      {article.category.name}
    </Link>
  );
}

function ArticleMeta({ article }: { article: Article }) {
  return (
    <div className="flex items-center gap-3 text-sm">
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
        <div className="my-8 overflow-hidden rounded-2xl">
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
      <header className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
        <div>
          <CategoryBadge article={article} />
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-4 leading-relaxed text-stone-500">
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
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
          )}
        </div>
      </header>

      <ArticleContent article={article} />

      <GalleryGrid items={article.gallery} />
    </>
  );
}

function MagazineLayout({ article }: { article: Article }) {
  const heroText = article.cover_image
    ? "absolute inset-x-0 bottom-0 p-6 text-white sm:p-10"
    : "p-6 sm:p-10";

  return (
    <>
      <header className="relative overflow-hidden rounded-3xl">
        {article.cover_image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.cover_image}
              alt={article.title}
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
          </>
        ) : null}
        <div className={`relative ${heroText}`}>
          <CategoryBadge article={article} />
          <h1 className="mt-3 max-w-2xl font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-300/90 sm:text-base">
              {article.excerpt}
            </p>
          )}
          <div className="mt-4 text-stone-400">
            <ArticleMeta article={article} />
          </div>
        </div>
      </header>

      <ArticleContent article={article} />

      <GalleryStrip items={article.gallery} />
    </>
  );
}

export function ArticleLayout({ article }: { article: Article }) {
  const template = article.template || "classic";
  if (template === "hero") return <HeroLayout article={article} />;
  if (template === "magazine") return <MagazineLayout article={article} />;
  return <ClassicLayout article={article} />;
}