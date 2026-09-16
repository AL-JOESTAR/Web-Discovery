import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/db";
import { breadcrumbJsonLd, jsonLdScript, pageJsonLd } from "@/lib/seo";
import { getSiteUrl } from "@/lib/config";

export async function generateStaticParams() {
  const hasEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!hasEnv) return [{ slug: "__placeholder__" }];
  const { publicClient } = await import("@/lib/supabase/public");
  const { data } = await publicClient()
    .from("pages")
    .select("slug")
    .eq("published", true);
  if (!data?.length) return [{ slug: "__placeholder__" }];
  return data.map((item: { slug: string }) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "__placeholder__") return { title: "Halaman" };
  const page = await getPageBySlug(slug);
  if (!page) return { title: "Halaman Tidak Ditemukan" };
  return {
    title: page.seo_title || page.title,
    description: page.seo_description || undefined,
    alternates: { canonical: `${getSiteUrl()}/${page.slug}` },
    openGraph: { type: "website", url: `${getSiteUrl()}/${page.slug}` },
  };
}

export default async function CustomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "__placeholder__") notFound();

  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <div className="container-page max-w-3xl py-14 sm:py-20">
      <nav className="mb-8 text-sm text-stone-400">
        <Link href="/" className="hover:text-accent">
          Beranda
        </Link>
        <span className="mx-1">/</span>
        <span className="text-muted">{page.title}</span>
      </nav>

      <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        {page.title}
      </h1>

      <div
        className="mt-8 space-y-4 leading-relaxed text-muted tiptap-content prose prose-stone max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content_html || "" }}
      />

      <script
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            pageJsonLd(page.title, page.seo_description || "", `/${page.slug}`),
            breadcrumbJsonLd([
              { name: "Beranda", path: "/" },
              { name: page.title, path: `/${page.slug}` },
            ]),
          ]),
        }}
      />
    </div>
  );
}