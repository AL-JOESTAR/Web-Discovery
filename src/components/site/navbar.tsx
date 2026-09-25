import Link from "next/link";
import { getCategories, getSiteSettings } from "@/lib/db";
import { MobileNav } from "@/components/site/mobile-nav";

export async function Navbar() {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getCategories(),
  ]);
  const site = settings?.site;
  const name = site?.name ?? "Fashion";
  const links = [
    { href: "/blog", label: "Blog" },
    { href: "/shop", label: "Shop" },
    ...categories.slice(0, 5).map((category) => ({
      href: `/kategori/${category.slug}`,
      label: category.name,
    })),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background">
      <div className="container-wide flex h-[4.5rem] items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2">
          {site?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={site.logo_url}
              alt={name}
              className="h-auto max-h-9 w-auto max-w-[12rem] object-contain"
            />
          ) : (
            <span className="font-serif text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent">
              {name}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <MobileNav name={name} logoUrl={site?.logo_url} links={links} />
      </div>
    </header>
  );
}
