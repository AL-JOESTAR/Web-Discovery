import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedArticlesPage, getCategories, getSiteSettings } from "@/lib/db";
import { getSiteUrl } from "@/lib/config";
import { ArticleCard } from "@/components/site/article-card";
import { PageHero } from "@/components/site/page-hero";

export const PAGE_SIZE = 9;

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const site = settings?.site;
  return {
    title: "Blog",
    description: site?.description ?? "Kumpulan artikel seputar fashion dan gaya hidup.",
    alternates: { canonical: `${getSiteUrl()}/blog` },
    openGraph: { type: "website", url: `${getSiteUrl()}/blog` },
  };
}

function blogHref(page: number, kategori?: string, gantiKategori?: boolean) {
  const p = new URLSearchParams();
  if (kategori) p.set("kategori", kategori);
  if (gantiKategori) p.delete("kategori");
  if (kategori) p.set("kategori", kategori);
  if (page > 1) p.set("halaman", String(page));
  else p.delete("halaman");
  const qs = p.toString();
  return `/blog${qs ? `?${qs}` : ""}`;
}

function buildHref({ page, kategori: k, all }: { page: number; kategori?: string; all?: boolean }) {
  const p = new URLSearchParams();
  if (!all && k) p.set("kategori", k);
  if (page > 1) p.set("halaman", String(page));
  const qs = p.toString();
  return `/blog${qs ? `?${qs}` : ""}`;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ halaman?: string; kategori?: string }>;
}) {
  const { halaman, kategori } = await searchParams;
  const raw = Number.parseInt(halaman ?? "", 10);
  const page = Number.isFinite(raw) && raw > 0 ? raw : 1;
  const kategoriSlug = kategori?.trim() || undefined;

  const [result, categories] = await Promise.all([
    getPublishedArticlesPage({ page, pageSize: PAGE_SIZE, categorySlug: kategoriSlug }),
    getCategories(),
  ]);

  const { articles, totalPages } = result;
  const active = categories.find((c) => c.slug === kategoriSlug);

  return (
    <div className="container-wide py-14 sm:py-20">
      <PageHero
        eyebrow="Blog"
        title="Semua Artikel"
        description={
          active
            ? `Artikel di kategori "${active.name}".`
            : "Inspirasi dan panduan fashion terbaru untuk gayamu."
        }
      />

      <div className="mt-10 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:overflow-visible [&::-webkit-scrollbar]:hidden">
        <Link
          href="/blog"
          className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            !kategoriSlug
              ? "border-accent bg-accent text-white"
              : "border-stone-300 text-stone-600 hover:border-stone-400"
          }`}
        >
          Semua
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={buildHref({ page: 1, kategori: category.slug })}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              category.slug === kategoriSlug
                ? "border-accent bg-accent text-white"
                : "border-stone-300 text-stone-600 hover:border-stone-400"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {articles.length === 0 ? (
        <div className="mx-auto mt-14 max-w-md rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="font-serif text-lg text-stone-500">
            Belum ada artikel pada kategori ini.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-14 flex items-center justify-center gap-3">
          <Link
            href={buildHref({ page: page - 1, kategori: kategoriSlug })}
            className={`btn-ghost ${page <= 1 ? "pointer-events-none opacity-40" : ""}`}
            aria-disabled={page <= 1}
          >
            &larr; Sebelumnya
          </Link>
          <span className="px-2 text-sm text-stone-500">
            Halaman {page} dari {totalPages}
          </span>
          <Link
            href={buildHref({ page: page + 1, kategori: kategoriSlug })}
            className={`btn-ghost ${page >= totalPages ? "pointer-events-none opacity-40" : ""}`}
            aria-disabled={page >= totalPages}
          >
            Selanjutnya &rarr;
          </Link>
        </nav>
      )}
    </div>
  );
}
