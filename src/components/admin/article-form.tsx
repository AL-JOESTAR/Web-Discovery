"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createArticle, updateArticle, type ActionState } from "@/app/admin/actions";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SeoPanel } from "@/components/admin/seo-panel";
import { SerpPreview } from "@/components/admin/serp-preview";
import { TagInput } from "@/components/admin/tag-input";
import { slugify } from "@/lib/utils";
import type { Article, ArticleTemplate, Category, GalleryImage } from "@/lib/types";

const emptyState: ActionState = { ok: false };

function titleBorderClass({
  title,
  focusKeyword,
}: {
  title: string;
  focusKeyword: string;
}): string {
  const kw = focusKeyword.trim().toLowerCase();
  const titleLower = title.trim().toLowerCase();
  const hasKw = titleLower.includes(kw);
  const len = title.trim().length;
  const lenOk = len >= 50 && len <= 60;

  if (!title.trim()) return "border-red-500";
  if (hasKw && lenOk) return "border-green-500";
  if (hasKw || lenOk) return "border-yellow-500";
  return "border-red-500";
}

export function ArticleForm({
  article,
  categories,
  prefillTitle,
  prefillSlug,
  siteName,
  siteDomain,
}: {
  article?: Article;
  categories: Category[];
  prefillTitle?: string;
  prefillSlug?: string;
  siteName?: string;
  siteDomain?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title ?? prefillTitle ?? "");
  const [slug, setSlug] = useState(article?.slug ?? prefillSlug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!article || !!prefillSlug);
  const [categoryId, setCategoryId] = useState(article?.category_id ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(article?.cover_image ?? "");
  const [coverAlt, setCoverAlt] = useState("");
  const [template, setTemplate] = useState<ArticleTemplate>(
    article?.template ?? "classic"
  );
  const [gallery, setGallery] = useState<GalleryImage[]>(article?.gallery ?? []);
  const [status, setStatus] = useState<"draft" | "published">(
    article?.status ?? "draft"
  );
  const [seoDescription, setSeoDescription] = useState(
    article?.seo_description ?? ""
  );
  const [seoKeywords, setSeoKeywords] = useState(article?.seo_keywords ?? "");
  const [focusKeyword, setFocusKeyword] = useState(
    (article?.seo_keywords ?? "").split(",")[0] || ""
  );
  const [contentHtml, setContentHtml] = useState(
    article?.content_html ?? ""
  );
  const [contentJson, setContentJson] = useState(
    article?.content_json ? JSON.stringify(article.content_json) : ""
  );

  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    if (!slugEdited) setSlug(slugify(e.target.value));
  }

  function handleFocusKeywordChange(k: string) {
    setFocusKeyword(k);
    setSeoKeywords((prev) => {
      const existing = prev
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      if (k.trim() && !existing.includes(k.trim().toLowerCase())) {
        return [...existing, k.trim().toLowerCase()].join(", ");
      }
      return prev;
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("title", title);
    fd.set("slug", slug);
    fd.set("category_id", categoryId);
    fd.set("excerpt", excerpt);
    fd.set("cover_image", coverImage);
    fd.set("status", status);
    fd.set("seo_title", article?.seo_title || title);
    fd.set("seo_description", seoDescription || excerpt);
    fd.set("seo_keywords", seoKeywords);
    fd.set("content_html", contentHtml);
    fd.set("content_json", contentJson);
    fd.set("template", template);
    fd.set("gallery", JSON.stringify(gallery));
    if (article) fd.set("id", article.id);

    startTransition(async () => {
      setError("");
      const fn = article ? updateArticle : createArticle;
      const res = await fn(emptyState, fd);
      if (res.ok) router.push("/admin/artikel");
      else setError(res.error || "Terjadi kesalahan.");
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr),400px]">
        {/* Kolom kiri — editor konten */}
        <div className="space-y-6">
          <div className="card p-5">
            <label className="label text-lg font-semibold text-stone-900">
              Judul Artikel *
            </label>
            <input
              className={`input-title-seo ${titleBorderClass({
                title,
                focusKeyword,
              })}`}
              value={title}
              onChange={handleTitleChange}
              required
              placeholder="Tulis judul yang menarik dan mengandung keyword utama..."
            />
            <p className="mt-1.5 text-xs text-stone-500">
              {title.trim().length}/60 karakter
              {focusKeyword.trim() &&
                (title.toLowerCase().includes(focusKeyword.trim().toLowerCase())
                  ? " \u00b7 keyword ditemukan di judul \u2713"
                  : " \u00b7 keyword belum ada di judul")}
            </p>
          </div>

          <div className="card p-5">
            <label className="label">Meta Description</label>
            <textarea
              className="textarea"
              rows={3}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Deskripsi singkat 120\u2013155 karakter yang memikat & mengandung keyword..."
            />
            <p className="mt-1.5 text-xs text-stone-500">
              {seoDescription.trim().length}/155 karakter
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr,1.4fr]">
            <div className="card p-5">
              <label className="label">Excerpt (ringkasan)</label>
              <textarea
                className="textarea"
                rows={4}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Ringkasan singkat untuk ditampilkan di kartu artikel..."
              />
            </div>
            <div className="card p-5">
              <label className="label">Tags (dipisah koma)</label>
              <TagInput
                value={seoKeywords}
                onChange={setSeoKeywords}
                placeholder="Ketik tag lalu Enter..."
              />
              <p className="mt-1.5 text-xs text-stone-500">
                {seoKeywords
                  ? `${seoKeywords.split(",").filter((t) => t.trim()).length} tag`
                  : "Tambahkan tag untuk membantu mesin pencari."}
              </p>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-stone-100 px-5 py-3">
              <h2 className="text-sm font-semibold text-stone-900">Konten</h2>
              {focusKeyword.trim() && (
                <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[11px] font-semibold text-yellow-800">
                  Keyword: {focusKeyword}
                </span>
              )}
            </div>
            <RichTextEditor
              initialContent={article?.content_html ?? ""}
              onChangeHtml={setContentHtml}
              onChangeJson={setContentJson}
              focusKeyword={focusKeyword}
            />
          </div>
        </div>

        {/* Kolom kanan — panel analisis SEO */}
        <SeoPanel
          title={title}
          metaDescription={seoDescription}
          slug={slug}
          focusKeyword={focusKeyword}
          contentHtml={contentHtml}
          categories={categories}
          categoryId={categoryId}
          coverImage={coverImage}
          coverAlt={coverAlt}
          onSlugChange={(s) => {
            setSlug(s);
            setSlugEdited(true);
          }}
          onFocusKeywordChange={handleFocusKeywordChange}
          onCoverImageChange={setCoverImage}
          onCoverAltChange={setCoverAlt}
          onCategoryChange={setCategoryId}
          template={template}
          onTemplateChange={setTemplate}
          gallery={gallery}
          onGalleryChange={setGallery}
        />
      </div>

      {/* Presentasi di Google — full width */}
      <div className="card mt-6">
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-3">
          <h2 className="text-sm font-semibold text-stone-900">
            Presentasi di Google
          </h2>
          <span className="text-xs text-stone-400">live preview</span>
        </div>
        <div className="p-5">
          <p className="mb-3 text-xs text-stone-500">
            Berikut cara artikel tampil di mesin pencari. Perubahan tampil secara real-time saat kamu mengetik.
          </p>
          <SerpPreview
            siteName={siteName ?? ""}
            siteDomain={siteDomain ?? ""}
            title={title}
            metaDescription={seoDescription}
            slug={slug}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => setStatus("draft")}
            className={`btn ${
              status === "draft" ? "btn-primary" : "btn-ghost"
            }`}
          >
            Simpan Draft
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => setStatus("published")}
            className={`btn ${
              status === "published" ? "btn-primary" : "btn-ghost"
            }`}
          >
            Publish
          </button>
        </div>
        <button
          type="submit"
          disabled={isPending || !title}
          className="btn-primary disabled:opacity-50"
        >
          {isPending ? "Menyimpan..." : article ? "Simpan Perubahan" : "Simpan"}
        </button>
      </div>
    </form>
  );
}