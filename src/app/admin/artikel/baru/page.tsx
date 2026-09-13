import { getAllCategories } from "@/lib/admin-db";
import { ArticleForm } from "@/components/admin/article-form";

export default async function AdminNewArticlePage() {
  const categories = await getAllCategories();
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-stone-900">
        Tulis Artikel Baru
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Simpan sebagai draft atau langsung publish.
      </p>
      <div className="mt-6">
        <ArticleForm categories={categories} />
      </div>
    </div>
  );
}