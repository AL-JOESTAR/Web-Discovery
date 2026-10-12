import type { Article, Category, AffiliateLink } from "@/lib/types";
import { getSiteUrl } from "@/lib/config";

type JsonLd = Record<string, unknown>;

export function websiteJsonLd(name: string, description: string): JsonLd {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    description,
    url,
  };
}

export function organizationJsonLd(
  name: string,
  logo?: string | null
): JsonLd {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo: logo || `${url}/favicon.ico`,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${url}${item.path}`,
    })),
  };
}

export function articleJsonLd(
  article: Article,
  siteName: string
): JsonLd {
  const url = getSiteUrl();
  const author = {
    "@type": "Organization",
    name: siteName,
  };
  const images = [
    article.cover_image,
    ...(article.section_images ?? []).map((s) => s.url).filter(Boolean),
  ].filter((v): v is string => !!v);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.seo_title || article.title,
    description: article.seo_description || article.excerpt,
    image: images.length ? images : undefined,
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at,
    author,
    publisher: {
      "@type": "Organization",
      name: siteName,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${url}/blog/${article.slug}`,
    },
  };
}

export function categoryJsonLd(
  category: Category,
  siteName: string
): JsonLd {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    headline: category.seo_title || category.name,
    name: category.name,
    description: category.seo_description || category.description,
    publisher: {
      "@type": "Organization",
      name: siteName,
    },
    url: `${url}/kategori/${category.slug}`,
  };
}

export function pageJsonLd(
  title: string,
  description: string,
  path: string
): JsonLd {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    headline: title,
    description,
    name: title,
    url: `${url}${path}`,
  };
}

export type JsonLdItem = { key: string; html: string };

export function jsonLdItems(ld: JsonLd | JsonLd[]): JsonLdItem[] {
  const items = Array.isArray(ld) ? ld : [ld];
  return items
    .filter(
      (item) =>
        !articleJsonLdHasUndefinedValue(item) && item && Object.keys(item).length
    )
    .map((item) => ({
      key: String((item["@type"] as string) || "ld"),
      html: JSON.stringify(item).replace(/</g, "\\u003c"),
    }));
}

function articleJsonLdHasUndefinedValue(item: Record<string, unknown>): boolean {
  return Object.values(item).some((v) => v === undefined);
}

export function productJsonLd(affiliate: AffiliateLink): JsonLd {
  const url = getSiteUrl();
  const offers: JsonLd = {
    "@type": "Offer",
    priceCurrency: "IDR",
    availability: "InStock",
  };
  if (affiliate.harga !== null && affiliate.harga !== undefined) {
    offers.price = affiliate.harga;
  }
  const aggregateRating =
    affiliate.rating !== null && affiliate.rating !== undefined && affiliate.rating_count
      ? {
          "@type": "AggregateRating",
          ratingValue: affiliate.rating,
          reviewCount: affiliate.rating_count,
          bestRating: 5,
          worstRating: 0,
        }
      : undefined;
  const product: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: affiliate.nama,
    url: affiliate.url || `${url}/shop`,
    offers,
  };
  if (affiliate.gambar) {
    product.image = [affiliate.gambar];
  }
  if (aggregateRating) {
    product.aggregateRating = aggregateRating;
  }
  return product;
}

export function itemListJsonLd(items: JsonLd[], name?: string): JsonLd {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item,
    })),
  };
}
