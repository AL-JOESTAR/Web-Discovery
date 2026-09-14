import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleById, getAllCategories, getSiteSettingsAdmin } from "@/lib/admin-db";
import { ArticleForm } from "@/components/admin/article-form";

export default async function AdminEditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [article, categories, settings] = await Promise.all([
    getArticleById(id),
    getAllCategories(),
    getSiteSettingsAdmin(),
  ]);
  if (!article) notFound();

  const siteName = (settings?.name as string) ?? "";
  const siteDomain = (settings?.domain as string) ?? "";

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Edit Artikel
          </h1>
          <p className="mt-1 text-sm text-stone-500">/{article.slug}</p>
        </div>
        <Link href="/admin/artikel" className="text-sm text-stone-500 hover:text-accent">
          ← Kembali
        </Link>
      </div>
      <div className="mt-6">
        <ArticleForm article={article} categories={categories} siteName={siteName} siteDomain={siteDomain} />
      </div>
    </div>
  );
}