"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createNote, updateNote } from "@/app/admin/actions";
import type { AdminNote } from "@/lib/types";

export function NoteForm({ note }: { note?: AdminNote }) {
  const router = useRouter();
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [pinned, setPinned] = useState(note?.pinned ?? false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("title", title);
    fd.set("content", content);
    fd.set("pinned", pinned ? "true" : "false");
    if (note) fd.set("id", note.id);

    startTransition(async () => {
      setError("");
      const fn = note ? updateNote : createNote;
      const res = await fn({ ok: false }, fd);
      if (res.ok) router.push("/admin/catatan");
      else setError(res.error || "Terjadi kesalahan.");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl space-y-4 p-5">
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      <div>
        <label className="label">Judul *</label>
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="cth: Ide artikel minggu depan"
        />
      </div>
      <div>
        <label className="label">Isi Catatan</label>
        <textarea
          className="textarea"
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tulis catatan di sini..."
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          checked={pinned}
          onChange={(e) => setPinned(e.target.checked)}
          className="h-4 w-4 rounded border-stone-300 text-accent focus:ring-accent/30"
        />
        Sematkan catatan ke atas
      </label>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/admin/catatan")}
          className="btn-ghost"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isPending || !title}
          className="btn-primary disabled:opacity-50"
        >
          {isPending ? "Menyimpan..." : note ? "Simpan Perubahan" : "Simpan"}
        </button>
      </div>
    </form>
  );
}
