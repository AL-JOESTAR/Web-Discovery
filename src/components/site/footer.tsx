import Link from "next/link";
import { getCategories, getPublishedPages, getSiteSettings } from "@/lib/db";

export async function Footer() {
  const [settings, categories, pages] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getPublishedPages(),
  ]);
  const site = settings?.site;
  const name = site?.name ?? "Fashion";
  const socials = site?.socials ?? {};

  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-xl font-bold text-stone-900">{name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-500">
            {site?.description ??
              "Inspirasi dan panduan fashion terbaru untuk gaya hidup harianmu."}
          </p>
          {Object.entries(socials).some(([, v]) => v) && (
            <div className="mt-5 flex flex-wrap gap-2">
              {socials.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-stone-300 px-3 py-1 text-xs font-medium text-stone-600 hover:border-accent hover:text-accent"
                >
                  Instagram
                </a>
              )}
              {socials.tiktok && (
                <a
                  href={socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-stone-300 px-3 py-1 text-xs font-medium text-stone-600 hover:border-accent hover:text-accent"
                >
                  TikTok
                </a>
              )}
              {socials.youtube && (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-stone-300 px-3 py-1 text-xs font-medium text-stone-600 hover:border-accent hover:text-accent"
                >
                  YouTube
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-stone-900">Kategori</p>
          <ul className="mt-3 space-y-2">
            {categories.slice(0, 6).map((category) => (
              <li key={category.id}>
                <Link
                  href={`/kategori/${category.slug}`}
                  className="text-sm text-stone-500 transition-colors hover:text-accent"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-stone-900">Halaman</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                href="/blog"
                className="text-sm text-stone-500 transition-colors hover:text-accent"
              >
                Semua Artikel
              </Link>
            </li>
            {pages.map((page) => (
              <li key={page.id}>
                <Link
                  href={`/${page.slug}`}
                  className="text-sm text-stone-500 transition-colors hover:text-accent"
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-200">
        <div className="container-page flex items-center justify-between py-4 text-xs text-stone-400">
          <p>© 2026 {name}. Semua hak dilindungi.</p>
          <Link href="/admin/login" className="hover:text-stone-600">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}