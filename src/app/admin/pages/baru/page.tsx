import { PageForm } from "@/components/admin/page-form";
import { GuideCard } from "@/components/admin/guide-card";
import { GUIDE_HALAMAN } from "@/lib/guides";

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
        <GuideCard guide={GUIDE_HALAMAN} />
      </div>
      <div className="mt-4">
        <PageForm />
      </div>
    </div>
  );
}