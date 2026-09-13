import { CategoryForm } from "@/components/admin/category-form";

export default function AdminNewCategoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-stone-900">
        Tambah Kategori
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Kategori untuk mengelompokkan artikel.
      </p>
      <div className="mt-6">
        <CategoryForm />
      </div>
    </div>
  );
}