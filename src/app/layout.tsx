import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { getSiteSettings } from "@/lib/db";
import { getSiteUrl } from "@/lib/config";
import { jsonLdScript, websiteJsonLd } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
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
      </body>
    </html>
  );
}