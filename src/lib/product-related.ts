import type { AffiliateLink } from "@/lib/types";
import { tokenizeKeywords } from "@/lib/related";

export function pickRelatedProducts(
  keywords: string | null | undefined,
  products: AffiliateLink[],
  limit = 4
): AffiliateLink[] {
  const tokens = tokenizeKeywords(keywords);

  const ranked = products.map((product, index) => {
    let score = 0;
    if (tokens.size > 0) {
      const haystack = `${product.nama} ${product.kategori ?? ""}`.toLowerCase();
      for (const token of tokens) {
        if (haystack.includes(token)) score += 1;
      }
    }
    return { product, score, index };
  });

  ranked.sort((a, b) => b.score - a.score || a.index - b.index);

  return ranked.slice(0, limit).map((item) => item.product);
}
