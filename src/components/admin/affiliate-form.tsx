"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createAffiliateLink,
  updateAffiliateLink,
} from "@/app/admin/actions";
import type { AffiliateLink } from "@/lib/types";

export function AffiliateForm({ link }: { link?: AffiliateLink }) {
  const router = useRouter();
  const [nama, setNama] = useState(link?.nama ?? "");
  const [url, setUrl] = useState(link?.url ?? "");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("nama", nama);
    fd.set("url", url);
    if (link) fd.set("id", link.id);

    startTransition(async () => {
      setError("");
      const fn = link ? updateAffiliateLink : createAffiliateLink;
      const res = await fn({ ok: false }, fd);
      if (res.ok) router.push("/admin/affiliate");
      else setError(res.error || "Terjadi kesalahan.");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl space-y-4 p-5">
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      <div>
        <label className="label">Nama Produk *</label>
        <input
          className="input"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
          placeholder="cth: celana cargo hitam"
        />
      </div>
      <div>
        <label className="label">URL Afiliasi *</label>
        <input
          className="input"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://contoh.com/afiliasi/..."
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/admin/affiliate")}
          className="btn-ghost"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isPending || !nama || !url}
          className="btn-primary disabled:opacity-50"
        >
          {isPending ? "Menyimpan..." : link ? "Simpan Perubahan" : "Simpan"}
        </button>
      </div>
    </form>
  );
}