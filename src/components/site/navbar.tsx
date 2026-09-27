import Link from "next/link";
import { getSiteSettings } from "@/lib/db";

export async function Navbar() {
  const settings = await getSiteSettings();
  const site = settings?.site;
  const name = site?.name ?? "Fashion";

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

        <Link href="/shop" className="btn-shop">
          Belanja Sekarang
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </header>
  );
}