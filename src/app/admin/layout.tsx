import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/admin-nav";

export const instant = false;

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

  return <AdminNav email={user.email ?? ""}>{children}</AdminNav>;
}