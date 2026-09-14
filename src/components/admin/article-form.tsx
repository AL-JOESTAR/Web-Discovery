"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createArticle, updateArticle, type ActionState } from "@/app/admin/actions";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ImageUpload } from "@/components/admin/image-upload";
import { slugify } from "@/lib/utils";
import type { Article, Category } from "@/lib/types";

const emptyState: ActionState = { ok: false };

export function ArticleForm({
  article,
  categories,
  prefillTitle,
  prefillSlug,
}: {
  article?: Article;
  categories: Category[];
  prefillTitle?: string;
  prefillSlug?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title ?? prefillTitle ?? "");
  const [slug, setSlug] = useState(article?.slug ?? prefillSlug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!article || !!prefillSlug);
  const [categoryId, setCategoryId] = useState(article?.category_id ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(article?.cover_image ?? "");
  const [status, setStatus] = useState<"draft" | "published">(
    article?.status ?? "draft"
  );
  const [seoTitle, setSeoTitle] = useState(article?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(
    article?.seo_description ?? ""
  );
  const [seoKeywords, setSeoKeywords] = useState(article?.seo_keywords ?? "");
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("title", title);
    fd.set("slug", slug);
    fd.set("category_id", categoryId);
    fd.set("excerpt", excerpt);
    fd.set("cover_image", coverImage);
    fd.set("status", status);
    fd.set("seo_title", seoTitle);
    fd.set("seo_description", seoDescription);
    fd.set("seo_keywords", seoKeywords);
    fd.set("content_html", contentHtml);
    fd.set("content_json", contentJson);
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
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-5xl"
    >
      {error && (
<p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
      )}

      {/* Basic */}
      <div className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-stone-900">
          Informasi Artikel
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label">Judul *</label>
            <input
              className="input"
              value={title}
              onChange={handleTitleChange}
              required
            />
          </div>
          <div>
            <label className="label">Slug</label>
            <input
              className="input"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEdited(true);
              }}
              placeholder="auto-dari-judul"
            />
          </div>
          <div>
            <label className="label">Kategori</label>
            <select
              className="select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Tidak ada kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">Excerpt (ringkasan)</label>
            <textarea
              className="textarea"
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Cover Image</label>
            <ImageUpload value={coverImage} onChange={setCoverImage} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-stone-900">
          Konten
        </h2>
        <RichTextEditor
          initialContent={article?.content_html ?? ""}
          onChangeHtml={setContentHtml}
          onChangeJson={setContentJson}
        />
      </div>

      {/* SEO */}
      <div className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-stone-900">
          SEO (opsional — default pakai judul & excerpt)
        </h2>
        <div className="grid gap-4">
          <div>
            <label className="label">SEO Title</label>
            <input
              className="input"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder={title}
            />
          </div>
          <div>
            <label className="label">SEO Description</label>
            <textarea
              className="textarea"
              rows={2}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder={excerpt}
            />
          </div>
          <div>
            <label className="label">Keywords (dipisah koma)</label>
            <input
              className="input"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => setStatus("draft")}
            className={`btn ${
              status === "draft" ? "btn-primary" : "btn-ghost"
            }`}
          >
            Draft
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