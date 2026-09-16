"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { TAGS } from "@/lib/config";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: admin } = await supabase
    .from("admins")
    .select("email")
    .eq("email", user.email)
    .single();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export type ActionState = {
  ok: boolean;
  error?: string;
  slug?: string;
  id?: string;
};

// ─── Articles ────────────────────────────────────────────────────────────────

export async function createArticle(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  const customSlug = String(formData.get("slug") || "").trim();
  const category_id = String(formData.get("category_id") || "") || null;
  const excerpt = String(formData.get("excerpt") || "").trim() || null;
  const content_html = String(formData.get("content_html") || "").trim();
  const content_json = String(formData.get("content_json") || "").trim();
  const cover_image = String(formData.get("cover_image") || "").trim() || null;
  const status = String(formData.get("status") || "draft");
  const seo_title = String(formData.get("seo_title") || "").trim() || null;
  const seo_description =
    String(formData.get("seo_description") || "").trim() || null;
  const seo_keywords =
    String(formData.get("seo_keywords") || "").trim() || null;
  const template = parseArticleTemplate(
    String(formData.get("template") || "classic")
  );
  const gallery = parseGallery(String(formData.get("gallery") || ""));

  if (!title) return { ok: false, error: "Judul harus diisi." };

  const slug = customSlug || slugify(title);
  if (!slug) return { ok: false, error: "Slug tidak valid." };

  const published_at =
    status === "published" ? new Date().toISOString() : null;

  const { data, error } = await adminClient()
    .from("articles")
    .insert({
      title,
      slug,
      category_id,
      excerpt,
      content_html,
      content_json: content_json ? JSON.parse(content_json) : null,
      cover_image,
      status,
      seo_title,
      seo_description,
      seo_keywords,
      template,
      gallery,
      published_at,
    })
    .select("id, slug")
    .single();

  if (error) {
    if (error.code === "23505")
      return { ok: false, error: "Slug sudah digunakan." };
    return { ok: false, error: "Gagal menyimpan artikel." };
  }

  revalidateTag(TAGS.articles, "hours");
  revalidateTag(TAGS.settings, "hours");
  revalidatePath("/blog");
  if (status === "published") {
    revalidatePath(`/blog/${data.slug}`);
  }

  return { ok: true, id: data.id, slug: data.slug };
}

export async function updateArticle(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const customSlug = String(formData.get("slug") || "").trim();
  const category_id = String(formData.get("category_id") || "") || null;
  const excerpt = String(formData.get("excerpt") || "").trim() || null;
  const content_html = String(formData.get("content_html") || "").trim();
  const content_json = String(formData.get("content_json") || "").trim();
  const cover_image = String(formData.get("cover_image") || "").trim() || null;
  const status = String(formData.get("status") || "draft");
  const seo_title = String(formData.get("seo_title") || "").trim() || null;
  const seo_description =
    String(formData.get("seo_description") || "").trim() || null;
  const seo_keywords =
    String(formData.get("seo_keywords") || "").trim() || null;
  const template = parseArticleTemplate(
    String(formData.get("template") || "classic")
  );
  const gallery = parseGallery(String(formData.get("gallery") || ""));

  if (!id || !title) return { ok: false, error: "Data tidak lengkap." };

  const slug = customSlug || slugify(title);

  const { data: oldArticle } = await adminClient()
    .from("articles")
    .select("slug, status")
    .eq("id", id)
    .single();
  const oldSlug = oldArticle?.slug ?? slug;
  const wasPublished = oldArticle?.status === "published";

  const published_at =
    status === "published" && !wasPublished
      ? new Date().toISOString()
      : undefined;

  const updateData: Record<string, unknown> = {
    title,
    slug,
    category_id,
    excerpt,
    content_html,
    content_json: content_json ? JSON.parse(content_json) : null,
    cover_image,
    status,
    seo_title,
    seo_description,
    seo_keywords,
    template,
    gallery,
    updated_at: new Date().toISOString(),
  };
  if (published_at) updateData.published_at = published_at;

  const { error } = await adminClient()
    .from("articles")
    .update(updateData)
    .eq("id", id);

  if (error) {
    if (error.code === "23505")
      return { ok: false, error: "Slug sudah digunakan." };
    return { ok: false, error: "Gagal mengupdate artikel." };
  }

  revalidateTag(TAGS.articles, "hours");
  revalidateTag(TAGS.settings, "hours");
  revalidatePath("/blog");
  revalidatePath(`/blog/${oldSlug}`);
  if (oldSlug !== slug) revalidatePath(`/blog/${slug}`);

  return { ok: true, id, slug };
}

