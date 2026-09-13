"use client";
import { useRef, useState, useTransition } from "react";
import { uploadImage } from "@/app/admin/actions";

export function ImageUpload({
  value,
  onChange,
  label = "Gambar",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    startTransition(async () => {
      const res = await uploadImage(formData);
      if (res.ok && res.url) {
        onChange(res.url);
        if (inputRef.current) inputRef.current.value = "";
      } else {
        setError(res.error || "Gagal upload.");
      }
    });
  }

  return (
    <div>
      {value ? (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="h-20 w-32 rounded-lg border border-stone-200 object-cover"
          />
          <div className="space-y-2">
            <button
              type="button"
              className="btn-ghost text-xs"
              onClick={() => onChange("")}
            >
              Hapus
            </button>
            <button
              type="button"
              className="btn-ghost text-xs"
              onClick={() => inputRef.current?.click()}
            >
              Ganti
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="flex h-24 w-full flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 text-stone-400 transition-colors hover:border-accent hover:text-accent"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
        >
          {isPending ? "Mengupload..." : `+ ${label}`}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="atau tempel URL gambar..."
        className="input mt-2 text-xs"
        readOnly={false}
      />
    </div>
  );
}