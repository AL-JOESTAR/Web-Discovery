import { notFound } from "next/navigation";
import { getPageById } from "@/lib/admin-db";
import { PageForm } from "@/components/admin/page-form";

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
        <PageForm page={page} />
      </div>
    </div>
  );
}