"use client";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_THEME } from "@/lib/config";
import type { ThemeSettings } from "@/lib/types";

const TOKENS: { key: keyof ThemeSettings; label: string; cssVar: string }[] = [
  { key: "accent", label: "Accent (tombol & link)", cssVar: "--accent" },
  { key: "background", label: "Latar utama", cssVar: "--background" },
  { key: "foreground", label: "Teks utama", cssVar: "--foreground" },
  { key: "surface", label: "Permukaan (kartu)", cssVar: "--surface" },
  { key: "muted", label: "Teks sekunder", cssVar: "--muted" },
  { key: "line", label: "Garis pembatas", cssVar: "--line" },
  { key: "sectionDark", label: "Section gelap", cssVar: "--section-dark" },
];

const PRESETS: { name: string; theme: ThemeSettings }[] = [
  { name: "Genteng", theme: { ...DEFAULT_THEME } },
  {
    name: "Emerald",
    theme: {
      accent: "#0f766e",
      background: "#f1f6f5",
      foreground: "#0f172a",
      surface: "#ffffff",
      muted: "#64748b",
      line: "#e2e8f0",
      sectionDark: "#12312e",
    },
  },
  {
    name: "Navy",
    theme: {
      accent: "#1d4ed8",
      background: "#f5f7fb",
      foreground: "#111827",
      surface: "#ffffff",
      muted: "#6b7280",
      line: "#e5e7eb",
      sectionDark: "#0b1424",
    },
  },
  {
    name: "Rose",
    theme: {
      accent: "#be123c",
      background: "#fdf5f6",
      foreground: "#1c1917",
      surface: "#ffffff",
      muted: "#94737a",
      line: "#f3e3e7",
      sectionDark: "#230a12",
    },
  },
  {
    name: "Emas",
    theme: {
      accent: "#a16207",
      background: "#fbf8ef",
      foreground: "#1c1917",
      surface: "#fffdf6",
      muted: "#8a7d5c",
      line: "#ece4cc",
      sectionDark: "#221a06",
    },
  },
  {
    name: "Hitam Elegan",
    theme: {
      accent: "#d4af37",
      background: "#0c0a09",
      foreground: "#faf9f7",
      surface: "#1c1917",
      muted: "#a8a29e",
      line: "#292524",
      sectionDark: "#000000",
    },
  },
];

function toHex(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#b8452c";
}

export function ThemeEditor({
  value,
  onChange,
}: {
  value: ThemeSettings;
  onChange: (theme: ThemeSettings) => void;
}) {
  const [applied, setApplied] = useState(false);
  const prevVars = useRef<Record<string, string> | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (!applied) {
      if (prevVars.current !== null) {
        for (const token of TOKENS) {
          if (prevVars.current[token.cssVar]) {
            root.style.setProperty(token.cssVar, prevVars.current[token.cssVar]);
          } else {
            root.style.removeProperty(token.cssVar);
          }
        }
        prevVars.current = null;
      }
      return;
    }
    if (prevVars.current === null) {
      prevVars.current = {};
      for (const token of TOKENS) {
        prevVars.current[token.cssVar] = root.style.getPropertyValue(token.cssVar);
      }
    }
    for (const token of TOKENS) {
      root.style.setProperty(token.cssVar, value[token.key]);
    }
  }, [applied, value]);

  function setToken(key: keyof ThemeSettings, val: string) {
    onChange({ ...value, [key]: val });
  }

  const previewStyle = {
    "--accent": value.accent,
    "--background": value.background,
    "--foreground": value.foreground,
    "--surface": value.surface,
    "--muted": value.muted,
    "--line": value.line,
    "--section-dark": value.sectionDark,
  } as React.CSSProperties;

  const isDefault = TOKENS.every((t) => value[t.key] === DEFAULT_THEME[t.key]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => onChange({ ...preset.theme })}
            className="rounded-full border border-stone-300 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-600 transition-colors hover:border-accent hover:text-accent"
          >
            {preset.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange({ ...DEFAULT_THEME })}
          disabled={isDefault}
          className="disabled:opacity-40 text-xs font-medium text-stone-500 underline-offset-2 hover:underline"
        >
          Reset ke warna default
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {TOKENS.map((token) => (
          <div key={token.key} className="flex items-center gap-3">
            <input
              type="color"
              value={toHex(value[token.key])}
              onChange={(e) => setToken(token.key, e.target.value)}
              className="h-9 w-12 cursor-pointer rounded-md border border-stone-200 bg-white p-1"
              aria-label={token.label}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-stone-700">{token.label}</p>
              <p className="font-mono text-xs text-stone-400">{token.cssVar}</p>
            </div>
            <input
              type="text"
              value={value[token.key]}
              onChange={(e) => setToken(token.key, e.target.value)}
              className="input w-28"
              spellCheck={false}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setApplied((a) => !a)}
          className={
            applied
              ? "rounded-full border border-amber-600 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
              : "rounded-full border border-stone-300 px-3 py-1 text-xs font-medium text-stone-600 transition-colors hover:border-accent hover:text-accent"
          }
        >
          {applied ? "Pulihkan preview sementara" : "Terapkan sementara (preview)"}
        </button>
        <span className="text-xs text-stone-400">
          Warna langsung terlihat saat diedit tanpa harus simpan.
        </span>
      </div>

      <div
        className="overflow-hidden rounded-xl border border-stone-200 shadow-sm"
        style={previewStyle}
      >
        <div
          className="flex items-center gap-4 border-b px-4 py-2.5 text-sm"
          style={{ backgroundColor: "var(--background)", borderColor: "var(--line)" }}
        >
          <span className="font-serif font-bold" style={{ color: "var(--foreground)" }}>
            Fashion
          </span>
          <span className="ml-auto" style={{ color: "var(--muted)" }}>
            Blog &middot; Kategori &middot; Tentang
          </span>
          <span
            className="rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: "var(--accent)", color: "#fff" }}
          >
            Ikuti
          </span>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          <div
            className="col-span-2 rounded-lg p-4"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Judul artikel contoh
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
              Deskripsi singkat yang menggunakan warna teks sekunder dari tema.
            </p>
            <span
              className="mt-2 inline-block rounded-md px-3 py-1 text-xs font-medium"
              style={{ backgroundColor: "var(--accent)", color: "#fff" }}
            >
              Baca Artikel
            </span>
          </div>
          <div
            className="rounded-lg p-4 text-white"
            style={{ backgroundColor: "var(--section-dark)" }}
          >
            <p className="text-xs font-semibold">Section Gelap</p>
            <p className="mt-1 text-xs opacity-70">Konten latar gelap tema.</p>
          </div>
        </div>
      </div>
    </div>
  );
}