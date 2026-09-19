import { adminClient } from "@/lib/supabase/admin";
import { hasAdminEnv } from "@/lib/config";
import type { AffiliateLink, Article, Category, Page } from "@/lib/types";

const db = () => adminClient();

export async function countTable(table: string): Promise<number> {
  if (!hasAdminEnv) return 0;
  const { count } = await db().from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function getAllArticles(
  options?: { status?: "draft" | "published" }
): Promise<Article[]> {
  if (!hasAdminEnv) return [];
  let query = db()
    .from("articles")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false });
  if (options?.status) query = query.eq("status", options.status);
  const { data } = await query;
  return (data as Article[] | null) ?? [];
}

export async function getArticleById(id: string): Promise<Article | null> {
  if (!hasAdminEnv) return null;
  const { data } = await db()
    .from("articles")
    .select("*, category:categories(*)")
    .eq("id", id)
    .single();
  return (data as Article | null) ?? null;
}

export async function getAllCategories(): Promise<Category[]> {
  if (!hasAdminEnv) return [];
  const { data } = await db()
    .from("categories")
    .select("*")
    .order("name", { ascending: true });
  return (data as Category[] | null) ?? [];
}

export async function getCategoryById(id: string): Promise<Category | null> {
  if (!hasAdminEnv) return null;
  const { data } = await db()
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();
  return (data as Category | null) ?? null;
}

export async function getAllPages(): Promise<Page[]> {
  if (!hasAdminEnv) return [];
  const { data } = await db()
    .from("pages")
    .select("*")
    .order("updated_at", { ascending: false });
  return (data as Page[] | null) ?? [];
}

export async function getPageById(id: string): Promise<Page | null> {
  if (!hasAdminEnv) return null;
  const { data } = await db()
    .from("pages")
    .select("*")
    .eq("id", id)
    .single();
  return (data as Page | null) ?? null;
}

export async function getSiteSettingsAdmin(): Promise<Record<string, unknown> | null> {
  if (!hasAdminEnv) return null;
  const { data } = await db()
    .from("site_settings")
    .select("value")
    .eq("key", "site")
    .single();
  return (data?.value as Record<string, unknown>) ?? null;
}

export async function getAllAffiliateLinks(): Promise<AffiliateLink[]> {
  if (!hasAdminEnv) return [];
  const { data } = await db()
    .from("affiliate_links")
    .select("*")
    .order("nama", { ascending: true });
  return (data as AffiliateLink[] | null) ?? [];
}

export async function getAffiliateLinkById(id: string): Promise<AffiliateLink | null> {
  if (!hasAdminEnv) return null;
  const { data } = await db()
    .from("affiliate_links")
    .select("*")
    .eq("id", id)
    .single();
  return (data as AffiliateLink | null) ?? null;
}

export async function getAffiliateKategoriOptions(): Promise<string[]> {
  if (!hasAdminEnv) return [];
  const { data } = await db()
    .from("categories")
    .select("name")
    .order("name", { ascending: true });
  const categories = (data as { name: string }[] | null) ?? [];
  return [...new Set(categories.map((c) => c.name.trim()).filter(Boolean))];
}