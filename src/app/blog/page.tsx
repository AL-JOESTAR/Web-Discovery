import type { Metadata } from "next";
import {
  getPublishedArticles,
  getSiteSettings,
} from "@/lib/db";
import { getSiteUrl } from "@/lib/config";
import { ArticleCard } from "@/components/site/article-card";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const site = settings?.site;
  return {
    title: "Blog",
    description: site?.description ?? "Kumpulan artikel seputar fashion dan gaya hidup.",
    alternates: {
      canonical: `${getSiteUrl()}/blog`,
    },
    openGraph: {
      type: "website",
      url: `${getSiteUrl()}/blog`,
    },
  };
}

export default async function BlogPage() {
  const articles = await getPublishedArticles();

  return (
    <div className="container-page py-14 sm:py-20">
      <header className="mx-auto max-w-2xl text-center">
        <p className="font-serif text-sm uppercase tracking-[0.3em] text-accent">
          Blog
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight sm:text-5xl">
          Semua Artikel
        </h1>
        <p className="mt-4 text-stone-500">
          Inspirasi dan panduan fashion terbaru untuk gayamu.
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="mx-auto mt-14 max-w-md rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="font-serif text-lg text-stone-500">
            Belum ada artikel yang dipublikasikan.
          </p>
        </div>
      ) : (
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}