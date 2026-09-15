import { PromptPanel } from "@/components/admin/prompt-panel";
import { getAllAffiliateLinks } from "@/lib/admin-db";

export default async function AdminPromptPage({
  searchParams,
}: {
  searchParams: Promise<{ topik?: string }>;
}) {
  const [{ topik }, savedAffiliates] = await Promise.all([
    searchParams,
    getAllAffiliateLinks(),
  ]);
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-stone-900">
        Buat Artikel dari Prompt
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Bangun prompt SEO lengkap untuk topik fashion, lengkap dengan
        link afiliasi opsional.
      </p>
      <div className="mt-6">
        <PromptPanel initialTopic={topik} savedAffiliates={savedAffiliates} />
      </div>
    </div>
  );
}
