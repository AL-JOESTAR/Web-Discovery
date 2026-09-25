"use client";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/site/product-card";
import {
  BUDGET_OPTIONS,
  SORT_OPTIONS,
  filterProducts,
  getKategoriOptions,
  type BudgetKey,
  type SortKey,
} from "@/lib/product-filter";
import type { AffiliateLink } from "@/lib/types";

const PAGE_SIZE = 12;

export function ShopProducts({ products }: { products: AffiliateLink[] }) {
  const [query, setQuery] = useState("");
  const [kategori, setKategori] = useState("");
  const [budget, setBudget] = useState<BudgetKey>("");
  const [sort, setSort] = useState<SortKey>("terbaru");
  const [page, setPage] = useState(1);

  const kategoriOptions = useMemo(() => getKategoriOptions(products), [products]);

  const filtered = useMemo(
    () => filterProducts(products, { query, kategori, budget, sort }),
    [products, query, kategori, budget, sort]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
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
              setPage(1);
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
              setPage(1);
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
              setPage(1);
            }}
            aria-label="Filter budget"
          >
            {BUDGET_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            className="select"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortKey);
              setPage(1);
            }}
            aria-label="Urutkan"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mx-auto mt-14 max-w-md rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
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
            {filtered.length} produk ditemukan
          </p>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
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
        </>
      )}
    </div>
  );
}