import type { Article } from "@/lib/types";

const STOPWORDS = new Set([
  "yang",
  "dan",
  "di",
  "ke",
  "dari",
  "untuk",
  "dengan",
  "atau",
  "pada",
  "ini",
  "itu",
  "akan",
  "juga",
  "tidak",
  "adalah",
]);

export function tokenizeKeywords(keywords?: string | null): Set<string> {
  const tokens = new Set<string>();
  if (!keywords) return tokens;
  for (const raw of keywords.split(/[,;]+/)) {
    const token = raw.trim().toLowerCase();
    if (token.length < 3 || STOPWORDS.has(token)) continue;
    tokens.add(token);
  }
  return tokens;
}

export function pickRelated(
  current: { slug: string; category_id: string | null; seo_keywords?: string | null },
  pool: Article[],
  limit = 3
): Article[] {
  const currentTokens = tokenizeKeywords(current.seo_keywords);

  const scored = pool
    .filter((c) => c.slug !== current.slug)
    .map((candidate) => {
      let score = 0;
      const sameCategory =
        current.category_id !== null &&
        candidate.category_id !== null &&
        current.category_id === candidate.category_id;
      if (sameCategory) score += 5;
      for (const token of tokenizeKeywords(candidate.seo_keywords)) {
        if (currentTokens.has(token)) score += 1;
      }
      return {
        article: candidate,
        score,
        publishedAt: candidate.published_at || candidate.created_at,
      };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        (b.publishedAt > a.publishedAt ? 1 : b.publishedAt < a.publishedAt ? -1 : 0)
    );

  return scored.slice(0, limit).map((s) => s.article);
}