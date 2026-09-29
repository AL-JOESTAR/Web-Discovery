"use client";
import { ImageUpload } from "@/components/admin/image-upload";
import { extractHeadings } from "@/lib/article-sections";
import type { ArticleSectionImage } from "@/lib/types";

function normalizeHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function SectionImagesInput({
  contentHtml,
  value,
  onChange,
}: {
  contentHtml: string;
  value: ArticleSectionImage[];
  onChange: (items: ArticleSectionImage[]) => void;
}) {
  const headings = extractHeadings(contentHtml);

  const rows = headings.map((heading, index) => {
    const key = normalizeHeading(heading);
    const byText = value.filter((s) => normalizeHeading(s.heading ?? "") === key);
    const prev =
      byText[byText.length - 1] ??
      value.find((s) => s.index === index) ??
      value[index];
    return {
      index,
      heading,
      url: prev?.url ?? "",
      alt: prev?.alt ?? "",
      caption: prev?.caption ?? "",
    };
  });

  function updateRow(rowIndex: number, patch: Partial<ArticleSectionImage>) {
    onChange(
      rows.map((row, i) =>
        i === rowIndex
          ? {
              index: row.index,
              heading: row.heading,
              url: row.url,
              alt: row.alt,
              caption: row.caption,
              ...patch,
            }
          : row
      )
    );
  }

  if (headings.length === 0) {
    return (
      <p className="rounded-lg bg-stone-50 p-3 text-sm text-stone-400">
        Belum ada heading H2 di konten. Tambahkan heading agar setiap bagian
        bisa diberi gambar ilustrasi.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-stone-500">
        Sisipkan satu gambar ilustrasi untuk setiap bagian (H2). Gambar
        otomatis tersebar ke kiri/kanan teks secara bergantian saat tampil di
        situs.
      </p>
      {rows.map((row, i) => (
        <div
          key={row.index}
          className="rounded-xl border border-stone-200 p-3"
        >
          <p className="mb-2 flex items-baseline gap-2 text-xs font-semibold text-stone-500">
            <span className="rounded bg-stone-100 px-1.5 py-0.5 text-stone-600">
              {i + 1}
            </span>
            <span className="truncate">{row.heading}</span>
          </p>
          <ImageUpload
            value={row.url}
            onChange={(url) => updateRow(i, { url })}
            label="Gambar Bagian"
            onAltAutoFill={(alt) => updateRow(i, { alt })}
          />
          <input
            className="input mt-2 text-xs"
            value={row.alt}
            onChange={(e) => updateRow(i, { alt: e.target.value })}
            placeholder="Alt text untuk SEO (deskripsi singkat gambar)"
          />
          <input
            className="input mt-2 text-xs"
            value={row.caption}
            onChange={(e) => updateRow(i, { caption: e.target.value })}
            placeholder="Caption (opsional)"
          />
        </div>
      ))}
    </div>
  );
}