"use client";
import { ImageUpload } from "@/components/admin/image-upload";
import type { GalleryImage } from "@/lib/types";

export function GalleryInput({
  value,
  onChange,
}: {
  value: GalleryImage[];
  onChange: (items: GalleryImage[]) => void;
}) {
  function updateItem(index: number, patch: Partial<GalleryImage>) {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function removeItem(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {value.map((item, index) => (
        <div key={index} className="rounded-xl border border-stone-200 p-3">
          <ImageUpload
            value={item.url}
            onChange={(url) => updateItem(index, { url })}
            label={`Gambar ${index + 1}`}
          />
          <input
            className="input mt-2 text-xs"
            value={item.alt ?? ""}
            onChange={(e) => updateItem(index, { alt: e.target.value })}
            placeholder="Alt text untuk gambar ini (opsional)"
          />
          <button
            type="button"
            className="mt-2 text-xs font-medium text-red-600 hover:underline"
            onClick={() => removeItem(index)}
          >
            Hapus gambar ini
          </button>
        </div>
      ))}
      {value.length === 0 && (
        <p className="rounded-lg bg-stone-50 p-3 text-sm text-stone-400">
          Belum ada gambar galeri. Tambahkan untuk tampilan template Hero /
          Majalah.
        </p>
      )}
      <button
        type="button"
        className="btn-ghost w-full text-xs"
        onClick={() => onChange([...value, { url: "", alt: "" }])}
      >
        + Tambah Gambar
      </button>
    </div>
  );
}