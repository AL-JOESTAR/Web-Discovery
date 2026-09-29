import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatPrice(harga: number | null): string {
  if (harga == null || Number.isNaN(harga)) return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(harga);
}

export function formatCount(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value) || value <= 0) return "";

  const units: [number, string][] = [
    [1_000_000, "jt"],
    [1000, "rb"],
  ];
  for (const [divisor, suffix] of units) {
    if (value < divisor) continue;
    const scaled = value / divisor;
    // Di bawah 10 pertahankan satu desimal, di atasnya bulatkan agar ringkas.
    const text = new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: scaled < 10 ? 1 : 0,
    }).format(scaled);
    return `${text}${suffix}`;
  }
  return new Intl.NumberFormat("id-ID").format(value);
}

export function formatDate(date: string | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function readingTime(contentHtml: string | null): number {
  if (!contentHtml) return 1;
  const text = contentHtml.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function stripHtml(html: string | null): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function textToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
}