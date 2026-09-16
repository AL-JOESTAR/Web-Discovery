import { AffiliateForm } from "@/components/admin/affiliate-form";
import { getAffiliateKategoriOptions } from "@/lib/admin-db";

export default async function AdminNewAffiliatePage() {
  const kategoriOptions = await getAffiliateKategoriOptions();
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-stone-900">
        Tambah Link Afiliasi
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Link ini akan tersedia untuk dipilih di halaman Prompt.
      </p>
      <div className="mt-6">
        <AffiliateForm kategoriOptions={kategoriOptions} />
      </div>
    </div>
  );
}