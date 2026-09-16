import { notFound } from "next/navigation";
import { getAffiliateLinkById, getAffiliateKategoriOptions } from "@/lib/admin-db";
import { AffiliateForm } from "@/components/admin/affiliate-form";

export default async function AdminEditAffiliatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [link, kategoriOptions] = await Promise.all([
    getAffiliateLinkById(id),
    getAffiliateKategoriOptions(),
  ]);
  if (!link) notFound();

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-stone-900">
        Edit Link Afiliasi
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Perbarui nama, URL, atau kategori link afiliasi.
      </p>
      <div className="mt-6">
        <AffiliateForm link={link} kategoriOptions={kategoriOptions} />
      </div>
    </div>
  );
}