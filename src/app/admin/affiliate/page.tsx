import Link from "next/link";
import { getAllAffiliateLinks, getAffiliateKategoriOptions } from "@/lib/admin-db";
import { AffiliateTable } from "@/components/admin/affiliate-table";

export default async function AdminAffiliatePage() {
  const [links, kategoriOptions] = await Promise.all([
    getAllAffiliateLinks(),
    getAffiliateKategoriOptions(),
  ]);

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
        <AffiliateTable links={links} kategoriOptions={kategoriOptions} />
      )}
    </div>
  );
}