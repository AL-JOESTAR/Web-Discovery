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
  const redirectTo = params.redirect || "/admin/dashboard";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(redirectTo);

  return <LoginForm redirectTo={redirectTo} urlError={params.error} />;
}
