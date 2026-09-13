import Link from "next/link";
import { getCategories, getSiteSettings } from "@/lib/db";

export async function Navbar() {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getCategories(),
  ]);
  const site = settings?.site;
  const name = site?.name ?? "Fashion";

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2">
          {site?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={site.logo_url}
              alt={name}
              className="h-8 w-auto object-contain"
            />
          ) : (
            <span className="font-serif text-xl font-bold tracking-tight text-stone-900 group-hover:text-accent">
              {name}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/blog"
            className="text-sm font-medium text-stone-600 transition-colors hover:text-accent"
          >
            Blog
          </Link>
          {categories.slice(0, 5).map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-accent"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <Link
          href="/blog"
          className="btn-primary hidden sm:inline-flex"
        >
          Baca Artikel
        </Link>
      </div>
    </header>
  );
}