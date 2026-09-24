"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatPrice } from "@/lib/utils";
import type { AffiliateLink } from "@/lib/types";

export function AffiliateTable({
  links,
  kategoriOptions,
}: {
  links: AffiliateLink[];
  kategoriOptions: string[];
}) {
  const [kategori, setKategori] = useState("");

  const filtered = useMemo(() => {
    const k = kategori.trim().toLowerCase();
    if (!k) return links;
    return links.filter(
      (l) => (l.kategori ?? "").trim().toLowerCase() === k
    );
  }, [links, kategori]);

  return (
    <div className="mt-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <select
          className="select max-w-xs"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
        >
          <option value="">Semua kategori</option>
          {kategoriOptions.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <span className="text-xs text-stone-500">
          {filtered.length} link ditampilkan
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white p-10 text-center">
          <p className="text-sm text-stone-500">
            Tidak ada link afiliasi pada filter ini.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50">
              <tr>
                <th className="px-4 py-3 font-medium text-stone-500">Gambar</th>
                <th className="px-4 py-3 font-medium text-stone-500">Nama</th>
                <th className="px-4 py-3 font-medium text-stone-500">Harga</th>
                <th className="px-4 py-3 font-medium text-stone-500">
                  Kategori
                </th>
                <th className="hidden px-4 py-3 font-medium text-stone-500 sm:table-cell">
                  URL
                </th>
                <th className="px-4 py-3 text-right font-medium text-stone-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((link) => (
                <tr
                  key={link.id}
                  className="border-b border-stone-100 last:border-0"
                >
                  <td className="px-4 py-3">
                    {link.gambar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={link.gambar}
                        alt={link.nama}
                        className="h-10 w-12 rounded-md border border-stone-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-12 items-center justify-center rounded-md bg-stone-100 font-serif text-sm text-stone-400">
                        {link.nama.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-stone-900">
                    {link.nama}
                  </td>
                  <td className="px-4 py-3 text-stone-700">
                    {formatPrice(link.harga) || (
                      <span className="text-xs text-stone-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {link.kategori ? (
                      <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                        {link.kategori}
                      </span>
                    ) : (
                      <span className="text-xs text-stone-300">-</span>
                    )}
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