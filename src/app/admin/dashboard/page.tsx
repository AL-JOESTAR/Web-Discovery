import Link from "next/link";
import {
  countTable,
  getAllArticles,
} from "@/lib/admin-db";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [articleCount, draftCount, categoryCount, pageCount, recent] =
    await Promise.all([
      countTable("articles"),
      getAllArticles({ status: "draft" }).then((a) => a.length),
      countTable("categories"),
      countTable("pages"),
      getAllArticles().then((a) => a.slice(0, 5)),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-stone-900">Dashboard</h1>
      <p className="mt-1 text-sm text-stone-500">
        Kelola konten fashion website kamu.
      </p>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <StatCard
          title="Artikel Terpublish"
          value={articleCount}
          href="/admin/artikel"
        />
        <StatCard
          title="Draft"
          value={draftCount}
          href="/admin/artikel"
          accent
        />
        <StatCard
          title="Kategori"
          value={categoryCount}
          href="/admin/kategori"
        />
        <StatCard title="Halaman" value={pageCount} href="/admin/pages" />
      </div>

      {/* Recent articles */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">
            Artikel Terbaru
          </h2>
          <Link
            href="/admin/artikel/baru"
            className="btn-primary text-xs"
          >
            + Tulis Baru
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
            Belum ada artikel.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-stone-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-stone-500">
                    Judul
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-stone-500 sm:table-cell">
                    Status
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-stone-500 md:table-cell">
                    Tanggal
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {recent.map((article) => (
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
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          article.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {article.status === "published"
                          ? "Publish"
                          : "Draft"}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-stone-400 md:table-cell">
                      {formatDate(article.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/artikel/${article.id}`}
                        className="text-xs font-medium text-accent hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  href,
  accent = false,
}: {
  title: string;
  value: number;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`card p-4 transition-shadow hover:shadow-md ${
        accent ? "border-amber-200" : ""
      }`}
    >
      <p className="text-xs font-medium text-stone-500">{title}</p>
      <p
        className={`mt-1 text-3xl font-bold ${
          accent ? "text-amber-600" : "text-stone-900"
        }`}
      >
        {value}
      </p>
    </Link>
  );
}