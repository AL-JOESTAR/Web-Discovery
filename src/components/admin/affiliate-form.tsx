"use client";
import { useId, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createAffiliateLink,
  updateAffiliateLink,
} from "@/app/admin/actions";
import { ImageUpload } from "@/components/admin/image-upload";
import { MARKETPLACES, detectMarketplace } from "@/lib/marketplace";
import type { AffiliateLink } from "@/lib/types";

const HTTP_URL_RE = /^https?:\/\/.+/i;

export function AffiliateForm({
  link,
  kategoriOptions = [],
}: {
  link?: AffiliateLink;
  kategoriOptions?: string[];
}) {
  const router = useRouter();
  const uid = useId();
  const [nama, setNama] = useState(link?.nama ?? "");
  const [url, setUrl] = useState(link?.url ?? "");
  const [kategori, setKategori] = useState(link?.kategori ?? "");
  const [marketplace, setMarketplace] = useState(link?.marketplace ?? "");
  const [gambar, setGambar] = useState(link?.gambar ?? "");
  const [harga, setHarga] = useState(
    link?.harga != null ? String(link.harga) : ""
  );
  const [rating, setRating] = useState(
    link?.rating != null ? String(link.rating) : ""
  );
  const [ratingCount, setRatingCount] = useState(
    link?.rating_count != null ? String(link.rating_count) : ""
  );
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const detected = useMemo(() => detectMarketplace(url), [url]);
  const canOpenUrl = HTTP_URL_RE.test(url.trim());

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("nama", nama);
    fd.set("url", url);
    fd.set("kategori", kategori);
    fd.set("marketplace", marketplace);
    fd.set("gambar", gambar);
    fd.set("harga", harga);
    fd.set("rating", rating);
    fd.set("rating_count", ratingCount);
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
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div>
        <label className="label" htmlFor={`${uid}-nama`}>
          Nama Produk *
        </label>
        <input
          id={`${uid}-nama`}
          className="input"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
          placeholder="cth: celana cargo hitam"
        />
      </div>
      <div>
        <label className="label" htmlFor={`${uid}-url`}>
          URL Afiliasi *
        </label>
        <input
          id={`${uid}-url`}
          className="input"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://contoh.com/afiliasi/..."
        />
        {canOpenUrl && (
          <a
            href={url.trim()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-block text-xs font-medium text-accent hover:underline"
          >
            Buka produk untuk melihat rating &amp; ulasan &rarr;
          </a>
        )}
      </div>
      <div>
        <label className="label" htmlFor={`${uid}-kategori`}>
          Kategori (opsional)
        </label>
        <select
          id={`${uid}-kategori`}
          className="select"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
        >
          <option value="">Pilih kategori...</option>
          {kategoriOptions.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-stone-500">
          Kategori mengikuti daftar kategori artikel. Buka Admin Kategori untuk
          menambah kategori baru.
        </p>
      </div>
      <div>
        <label className="label" htmlFor={`${uid}-marketplace`}>
          Marketplace (opsional)
        </label>
        <select
          id={`${uid}-marketplace`}
          className="select"
          value={marketplace}
          onChange={(e) => setMarketplace(e.target.value)}
        >
          <option value="">Otomatis dari URL</option>
          {MARKETPLACES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-stone-500">
          {marketplace
            ? `Dipakai di card: ${marketplace}.`
            : detected
              ? `Terdeteksi dari URL: ${detected}.`
              : "Marketplace tidak terdeteksi dari URL, badge tidak akan tampil."}
        </p>
      </div>
      <div>
        <label className="label" htmlFor={`${uid}-harga`}>
          Harga (opsional)
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-stone-400">
            Rp
          </span>
          <input
            id={`${uid}-harga`}
            className="input pl-9"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            placeholder="cth: 149000"
          />
        </div>
        <p className="mt-1.5 text-xs text-stone-500">
          Dipakai untuk sortir produk di halaman beranda. Kosongkan jika belum
          tahu.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor={`${uid}-rating`}>
            Rating (opsional)
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-stone-400">
              &#9733;
            </span>
            <input
              id={`${uid}-rating`}
              className="input pl-9"
              type="number"
              min="0"
              max="5"
              step="0.1"
              inputMode="decimal"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="cth: 4.8"
            />
          </div>
        </div>
        <div>
          <label className="label" htmlFor={`${uid}-rating-count`}>
            Jumlah Ulasan (opsional)
          </label>
          <input
            id={`${uid}-rating-count`}
            className="input"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={ratingCount}
            onChange={(e) => setRatingCount(e.target.value)}
            placeholder="cth: 1240"
          />
        </div>
        <p className="text-xs text-stone-500 sm:col-span-2">
          Angka 0&ndash;5, diisi manual dari halaman marketplace. Kosongkan bila
          belum ada data — bintang tidak akan tampil di card.
        </p>
      </div>
      <div>
        <label className="label">Gambar Produk (opsional)</label>
        <ImageUpload
          value={gambar}
          onChange={setGambar}
          label="Gambar Produk"
        />
        <p className="mt-1.5 text-xs text-stone-500">
          Gambar produk yang tampil pada kartu di halaman beranda.
        </p>
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
