export const MARKETPLACES = [
  "Shopee",
  "Tokopedia",
  "TikTok Shop",
  "Lazada",
  "Blibli",
  "Zalora",
  "Amazon",
] as const;

export type Marketplace = (typeof MARKETPLACES)[number];

export function isMarketplace(value: string): value is Marketplace {
  return (MARKETPLACES as readonly string[]).includes(value);
}

const HOST_LABELS: Record<string, Marketplace> = {
  "shopee.co.id": "Shopee",
  "shopee.com": "Shopee",
  "shopee.com.br": "Shopee",
  "shope.ee": "Shopee",
  "tokopedia.com": "Tokopedia",
  "tokopedia.link": "Tokopedia",
  "tiktok.com": "TikTok Shop",
  "lazada.co.id": "Lazada",
  "lazada.com": "Lazada",
  "blibli.com": "Blibli",
  "zalora.co.id": "Zalora",
  "zalora.com": "Zalora",
  "amazon.co.id": "Amazon",
  "amazon.com": "Amazon",
  "amazon.sg": "Amazon",
};

export function detectMarketplace(
  url: string | null | undefined
): Marketplace | null {
  if (!url) return null;

  let hostname: string;
  try {
    hostname = new URL(url.trim()).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
  if (!hostname) return null;

  // Cocokkan suffix terpanjang ke bawah agar subdomain ikut kena:
  // s.shopee.co.id -> shopee.co.id, vt.tiktok.com -> tiktok.com
  const labels = hostname.split(".");
  for (let i = 0; i < labels.length - 1; i++) {
    const match = HOST_LABELS[labels.slice(i).join(".")];
    if (match) return match;
  }
  return null;
}

export function getMarketplaceLabel(
  stored: string | null | undefined,
  url: string | null | undefined
): Marketplace | null {
  const trimmed = stored?.trim();
  if (trimmed && isMarketplace(trimmed)) return trimmed;
  return detectMarketplace(url);
}
