import { notFound } from "next/navigation";
import { getCategoryById } from "@/lib/admin-db";
import { CategoryForm } from "@/components/admin/category-form";

export default async function AdminEditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(id);
  if (!category) notFound();

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-stone-900">
        Edit Kategori
      </h1>
      <div className="mt-6">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}