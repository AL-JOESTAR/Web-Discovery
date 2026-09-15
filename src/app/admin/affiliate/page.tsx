import Link from "next/link";
import { getAllAffiliateLinks } from "@/lib/admin-db";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminAffiliatePage() {
  const links = await getAllAffiliateLinks();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Link Afiliasi
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {links.length} link tersimpan. Dipakai saat membangun prompt di
            halaman Prompt.
          </p>
        </div>
        <Link href="/admin/affiliate/baru" className="btn-primary">
          + Tambah Link
        </Link>
      </div>

      {links.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="font-serif text-lg text-stone-500">
            Belum ada link afiliasi.
          </p>
          <Link href="/admin/affiliate/baru" className="btn-primary mt-4">
            Tambah Link Pertama
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50">
              <tr>
                <th className="px-4 py-3 font-medium text-stone-500">Nama</th>
                <th className="hidden px-4 py-3 font-medium text-stone-500 sm:table-cell">
                  URL
                </th>
                <th className="px-4 py-3 text-right font-medium text-stone-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr
                  key={link.id}
                  className="border-b border-stone-100 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-stone-900">
                    {link.nama}
                  </td>
                  <td className="hidden max-w-md truncate px-4 py-3 text-stone-500 sm:table-cell">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-accent hover:underline"
                    >
                      {link.url}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/affiliate/${link.id}`}
                        className="text-xs font-medium text-accent hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={link.id} kind="affiliate" />
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