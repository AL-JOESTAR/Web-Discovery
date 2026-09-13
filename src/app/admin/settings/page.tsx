import { getSiteSettingsAdmin } from "@/lib/admin-db";
import { SettingsForm } from "@/components/admin/settings-form";
import type { SiteSettings } from "@/lib/types";

export default async function AdminSettingsPage() {
  const raw = await getSiteSettingsAdmin();
  const initial: SiteSettings | null = raw
    ? { site: raw as SiteSettings["site"] }
    : null;

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-stone-900">
        Pengaturan
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Konfigurasi website, SEO global, dan landing page.
      </p>
      <div className="mt-6">
        {!initial && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Belum ada pengaturan tersimpan. Isi form ini lalu simpan — landing
            page akan otomatis menggunakan default.
          </div>
        )}
        <SettingsForm initial={initial} />
      </div>
    </div>
  );
}