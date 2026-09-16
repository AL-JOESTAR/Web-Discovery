"use client";

import { useState } from "react";
import Link from "next/link";

type NavLink = { href: string; label: string };

export function MobileNav({
  name,
  logoUrl,
  links,
}: {
  name: string;
  logoUrl?: string | null;
  links: NavLink[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-foreground transition-colors hover:border-muted"
        aria-expanded={open}
        aria-label={open ? "Tutup menu" : "Buka menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-[4.5rem] z-50 border-b border-line bg-background/95 px-4 py-5 shadow-lg backdrop-blur-md sm:px-6">
          <nav className="flex flex-col gap-1">
            {logoUrl ? (
              <p className="mb-3 font-serif text-sm text-stone-400">{name}</p>
            ) : null}
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-stone-100 hover:text-accent"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
