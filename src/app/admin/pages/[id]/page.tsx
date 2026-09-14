import { notFound } from "next/navigation";
import { getPageById } from "@/lib/admin-db";
import { PageForm } from "@/components/admin/page-form";
import { GuideCard } from "@/components/admin/guide-card";
import { GUIDE_HALAMAN } from "@/lib/guides";

export default async function AdminEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await getPageById(id);
  if (!page) notFound();

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-stone-900">
        Edit Halaman
      </h1>
      <p className="mt-1 text-sm text-stone-500">/{page.slug}</p>
      <div className="mt-6">
        <GuideCard guide={GUIDE_HALAMAN} />
      </div>
      <div className="mt-4">
        <PageForm page={page} />
      </div>
    </div>
  );
}