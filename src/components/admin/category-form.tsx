"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory } from "@/app/admin/actions";
import { slugify } from "@/lib/utils";
import type { Category } from "@/lib/types";

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!category);
  const [description, setDescription] = useState(category?.description ?? "");
  const [seoTitle, setSeoTitle] = useState(category?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(
    category?.seo_description ?? ""
  );
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
    if (!slugEdited) setSlug(slugify(e.target.value));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("name", name);
    fd.set("slug", slug);
    fd.set("description", description);
    fd.set("seo_title", seoTitle);
    fd.set("seo_description", seoDescription);
    if (category) fd.set("id", category.id);

    startTransition(async () => {
      setError("");
      const fn = category ? updateCategory : createCategory;
      const res = await fn({ ok: false }, fd);
      if (res.ok) router.push("/admin/kategori");
      else setError(res.error || "Terjadi kesalahan.");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl space-y-4 p-5">
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      <div>
        <label className="label">Nama *</label>
        <input className="input" value={name} onChange={handleNameChange} required />
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
      <div>
        <label className="label">Deskripsi</label>
        <textarea
          className="textarea"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="label">SEO Title</label>
        <input className="input" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
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
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/admin/kategori")}
          className="btn-ghost"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isPending || !name}
          className="btn-primary disabled:opacity-50"
        >
          {isPending ? "Menyimpan..." : category ? "Simpan Perubahan" : "Simpan"}
        </button>
      </div>
    </form>
  );
}