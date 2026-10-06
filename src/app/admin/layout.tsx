import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/admin-nav";
import { redirect } from "next/navigation";

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

  const { data: admin } = await supabase
    .from("admins")
    .select("email")
    .ilike("email", user.email ?? "")
    .single();

  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  return <AdminNav email={user.email ?? ""}>{children}</AdminNav>;
}