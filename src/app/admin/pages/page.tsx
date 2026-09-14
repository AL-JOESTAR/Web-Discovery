import Link from "next/link";
import { getAllPages } from "@/lib/admin-db";
import { DeleteButton } from "@/components/admin/delete-button";
import { GuideCard } from "@/components/admin/guide-card";
import { GUIDE_HALAMAN } from "@/lib/guides";

export default async function AdminPagesPage() {
  const pages = await getAllPages();

  return (
    <div>
      <GuideCard guide={GUIDE_HALAMAN} defaultOpen />

      <div className="mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Halaman
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Halaman statis seperti Tentang, Kontak, dll.
          </p>
        </div>
        <Link href="/admin/pages/baru" className="btn-primary">
          + Tambah Halaman
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="font-serif text-lg text-stone-500">Belum ada halaman.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50">
              <tr>
                <th className="px-4 py-3 font-medium text-stone-500">Judul</th>
                <th className="hidden px-4 py-3 font-medium text-stone-500 sm:table-cell">
                  Slug
                </th>
                <th className="hidden px-4 py-3 font-medium text-stone-500 sm:table-cell">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-medium text-stone-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr
                  key={page.id}
                  className="border-b border-stone-100 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-stone-900">
                    {page.title}
                  </td>
                  <td className="hidden px-4 py-3 text-stone-400 sm:table-cell">
                    /{page.slug}
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        page.published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {page.published ? "Publish" : "Unpublish"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/pages/${page.id}`}
                        className="text-xs font-medium text-accent hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={page.id} kind="page" />
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