"use client";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/site/product-card";
import type { AffiliateLink } from "@/lib/types";

type SortKey = "terbaru" | "harga-asc" | "harga-desc" | "nama";

const PAGE_SIZE = 8;

type BudgetKey = "" | "<100k" | "100-250k" | "250-500k" | ">500k";

const BUDGET_RANGES: Record<Exclude<BudgetKey, "">, [number, number | null]> = {
  "<100k": [0, 100_000],
  "100-250k": [100_000, 250_000],
  "250-500k": [250_000, 500_000],
  ">500k": [500_000, null],
};

function matchesBudget(harga: number | null, budget: BudgetKey): boolean {
  if (!budget) return true;
  if (harga == null || Number.isNaN(harga)) return false;
  const [min, max] = BUDGET_RANGES[budget];
  if (harga < min || harga < 0) return false;
  if (max != null && harga > max) return false;
  return true;
}

export function ProductSearch({
  products,
}: {
  products: AffiliateLink[];
}) {
  const [query, setQuery] = useState("");
  const [kategori, setKategori] = useState("");
  const [budget, setBudget] = useState<BudgetKey>("");
  const [sort, setSort] = useState<SortKey>("terbaru");
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  function resetPagination() {
    setPage(1);
    setShowAll(false);
  }

  const kategoriOptions = useMemo(
    () =>
      [...new Set(products.map((p) => p.kategori?.trim()).filter(Boolean))] as string[],
    [products]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products;
    if (q) {
      list = list.filter((p) => p.nama.toLowerCase().includes(q));
    }
    if (kategori) {
      list = list.filter((p) => p.kategori?.trim() === kategori);
    }
    if (budget) {
      list = list.filter((p) => matchesBudget(p.harga, budget));
    }
    const sorted = [...list];
    switch (sort) {
      case "harga-asc":
        sorted.sort(
          (a, b) =>
            (a.harga ?? Number.POSITIVE_INFINITY) -
            (b.harga ?? Number.POSITIVE_INFINITY)
        );
        break;
      case "harga-desc":
        sorted.sort(
          (a, b) =>
            (b.harga ?? Number.NEGATIVE_INFINITY) -
            (a.harga ?? Number.NEGATIVE_INFINITY)
        );
        break;
      case "nama":
        sorted.sort((a, b) => a.nama.localeCompare(b.nama, "id"));
        break;
      default:
        break;
    }
    return sorted;
  }, [products, query, kategori, budget, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const visible = showAll
    ? filtered
    : filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <section className="border-b border-line bg-surface">
      <div className="container-wide py-16 sm:py-20">
        <div className="flex flex-col gap-1 text-center">
          <p className="font-serif text-sm uppercase tracking-[0.3em] text-accent">
            Cari Produk
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Rekomendasi Produk
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Temukan produk fashion pilihan dari tautan afiliasi kami.
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                resetPagination();
              }}
              placeholder="Cari produk..."
              aria-label="Cari produk"
              className="input w-full pl-11"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:flex-none">
            <select
              className="select"
              value={kategori}
              onChange={(e) => {
                setKategori(e.target.value);
                resetPagination();
              }}
              aria-label="Filter kategori"
            >
              <option value="">Semua kategori</option>
              {kategoriOptions.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <select
              className="select"
              value={budget}
              onChange={(e) => {
                setBudget(e.target.value as BudgetKey);
                resetPagination();
              }}
              aria-label="Filter budget"
            >
              <option value="">Semua Budget</option>
              <option value="<100k">&lt; 100 rb</option>
              <option value="100-250k">100 – 250 rb</option>
              <option value="250-500k">250 – 500 rb</option>
              <option value=">500k">&gt; 500 rb</option>
            </select>
            <select
              className="select"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortKey);
                resetPagination();
              }}
              aria-label="Urutkan"
            >
              <option value="terbaru">Terbaru</option>
              <option value="harga-asc">Harga: Rendah ke Tinggi</option>
              <option value="harga-desc">Harga: Tinggi ke Rendah</option>
              <option value="nama">Nama A–Z</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mx-auto mt-12 max-w-md rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
            <p className="font-serif text-lg text-muted">
              Tidak ada produk yang cocok.
            </p>
            <p className="mt-1 text-sm text-stone-400">
              Coba ubah kata kunci, kategori, atau budget.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-8 text-sm text-stone-400">
              Menampilkan {visible.length} dari {filtered.length} produk
            </p>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {!showAll && totalPages > 1 && (
              <nav className="mt-12 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPage(safePage - 1)}
                  disabled={safePage <= 1}
                  className="btn-ghost disabled:pointer-events-none disabled:opacity-40"
                  aria-disabled={safePage <= 1}
                >
                  &larr; Sebelumnya
                </button>
                <span className="px-2 text-sm text-muted">
                  Halaman {safePage} dari {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage(safePage + 1)}
                  disabled={safePage >= totalPages}
                  className="btn-ghost disabled:pointer-events-none disabled:opacity-40"
                  aria-disabled={safePage >= totalPages}
                >
                  Selanjutnya &rarr;
                </button>
              </nav>
            )}

            {filtered.length > PAGE_SIZE && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setShowAll((s) => !s)}
                  className="btn-ghost"
                >
                  {showAll ? "Kembali per Halaman" : "Muat Semua Produk"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}