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
    <footer className="border-t border-line bg-surface">
      <div className="container-wide grid gap-8 py-8 sm:gap-10 sm:py-14 md:grid-cols-4 md:gap-12">
        <div className="md:col-span-2">
          <p className="font-serif text-xl font-bold text-foreground sm:text-2xl">
            {name}
          </p>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted line-clamp-3 sm:mt-3 sm:text-sm sm:line-clamp-none">
            {site?.description ??
              "Inspirasi dan panduan fashion terbaru untuk gaya hidup harianmu."}
          </p>
          {socialEntries.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-6">
              {socialEntries.map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line px-3 py-1 text-[11px] font-medium capitalize text-muted transition-colors hover:border-accent hover:text-accent sm:px-3.5 sm:py-1.5 sm:text-xs"
                >
                  {key}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 md:contents">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
              Kategori
            </p>
            <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/kategori/${category.slug}`}
                    className="text-sm text-muted transition-colors hover:text-accent"
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
            <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  Semua Artikel
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  Shop
                </Link>
              </li>
              {pages.map((page) => (
                <li key={page.id}>
                  <Link
                    href={`/${page.slug}`}
                    className="text-sm text-muted transition-colors hover:text-accent"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-wide flex justify-center py-4 text-xs text-stone-400 sm:py-5">
          <p>© 2026 {name}. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
