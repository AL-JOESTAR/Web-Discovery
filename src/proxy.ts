import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const PROTECTED = [
  "/admin/dashboard",
  "/admin/artikel",
  "/admin/kategori",
  "/admin/pages",
  "/admin/settings",
  "/admin/affiliate",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = PROTECTED.some((p) => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  const supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  return (async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const { data: admin } = await supabase
      .from("admins")
      .select("email")
      .ilike("email", user.email ?? "")
      .single();

    if (!admin) {
      await supabase.auth.signOut();
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  })();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/artikel/:path*",
    "/admin/kategori/:path*",
    "/admin/pages/:path*",
    "/admin/settings/:path*",
    "/admin/affiliate/:path*",
  ],
};