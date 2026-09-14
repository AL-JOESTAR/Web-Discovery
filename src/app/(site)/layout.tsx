import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/db";
import { getSiteUrl } from "@/lib/config";
import { jsonLdScript, websiteJsonLd } from "@/lib/seo";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const site = settings?.site;
  const name = site?.name ?? "Fashion Blog";
  const description =
    site?.description ??
    "Inspirasi dan panduan fashion terbaru untuk gaya hidup harianmu.";
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description,
    keywords: site?.keywords ?? "fashion, style, tren, pakaian, gaya hidup",
    openGraph: {
      type: "website",
      siteName: name,
      locale: "id_ID",
      url: getSiteUrl(),
      images: site?.og_image ? [{ url: site.og_image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: site?.og_image ? [site.og_image] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <script
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            websiteJsonLd(
              "Fashion Blog",
              "Inspirasi dan panduan fashion terbaru untuk gaya hidup harianmu."
            )
          ),
        }}
      />
    </div>
  );
}