export async function deleteArticle(id: string): Promise<ActionState> {
  await requireAdmin();
  const { data } = await adminClient()
    .from("articles")
    .select("slug")
    .eq("id", id)
    .single();
  const slug = data?.slug;

  const { error } = await adminClient()
    .from("articles")
    .delete()
    .eq("id", id);
  if (error) return { ok: false, error: "Gagal menghapus." };

  revalidateTag(TAGS.articles, "hours");
  revalidateTag(TAGS.settings, "hours");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
  return { ok: true };
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function createCategory(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const customSlug = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;
  const seo_title = String(formData.get("seo_title") || "").trim() || null;
  const seo_description =
    String(formData.get("seo_description") || "").trim() || null;

  if (!name) return { ok: false, error: "Nama kategori harus diisi." };
  const slug = customSlug || slugify(name);

  const { data, error } = await adminClient()
    .from("categories")
    .insert({ name, slug, description, seo_title, seo_description })
    .select("id, slug")
    .single();
  if (error) {
    if (error.code === "23505")
      return { ok: false, error: "Slug kategori sudah digunakan." };
    return { ok: false, error: "Gagal menyimpan." };
  }

  revalidateTag(TAGS.categories, "hours");
  revalidatePath("/kategori");
  revalidatePath(`/kategori/${slug}`);
  revalidatePath("/");
  return { ok: true, id: data.id, slug: data.slug };
}

export async function updateCategory(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const customSlug = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;
  const seo_title = String(formData.get("seo_title") || "").trim() || null;
  const seo_description =
    String(formData.get("seo_description") || "").trim() || null;

  if (!id || !name) return { ok: false, error: "Data tidak lengkap." };
  const slug = customSlug || slugify(name);

  const { data: old } = await adminClient()
    .from("categories")
    .select("slug")
    .eq("id", id)
    .single();
  const oldSlug = old?.slug ?? slug;

  const { error } = await adminClient()
    .from("categories")
    .update({
      name,
      slug,
      description,
      seo_title,
      seo_description,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    if (error.code === "23505")
      return { ok: false, error: "Slug kategori sudah digunakan." };
    return { ok: false, error: "Gagal mengupdate." };
  }

  revalidateTag(TAGS.categories, "hours");
  revalidateTag(TAGS.articles, "hours");
  revalidatePath("/kategori");
  revalidatePath(`/kategori/${oldSlug}`);
  if (oldSlug !== slug) revalidatePath(`/kategori/${slug}`);
  revalidatePath("/");
  return { ok: true, id, slug };
}

export async function deleteCategory(id: string): Promise<ActionState> {
  await requireAdmin();
  const { data } = await adminClient()
    .from("categories")
    .select("slug")
    .eq("id", id)
    .single();
  const slug = data?.slug;

  const { error } = await adminClient()
    .from("categories")
    .delete()
    .eq("id", id);
  if (error) return { ok: false, error: "Gagal menghapus." };

  revalidateTag(TAGS.categories, "hours");
  revalidateTag(TAGS.articles, "hours");
  revalidatePath("/kategori");
  if (slug) revalidatePath(`/kategori/${slug}`);
  revalidatePath("/");
  return { ok: true };
}

// ─── Pages ───────────────────────────────────────────────────────────────────

export async function createPage(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  const customSlug = String(formData.get("slug") || "").trim();
  const content_html = String(formData.get("content_html") || "").trim();
  const content_json = String(formData.get("content_json") || "").trim();
  const published = String(formData.get("published") || "true") === "true";
  const seo_title = String(formData.get("seo_title") || "").trim() || null;
  const seo_description =
    String(formData.get("seo_description") || "").trim() || null;

  if (!title) return { ok: false, error: "Judul harus diisi." };
  const slug = customSlug || slugify(title);

  const { data, error } = await adminClient()
    .from("pages")
    .insert({
      title,
      slug,
      content_html,
      content_json: content_json ? JSON.parse(content_json) : null,
      published,
      seo_title,
      seo_description,
    })
    .select("id, slug")
    .single();
  if (error) {
    if (error.code === "23505")
      return { ok: false, error: "Slug halaman sudah digunakan." };
    return { ok: false, error: "Gagal menyimpan." };
  }

  revalidateTag(TAGS.pages, "hours");
  revalidatePath(`/${slug}`);
  revalidatePath("/");
  return { ok: true, id: data.id, slug: data.slug };
}

export async function updatePage(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const customSlug = String(formData.get("slug") || "").trim();
  const content_html = String(formData.get("content_html") || "").trim();
  const content_json = String(formData.get("content_json") || "").trim();
  const published = String(formData.get("published") || "true") === "true";
  const seo_title = String(formData.get("seo_title") || "").trim() || null;
  const seo_description =
    String(formData.get("seo_description") || "").trim() || null;

  if (!id || !title) return { ok: false, error: "Data tidak lengkap." };
  const slug = customSlug || slugify(title);

  const { data: old } = await adminClient()
    .from("pages")
    .select("slug")
    .eq("id", id)
    .single();
  const oldSlug = old?.slug ?? slug;

  const { error } = await adminClient()
    .from("pages")
    .update({
      title,
      slug,
      content_html,
      content_json: content_json ? JSON.parse(content_json) : null,
      published,
      seo_title,
      seo_description,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    if (error.code === "23505")
      return { ok: false, error: "Slug halaman sudah digunakan." };
    return { ok: false, error: "Gagal mengupdate." };
  }

  revalidateTag(TAGS.pages, "hours");
  revalidatePath(`/${oldSlug}`);
  if (oldSlug !== slug) revalidatePath(`/${slug}`);
  revalidatePath("/");
  return { ok: true, id, slug };
}

export async function deletePage(id: string): Promise<ActionState> {
  await requireAdmin();
  const { data } = await adminClient()
    .from("pages")
    .select("slug")
    .eq("id", id)
    .single();
  const slug = data?.slug;

  const { error } = await adminClient().from("pages").delete().eq("id", id);
  if (error) return { ok: false, error: "Gagal menghapus." };

  revalidateTag(TAGS.pages, "hours");
  if (slug) revalidatePath(`/${slug}`);
  revalidatePath("/");
  return { ok: true };
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function updateSiteSettings(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const raw = String(formData.get("settings") || "").trim();
  if (!raw) return { ok: false, error: "Data tidak valid." };

  let value: Record<string, unknown>;
  try {
    value = JSON.parse(raw);
  } catch {
    return { ok: false, error: "JSON tidak valid." };
  }

  const { error } = await adminClient()
    .from("site_settings")
    .upsert({ key: "site", value }, { onConflict: "key" });
  if (error) return { ok: false, error: "Gagal menyimpan." };

  revalidateTag(TAGS.settings, "hours");
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  return { ok: true };
}

// ─── Affiliate Links ────────────────────────────────────────────────────────

const URL_RE = /^https?:\/\/.+/i;
const ARTICLE_TEMPLATES = ["classic", "hero", "magazine"] as const;
type ArticleTemplate = (typeof ARTICLE_TEMPLATES)[number];

function parseArticleTemplate(raw: string): ArticleTemplate {
  return ARTICLE_TEMPLATES.includes(raw as ArticleTemplate)
    ? (raw as ArticleTemplate)
    : "classic";
}

function parseGallery(raw: string): { url: string; alt?: string }[] {
  if (!raw.trim()) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(
    (item): item is { url: string; alt?: string } =>
      !!item &&
      typeof item === "object" &&
      typeof (item as { url?: unknown }).url === "string" &&
      URL_RE.test((item as { url: string }).url)
  );
}

export async function createAffiliateLink(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const nama = String(formData.get("nama") || "").trim();
  const url = String(formData.get("url") || "").trim();
  const kategori = String(formData.get("kategori") || "").trim() || null;

  if (!nama) return { ok: false, error: "Nama harus diisi." };
  if (!URL_RE.test(url)) {
    return { ok: false, error: "URL tidak valid. Gunakan http:// atau https://." };
  }

  const { data, error } = await adminClient()
    .from("affiliate_links")
    .insert({ nama, url, kategori })
    .select("id, nama")
    .single();
  if (error) return { ok: false, error: "Gagal menyimpan link afiliasi." };

  revalidatePath("/admin/affiliate");
  revalidatePath("/admin/prompt");
  return { ok: true, id: data.id };
}

export async function updateAffiliateLink(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const nama = String(formData.get("nama") || "").trim();
  const url = String(formData.get("url") || "").trim();
  const kategori = String(formData.get("kategori") || "").trim() || null;

  if (!id || !nama) return { ok: false, error: "Data tidak lengkap." };
  if (!URL_RE.test(url)) {
    return { ok: false, error: "URL tidak valid. Gunakan http:// atau https://." };
  }

  const { error } = await adminClient()
    .from("affiliate_links")
    .update({ nama, url, kategori, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: "Gagal mengupdate link afiliasi." };

  revalidatePath("/admin/affiliate");
  revalidatePath("/admin/prompt");
  return { ok: true, id };
}

export async function deleteAffiliateLink(id: string): Promise<ActionState> {
  await requireAdmin();
  const { error } = await adminClient()
    .from("affiliate_links")
    .delete()
    .eq("id", id);
  if (error) return { ok: false, error: "Gagal menghapus." };

  revalidatePath("/admin/affiliate");
  revalidatePath("/admin/prompt");
  return { ok: true };
}

// ─── Upload ──────────────────────────────────────────────────────────────────

export async function uploadImage(formData: FormData): Promise<
  ActionState & { url?: string }
> {
  await requireAdmin();
  const file = formData.get("file") as File | null;
  if (!file) return { ok: false, error: "File tidak ada." };

  const ext = file.name.split(".").pop() || "jpg";
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await adminClient().storage
    .from("images")
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
  if (error) return { ok: false, error: `Gagal upload: ${error.message}` };

  const {
    data: { publicUrl },
  } = adminClient().storage.from("images").getPublicUrl(path);

  return { ok: true, url: publicUrl };
}

// ─── Pexels Image Search ─────────────────────────────────────────────────────

export type PexelsSearchImage = {
  id: number;
  thumbnail: string;
  full: string;
  alt: string;
  photographer: string;
};

export type PexelsSearchResponse =
  | { ok: false; error: string }
  | { ok: true; images: PexelsSearchImage[] };

export async function searchPexels(
  query: string
): Promise<PexelsSearchResponse> {
  await requireAdmin();
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "PEXELS_API_KEY belum dikonfigurasi." };
  }
  const q = query.trim();
  if (!q) return { ok: false, error: "Kata kunci pencarian kosong." };

  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", q);
  url.searchParams.set("per_page", "10");
  url.searchParams.set("orientation", "landscape");

  try {
    const res = await fetch(url, {
      headers: { Authorization: apiKey },
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        ok: false,
        error:
          res.status === 401
            ? "API key Pexels tidak valid."
            : `Pexels API error (${res.status}).`,
      };
    }
    const data = await res.json();
    const photos = (data as { photos?: unknown[] }).photos ?? [];
    const images: PexelsSearchImage[] = photos
      .map((p) => {
        const photo = p as {
          id?: number;
          src?: { medium?: string; large2x?: string; original?: string };
          alt?: string;
          photographer?: string;
        };
        return {
          id: photo.id ?? 0,
          thumbnail: photo.src?.medium ?? "",
          full: photo.src?.large2x ?? photo.src?.original ?? "",
          alt: photo.alt ?? "",
          photographer: photo.photographer ?? "",
        };
      })
      .filter((img) => img.thumbnail && img.full);
    return { ok: true, images };
  } catch {
    return { ok: false, error: "Gagal menghubungi Pexels." };
  }
}

export type DownloadPexelsResponse =
  | { ok: false; error: string }
  | { ok: true; url: string };

export async function downloadPexelsImage(
  imageUrl: string
): Promise<DownloadPexelsResponse> {
  await requireAdmin();
  if (!URL_RE.test(imageUrl)) {
    return { ok: false, error: "URL gambar tidak valid." };
  }

  try {
    const res = await fetch(imageUrl, { cache: "no-store" });
    if (!res.ok) {
      return { ok: false, error: "Gagal mengunduh gambar dari Pexels." };
    }
    const blob = await res.blob();
    const ext =
      blob.type === "image/png"
        ? "png"
        : blob.type === "image/webp"
          ? "webp"
          : "jpg";
    const path = `pexels/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await adminClient().storage
      .from("images")
      .upload(path, blob, {
        contentType: blob.type || "image/jpeg",
        upsert: false,
      });
    if (error) {
      return { ok: false, error: `Gagal upload: ${error.message}` };
    }

    const {
      data: { publicUrl },
    } = adminClient().storage.from("images").getPublicUrl(path);

    return { ok: true, url: publicUrl };
  } catch {
    return { ok: false, error: "Gagal mengunduh gambar." };
  }
}