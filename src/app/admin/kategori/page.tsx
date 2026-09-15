import Link from "next/link";
import { getAllCategories } from "@/lib/admin-db";
import { DeleteButton } from "@/components/admin/delete-button";
import { GuideCard } from "@/components/admin/guide-card";
import { GUIDE_KATEGORI } from "@/lib/guides";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <GuideCard guide={GUIDE_KATEGORI} defaultOpen />

      <div className="mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Kategori
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {categories.length} kategori tersimpan.
          </p>
        </div>
        <Link href="/admin/kategori/baru" className="btn-primary">
          + Tambah Kategori
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="font-serif text-lg text-stone-500">
            Belum ada kategori.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50">
              <tr>
                <th className="px-4 py-3 font-medium text-stone-500">Nama</th>
                <th className="hidden px-4 py-3 font-medium text-stone-500 sm:table-cell">
                  Slug
                </th>
                <th className="hidden px-4 py-3 font-medium text-stone-500 md:table-cell">
                  Deskripsi
                </th>
                <th className="px-4 py-3 text-right font-medium text-stone-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-stone-100 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-stone-900">
                    {category.name}
                  </td>
                  <td className="hidden px-4 py-3 text-stone-400 sm:table-cell">
                    /kategori/{category.slug}
                  </td>
                  <td className="hidden max-w-xs truncate px-4 py-3 text-stone-500 md:table-cell">
                    {category.description || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/kategori/${category.id}`}
                        className="text-xs font-medium text-accent hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={category.id} kind="category" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}