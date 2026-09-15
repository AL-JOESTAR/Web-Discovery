"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/admin/logout-button";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Artikel", href: "/admin/artikel" },
  { label: "Prompt", href: "/admin/prompt" },
  { label: "Link Afiliasi", href: "/admin/affiliate" },
  { label: "Kategori", href: "/admin/kategori" },
  { label: "Halaman", href: "/admin/pages" },
  { label: "Pengaturan", href: "/admin/settings" },
];

const QUICK_NAV = [
  { label: "Prompt", href: "/admin/prompt", icon: PromptIcon },
  { label: "Artikel", href: "/admin/artikel", icon: ArtikelIcon },
  { label: "Link Afiliasi", href: "/admin/affiliate", icon: LinkIcon },
];

function isActive(href: string, pathname: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-stone-100">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-stone-200 bg-white md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b border-stone-200 px-4">
            <Link
              href="/admin/dashboard"
              className="font-serif text-lg font-bold text-stone-900 hover:text-accent"
            >
              Fashion Admin
            </Link>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href, pathname)
                    ? "bg-accent/10 text-accent"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="space-y-2 border-t border-stone-200 p-3">
            <p className="truncate px-3 text-xs text-stone-400">{email}</p>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Konten utama */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header mobile */}
        <header className="flex h-14 items-center gap-2 border-b border-stone-200 bg-white px-4 md:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
            className="rounded-lg p-2 text-stone-600 transition-colors hover:bg-stone-100"
          >
            <MenuIcon />
          </button>
          <Link
            href="/admin/dashboard"
            className="font-serif text-lg font-bold text-stone-900"
          >
            Fashion Admin
          </Link>
        </header>

        <main className="flex-1 overflow-auto p-4 pb-24 sm:p-6 md:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-stone-200 bg-white md:hidden">
        {QUICK_NAV.map((item) => {
          const active = isActive(item.href, pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                active ? "text-accent" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Icon />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Tutup menu"
            className="absolute inset-0 bg-stone-950/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-stone-200 px-4">
              <span className="font-serif text-lg font-bold text-stone-900">
                Fashion Admin
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup menu"
                className="rounded-lg p-2 text-stone-600 transition-colors hover:bg-stone-100"
              >
                <CloseIcon />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(item.href, pathname)
                      ? "bg-accent/10 text-accent"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="space-y-2 border-t border-stone-200 p-3">
              <p className="truncate px-3 text-xs text-stone-400">{email}</p>
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function PromptIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3 13.9 8.1 19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
    </svg>
  );
}

function ArtikelIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}