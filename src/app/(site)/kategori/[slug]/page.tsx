import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArticlesByCategorySlug,
  getCategoryBySlug,
  getSiteSettings,
} from "@/lib/db";
import { getSiteUrl } from "@/lib/config";
import { ArticleCard } from "@/components/site/article-card";
import { categoryJsonLd, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";

export async function generateStaticParams() {
  const hasEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!hasEnv) return [{ slug: "__placeholder__" }];
  const { publicClient } = await import("@/lib/supabase/public");
  const { data } = await publicClient().from("categories").select("slug");
  if (!data?.length) return [{ slug: "__placeholder__" }];
  return data.map((item: { slug: string }) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "__placeholder__") return { title: "Kategori" };
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Kategori Tidak Ditemukan" };
  const url = `${getSiteUrl()}/kategori/${category.slug}`;
  return {
    title: category.seo_title || category.name,
    description: category.seo_description || category.description || undefined,
    alternates: { canonical: url },
    openGraph: {
      title: category.seo_title || category.name,
      description: category.seo_description || category.description || undefined,
      url,
    },
  };
}

export default async function KategoriDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "__placeholder__") notFound();

  const [category, articles] = await Promise.all([
    getCategoryBySlug(slug),
    getArticlesByCategorySlug(slug),
  ]);
  if (!category) notFound();

  const settings = await getSiteSettings();
  const siteName = settings?.site?.name ?? "Fashion";

  return (
    <div className="container-page py-14 sm:py-20">
      <nav className="mb-8 text-sm text-stone-400">
        <Link href="/" className="hover:text-accent">
          Beranda
        </Link>
        <span className="mx-1">/</span>
        <Link href="/kategori" className="hover:text-accent">
          Kategori
        </Link>
        <span className="mx-1">/</span>
        <span className="text-stone-600">{category.name}</span>
      </nav>

      <header className="max-w-2xl">
        <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-4 text-stone-500">{category.description}</p>
        )}
      </header>

      {articles.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="font-serif text-lg text-stone-500">
            Belum ada artikel di kategori ini.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      <script
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            categoryJsonLd(category, siteName),
            breadcrumbJsonLd([
              { name: "Beranda", path: "/" },
              { name: "Kategori", path: "/kategori" },
              { name: category.name, path: `/kategori/${category.slug}` },
            ]),
          ]),
        }}
      />
    </div>
  );
}