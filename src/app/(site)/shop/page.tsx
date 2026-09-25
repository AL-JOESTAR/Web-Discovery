import type { Metadata } from "next";
import { getAffiliateProducts, getLandingContent, getSiteSettings } from "@/lib/db";
import { getSiteUrl } from "@/lib/config";
import { breadcrumbJsonLd, jsonLdScript, pageJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/site/page-hero";
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
      <div className="container-wide py-14 sm:py-20">
        <PageHero
          eyebrow="Shop"
          title={shop?.title ?? "Semua Produk"}
          description={
            shop?.description ??
            "Temukan semua produk fashion pilihan kami dalam satu tempat."
          }
        />
        <ShopProducts products={products} />
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            pageJsonLd(
              shop?.title ?? "Shop",
              shop?.description ?? site?.description ?? "",
              "/shop"
            ),
            breadcrumbJsonLd([
              { name: "Beranda", path: "/" },
              { name: "Shop", path: "/shop" },
            ]),
          ]),
        }}
      />
    </>
  );
}