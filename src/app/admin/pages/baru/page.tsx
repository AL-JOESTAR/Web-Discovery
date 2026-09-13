import { PageForm } from "@/components/admin/page-form";

export default function AdminNewPagePage() {
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-stone-900">
        Tambah Halaman
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Halaman akan tersedia di /[slug].
      </p>
      <div className="mt-6">
        <PageForm />
      </div>
    </div>
  );
}