import Link from "next/link";
import { getAllArticles } from "@/lib/admin-db";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Artikel
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {articles.length} artikel tersimpan.
          </p>
        </div>
        <Link href="/admin/artikel/baru" className="btn-primary">
          + Tulis Artikel
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="font-serif text-lg text-stone-500">
            Belum ada artikel.
          </p>
          <Link href="/admin/artikel/baru" className="btn-primary mt-4">
            Tulis Artikel Pertama
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50">
              <tr>
                <th className="px-4 py-3 font-medium text-stone-500">Judul</th>
                <th className="hidden px-4 py-3 font-medium text-stone-500 sm:table-cell">
                  Kategori
                </th>
                <th className="hidden px-4 py-3 font-medium text-stone-500 sm:table-cell">
                  Status
                </th>
                <th className="hidden px-4 py-3 font-medium text-stone-500 md:table-cell">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-right font-medium text-stone-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-b border-stone-100 last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-stone-900">
                      {article.title}
                    </p>
                    <p className="text-xs text-stone-400">/{article.slug}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-stone-500 sm:table-cell">
                    {article.category?.name || "—"}
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        article.status === "published"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {article.status === "published" ? "Publish" : "Draft"}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-stone-400 md:table-cell">
                    {formatDate(article.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/artikel/${article.id}`}
                        className="text-xs font-medium text-accent hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={article.id} kind="article" />
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