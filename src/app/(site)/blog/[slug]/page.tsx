import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getSiteSettings,
} from "@/lib/db";
import { getSiteUrl } from "@/lib/config";
import { formatDate, readingTime } from "@/lib/utils";
import { articleJsonLd, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";

export async function generateStaticParams() {
  const hasEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!hasEnv) return [{ slug: "__placeholder__" }];
  const { publicClient } = await import("@/lib/supabase/public");
  const { data } = await publicClient()
    .from("articles")
    .select("slug")
    .eq("status", "published");
  if (!data?.length) return [{ slug: "__placeholder__" }];
  return data.map((item: { slug: string }) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Artikel Tidak Ditemukan" };
  const settings = await getSiteSettings();
  const site = settings?.site;
  const url = `${getSiteUrl()}/blog/${article.slug}`;
  const title = article.seo_title || article.title;
  const description =
    article.seo_description || article.excerpt || site?.description || "";
  return {
    title,
    description,
    keywords: article.seo_keywords || undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: site?.name || "Fashion Blog",
      publishedTime: article.published_at || article.created_at,
      modifiedTime: article.updated_at,
      images: article.cover_image ? [{ url: article.cover_image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.cover_image ? [article.cover_image] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "__placeholder__") notFound();

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const settings = await getSiteSettings();
  const siteName = settings?.site?.name ?? "Fashion";

  return (
    <article className="container-page max-w-3xl py-14 sm:py-20">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-stone-400">
        <Link href="/" className="hover:text-accent">
          Beranda
        </Link>
        <span className="mx-1">/</span>
        <Link href="/blog" className="hover:text-accent">
          Blog
        </Link>
        <span className="mx-1">/</span>
        <span className="text-stone-600">{article.title}</span>
      </nav>

      {/* Header */}
      <header>
        {article.category && (
          <Link
            href={`/kategori/${article.category.slug}`}
            className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent hover:bg-accent/20"
          >
            {article.category.name}
          </Link>
        )}
        <h1 className="mt-4 font-serif text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          {article.title}
        </h1>
        <div className="mt-4 flex items-center gap-3 text-sm text-stone-400">
          <span>{formatDate(article.published_at || article.created_at)}</span>
          <span>•</span>
          <span>{readingTime(article.content_html)} menit baca</span>
        </div>
      </header>

      {/* Cover image */}
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

      {/* Content */}
      <div
        className="tiptap-content"
        dangerouslySetInnerHTML={{ __html: article.content_html || "" }}
      />

      {/* Meta / Share */}
      <div className="mt-12 border-t border-stone-200 pt-6 text-sm text-stone-400">
        <p>
          Terbit: {formatDate(article.published_at || article.created_at)}
          {article.updated_at &&
            article.updated_at !== article.created_at &&
            ` • Diperbarui: ${formatDate(article.updated_at)}`}
        </p>
      </div>

      {/* JSON-LD */}
      <script
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            articleJsonLd(article, siteName),
            breadcrumbJsonLd([
              { name: "Beranda", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: article.title, path: `/blog/${article.slug}` },
            ]),
          ]),
        }}
      />
    </article>
  );
}