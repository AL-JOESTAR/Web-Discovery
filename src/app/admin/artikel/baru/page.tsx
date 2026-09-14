import { getAllCategories } from "@/lib/admin-db";
import { slugify } from "@/lib/utils";
import { ArticleForm } from "@/components/admin/article-form";

export default async function AdminNewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ topik?: string; topikArtistik?: string }>;
}) {
  const [{ topik, topikArtistik }, categories] = await Promise.all([
    searchParams,
    getAllCategories(),
  ]);
  const topic = (topik ?? topikArtistik ?? "").trim();
  const prefillTitle = topic;
  const prefillSlug = topic ? slugify(topic) : "";

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-stone-900">
        Tulis Artikel Baru
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Simpan sebagai draft atau langsung publish.
      </p>
      <div className="mt-6">
        <ArticleForm
          categories={categories}
          prefillTitle={prefillTitle}
          prefillSlug={prefillSlug}
        />
      </div>
    </div>
  );
}
