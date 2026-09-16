"use client";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import {
  searchPexels,
  downloadPexelsImage,
  type PexelsSearchImage,
} from "@/app/admin/actions";

export function PexelsSearch({
  onSelect,
}: {
  onSelect: (url: string, alt: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<PexelsSearchImage[]>([]);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [isSearching, startSearch] = useTransition();

  function handleSearch() {
    const q = query.trim();
    if (!q) return;
    setError("");
    startSearch(async () => {
      const res = await searchPexels(q);
      if (res.ok) {
        setImages(res.images);
        if (res.images.length === 0) setError("Tidak ada gambar ditemukan.");
      } else {
        setError(res.error);
        setImages([]);
      }
    });
  }

  async function handleSelect(img: PexelsSearchImage) {
    if (loadingId !== null) return;
    setError("");
    setLoadingId(img.id);
    try {
      const res = await downloadPexelsImage(img.full);
      if (res.ok) {
        onSelect(res.url, img.alt);
      } else {
        setError(res.error);
      }
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="mt-2 space-y-3">
      <div className="flex gap-2">
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Cari gambar di Pexels..."
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={!query.trim() || isSearching}
          className="btn-ghost shrink-0 gap-1.5 !px-4 !py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Search className="h-3.5 w-3.5" />
          {isSearching ? "Mencari..." : "Cari"}
        </button>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {images.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => handleSelect(img)}
              disabled={loadingId !== null}
              className="group relative aspect-square overflow-hidden rounded-lg border border-stone-200 transition-all hover:border-accent hover:ring-2 hover:ring-accent/30 disabled:cursor-wait"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.thumbnail}
                alt={img.alt || `Pexels: ${img.photographer}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {loadingId === img.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-stone-900/50">
                  <span className="text-[10px] font-semibold text-white">
                    Mengunduh...
                  </span>
                </div>
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-900/80 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="truncate text-[9px] text-white">
                  {img.photographer}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
      <p className="text-[10px] leading-relaxed text-stone-400">
        Foto oleh Pexels — bisa dipakai bebas sesuai lisensi Pexels. Klik salah
        satu gambar untuk menyimpannya ke galeri situs.
      </p>
    </div>
  );
}