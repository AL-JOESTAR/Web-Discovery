import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/admin/login-form";

export const instant = false;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const params = await searchParams;
  const rawRedirect = params.redirect || "/admin/dashboard";
  let redirectTo = "/admin/dashboard";
  if (rawRedirect.startsWith("/admin/") && !rawRedirect.startsWith("//")) {
    redirectTo = rawRedirect;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(redirectTo);

  return <LoginForm redirectTo={redirectTo} urlError={params.error} />;
}
