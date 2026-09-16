import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getSiteSettings,
} from "@/lib/db";
import { getSiteUrl } from "@/lib/config";
import { formatDate } from "@/lib/utils";
import { articleJsonLd, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";
import { ArticleLayout } from "@/components/site/article-layouts";

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

  const template = article.template || "classic";
  const wide = template === "hero" || template === "magazine";

  return (
    <article className={wide ? "pb-16 sm:pb-24" : "container-page max-w-3xl py-14 sm:py-20"}>
      {/* Breadcrumb */}
      <nav
        className={`text-sm text-stone-400 ${
          wide ? "container-wide mb-6 pt-8 sm:mb-8 sm:pt-10" : "mb-8"
        }`}
      >
        <Link href="/" className="hover:text-accent">
          Beranda
        </Link>
        <span className="mx-1">/</span>
        <Link href="/blog" className="hover:text-accent">
          Blog
        </Link>
        <span className="mx-1">/</span>
        <span className="text-muted">{article.title}</span>
      </nav>

      <div className={template === "hero" ? "container-wide" : undefined}>
        <ArticleLayout article={article} />
      </div>

      <div
        className={`mt-12 border-t border-line pt-6 text-sm text-stone-400 ${
          wide ? "container-wide" : ""
        }`}
      >
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