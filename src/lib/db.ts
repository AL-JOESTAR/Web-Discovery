import { cacheLife, cacheTag } from "next/cache";
import { publicClient } from "@/lib/supabase/public";
import { TAGS, hasPublicEnv } from "@/lib/config";
import type { Article, Category, LandingContent, Page, SiteSettings } from "@/lib/types";

export async function getSiteSettings(): Promise<SiteSettings | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.settings);
  if (!hasPublicEnv) return null;
  const { data } = await publicClient()
    .from("site_settings")
    .select("value")
    .eq("key", "site")
    .single();
  if (!data) return null;
  return { site: (data.value as SiteSettings["site"]) ?? {} };
}

export async function getLandingContent(): Promise<LandingContent> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.settings);
  const settings = await getSiteSettings();
  const landing = (settings?.site as unknown as Record<string, unknown>)
    ?.landing as LandingContent | undefined;
  if (landing && typeof landing === "object") {
    const { DEFAULT_LANDING } = await import("@/lib/config");
    return { ...DEFAULT_LANDING, ...landing };
  }
  const { DEFAULT_LANDING } = await import("@/lib/config");
  return DEFAULT_LANDING;
}

export async function getPublishedArticles(limit?: number): Promise<Article[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.articles);
  if (!hasPublicEnv) return [];
  let query = publicClient()
    .from("articles")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data } = await query;
  return (data as Article[] | null) ?? [];
}

export async function getPublishedArticlesPage({
  page = 1,
  pageSize = 9,
  categorySlug,
}: {
  page?: number;
  pageSize?: number;
  categorySlug?: string | null;
}): Promise<{ articles: Article[]; total: number; totalPages: number }> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.articles);
  if (categorySlug) cacheTag(TAGS.categories);
  if (!hasPublicEnv) return { articles: [], total: 0, totalPages: 0 };

  const safePage = Math.max(1, page);
  const safeSize = Math.min(Math.max(1, pageSize), 24);
  const from = (safePage - 1) * safeSize;
  const to = from + safeSize - 1;

  let query = publicClient()
    .from("articles")
    .select("*, category:categories(*)", { count: "exact" })
    .eq("status", "published");
  if (categorySlug) query = query.eq("category.slug", categorySlug);
  query = query
    .order("published_at", { ascending: false })
    .range(from, to);

  const { data, count } = await query;
  const articles = (data as Article[] | null) ?? [];
  const total = count ?? 0;

  return {
    articles,
    total,
    totalPages: Math.max(1, Math.ceil(total / safeSize)),
  };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.articles);
  if (!hasPublicEnv) return null;
  const { data } = await publicClient()
    .from("articles")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return (data as Article | null) ?? null;
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.categories);
  if (!hasPublicEnv) return [];
  const { data } = await publicClient()
    .from("categories")
    .select("*")
    .order("name", { ascending: true });
  return (data as Category[] | null) ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.categories);
  if (!hasPublicEnv) return null;
  const { data } = await publicClient()
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  return (data as Category | null) ?? null;
}

export async function getArticlesByCategorySlug(slug: string): Promise<Article[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.articles);
  if (!hasPublicEnv) return [];
  const { data } = await publicClient()
    .from("articles")
    .select(
      "*, category:categories(id, name, slug, description, created_at, updated_at)"
    )
    .eq("status", "published")
    .eq("category.slug", slug)
    .order("published_at", { ascending: false });
  return (data as Article[] | null) ?? [];
}

export async function getPublishedPages(): Promise<Page[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.pages);
  if (!hasPublicEnv) return [];
  const { data } = await publicClient()
    .from("pages")
    .select("*")
    .eq("published", true)
    .order("title", { ascending: true });
  return (data as Page[] | null) ?? [];
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.pages);
  if (!hasPublicEnv) return null;
  const { data } = await publicClient()
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return (data as Page | null) ?? null;
}

export async function getSiteName(): Promise<string> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.settings);
  const settings = await getSiteSettings();
  return settings?.site?.name || "Fashion Blog";
}

export async function getCategorizedForSitemap(): Promise<{
  articles: { slug: string; updated_at: string; published_at: string | null }[];
  categories: { slug: string; updated_at: string }[];
  pages: { slug: string; updated_at: string }[];
}> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.articles);
  cacheTag(TAGS.categories);
  cacheTag(TAGS.pages);
  if (!hasPublicEnv) return { articles: [], categories: [], pages: [] };
  const [a, c, p] = await Promise.all([
    publicClient()
      .from("articles")
      .select("slug, updated_at, published_at")
      .eq("status", "published"),
    publicClient().from("categories").select("slug, updated_at"),
    publicClient()
      .from("pages")
      .select("slug, updated_at")
      .eq("published", true),
  ]);
  return {
    articles: (a.data ?? []) as {
      slug: string;
      updated_at: string;
      published_at: string | null;
    }[],
    categories: (c.data ?? []) as { slug: string; updated_at: string }[],
    pages: (p.data ?? []) as { slug: string; updated_at: string }[],
  };
}