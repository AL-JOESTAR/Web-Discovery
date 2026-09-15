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
  const socialEntries = (
    [
      ["instagram", socials.instagram],
      ["tiktok", socials.tiktok],
      ["youtube", socials.youtube],
      ["facebook", socials.facebook],
      ["twitter", socials.twitter],
    ] as const
  ).filter(([, url]) => Boolean(url));

  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="container-wide grid gap-10 py-14 md:grid-cols-4 md:gap-12">
        <div className="md:col-span-2">
          <p className="font-serif text-2xl font-bold text-stone-900">{name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-500">
            {site?.description ??
              "Inspirasi dan panduan fashion terbaru untuk gaya hidup harianmu."}
          </p>
          {socialEntries.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {socialEntries.map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-stone-200 px-3.5 py-1.5 text-xs font-medium capitalize text-stone-600 transition-colors hover:border-accent hover:text-accent"
                >
                  {key}
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
            Kategori
          </p>
          <ul className="mt-4 space-y-2.5">
            {categories.slice(0, 6).map((category) => (
              <li key={category.id}>
                <Link
                  href={`/kategori/${category.slug}`}
                  className="text-sm text-stone-600 transition-colors hover:text-accent"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
            Halaman
          </p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link
                href="/blog"
                className="text-sm text-stone-600 transition-colors hover:text-accent"
              >
                Semua Artikel
              </Link>
            </li>
            {pages.map((page) => (
              <li key={page.id}>
                <Link
                  href={`/${page.slug}`}
                  className="text-sm text-stone-600 transition-colors hover:text-accent"
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-200">
        <div className="container-wide flex justify-center py-5 text-xs text-stone-400">
          <p>© 2026 {name}. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
