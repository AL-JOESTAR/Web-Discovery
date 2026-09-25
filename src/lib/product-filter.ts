import type { AffiliateLink } from "@/lib/types";

export type SortKey = "terbaru" | "harga-asc" | "harga-desc" | "nama";

export type BudgetKey = "" | "<100k" | "100-250k" | "250-500k" | ">500k";

export const BUDGET_RANGES: Record<
  Exclude<BudgetKey, "">,
  [number, number | null]
> = {
  "<100k": [0, 100_000],
  "100-250k": [100_000, 250_000],
  "250-500k": [250_000, 500_000],
  ">500k": [500_000, null],
};

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "terbaru", label: "Terbaru" },
  { value: "harga-asc", label: "Harga: Rendah ke Tinggi" },
  { value: "harga-desc", label: "Harga: Tinggi ke Rendah" },
  { value: "nama", label: "Nama A–Z" },
];

export const BUDGET_OPTIONS: { value: BudgetKey; label: string }[] = [
  { value: "", label: "Semua Budget" },
  { value: "<100k", label: "< 100 rb" },
  { value: "100-250k", label: "100 – 250 rb" },
  { value: "250-500k", label: "250 – 500 rb" },
  { value: ">500k", label: "> 500 rb" },
];

export function matchesBudget(harga: number | null, budget: BudgetKey): boolean {
  if (!budget) return true;
  if (harga == null || Number.isNaN(harga)) return false;
  const [min, max] = BUDGET_RANGES[budget];
  if (harga < min || harga < 0) return false;
  if (max != null && harga > max) return false;
  return true;
}

export function getKategoriOptions(products: AffiliateLink[]): string[] {
  return [
    ...new Set(products.map((p) => p.kategori?.trim()).filter(Boolean)),
  ] as string[];
}

export function filterProducts(
  products: AffiliateLink[],
  {
    query,
    kategori,
    budget,
    sort,
  }: {
    query: string;
    kategori: string;
    budget: BudgetKey;
    sort: SortKey;
  }
): AffiliateLink[] {
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
}