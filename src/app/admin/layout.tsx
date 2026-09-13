import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Artikel", href: "/admin/artikel" },
  { label: "Kategori", href: "/admin/kategori" },
  { label: "Halaman", href: "/admin/pages" },
  { label: "Pengaturan", href: "/admin/settings" },
];

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Login page — no shell
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-stone-100">
      {/* Sidebar */}
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
                className="block rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-stone-200 p-4 text-xs text-stone-400">
            {user.email}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b border-stone-200 bg-white px-4 md:hidden">
          <Link
            href="/admin/dashboard"
            className="font-serif text-lg font-bold text-stone-900"
          >
            Fashion Admin
          </Link>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}