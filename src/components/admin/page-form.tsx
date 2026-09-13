"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPage, updatePage } from "@/app/admin/actions";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { slugify } from "@/lib/utils";
import type { Page } from "@/lib/types";

export function PageForm({ page }: { page?: Page }) {
  const router = useRouter();
  const [title, setTitle] = useState(page?.title ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!page);
  const [published, setPublished] = useState(page?.published ?? true);
  const [seoTitle, setSeoTitle] = useState(page?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(
    page?.seo_description ?? ""
  );
  const [contentHtml, setContentHtml] = useState(page?.content_html ?? "");
  const [contentJson, setContentJson] = useState(
    page?.content_json ? JSON.stringify(page.content_json) : ""
  );
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    if (!slugEdited) setSlug(slugify(e.target.value));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("title", title);
    fd.set("slug", slug);
    fd.set("content_html", contentHtml);
    fd.set("content_json", contentJson);
    fd.set("published", String(published));
    fd.set("seo_title", seoTitle);
    fd.set("seo_description", seoDescription);
    if (page) fd.set("id", page.id);

    startTransition(async () => {
      setError("");
      const fn = page ? updatePage : createPage;
      const res = await fn({ ok: false }, fd);
      if (res.ok) router.push("/admin/pages");
      else setError(res.error || "Terjadi kesalahan.");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-5xl">
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <div className="card p-5">
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
            />
          </div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="accent-accent"
              />
              <span className="text-sm text-stone-700">Dipublikasikan</span>
            </label>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="mb-3 text-sm font-semibold text-stone-900">Konten</h2>
        <RichTextEditor
          initialContent={page?.content_html ?? ""}
          onChangeHtml={setContentHtml}
          onChangeJson={setContentJson}
        />
      </div>

      <div className="card p-5">
        <h2 className="mb-3 text-sm font-semibold text-stone-900">
          SEO (opsional)
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
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/pages")}
          className="btn-ghost"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isPending || !title}
          className="btn-primary disabled:opacity-50"
        >
          {isPending ? "Menyimpan..." : page ? "Simpan Perubahan" : "Simpan"}
        </button>
      </div>
    </form>
  );
}