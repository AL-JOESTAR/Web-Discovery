import type { Metadata } from "next";
import { getAffiliateProducts, getLandingContent, getSiteSettings } from "@/lib/db";
import { getSiteUrl } from "@/lib/config";
import { breadcrumbJsonLd, jsonLdItems, pageJsonLd } from "@/lib/seo";
import { ShopProducts } from "@/components/site/shop-products";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, landing] = await Promise.all([
    getSiteSettings(),
    getLandingContent(),
  ]);
  const site = settings?.site;
  const shop = landing.shop;
  const title = shop?.title ?? "Shop";
  const description = shop?.description ?? site?.description;
  return {
    title,
    description,
    alternates: { canonical: `${getSiteUrl()}/shop` },
    openGraph: { type: "website", url: `${getSiteUrl()}/shop` },
  };
}

export default async function ShopPage() {
  const [products, landing, settings] = await Promise.all([
    getAffiliateProducts(),
    getLandingContent(),
    getSiteSettings(),
  ]);
  const shop = landing.shop;
  const site = settings?.site;

  return (
    <>
      <div className="container-wide py-8 sm:py-12">
        <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
          {shop?.title ?? "Semua Produk"}
        </h1>
        <ShopProducts products={products} />
      </div>
      {jsonLdItems([
        pageJsonLd(
          shop?.title ?? "Shop",
          shop?.description ?? site?.description ?? "",
          "/shop"
        ),
        breadcrumbJsonLd([
          { name: "Beranda", path: "/" },
          { name: "Shop", path: "/shop" },
        ]),
      ]).map((ld) => (
        <script
          key={ld.key}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: ld.html }}
        />
      ))}
    </>
  );
}