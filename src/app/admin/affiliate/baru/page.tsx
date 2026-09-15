import { AffiliateForm } from "@/components/admin/affiliate-form";

export default function AdminNewAffiliatePage() {
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-stone-900">
        Tambah Link Afiliasi
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Link ini akan tersedia untuk dipilih di halaman Prompt.
      </p>
      <div className="mt-6">
        <AffiliateForm />
      </div>
    </div>
  );
}