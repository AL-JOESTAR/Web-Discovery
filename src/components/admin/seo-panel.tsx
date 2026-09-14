"use client";

import { useMemo, useState } from "react";
import { ImageUpload } from "@/components/admin/image-upload";

export type SeoStatus = "pass" | "warn" | "fail";

export type SeoCheckItem = {
  id: string;
  label: string;
  status: SeoStatus;
  detail: string;
};

const WORD_RE = /[\p{L}\p{N}]+(?:['\u2019-][\p{L}\p{N}]+)*/gu;

function countWords(text: string): number {
  const m = text.match(WORD_RE);
  return m?.length ?? 0;
}

function countOccurrences(text: string, needle: string): number {
  const k = needle.trim();
  if (!k) return 0;
  const esc = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = text.match(new RegExp(esc, "gi"));
  return m?.length ?? 0;
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function zoneChecks(text: string, keyword: string, zonesCount: number) {
  const paras = text
    .split(/\n{1,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (paras.length === 0)
    return { withKeyword: 0, total: zonesCount, flags: [] as boolean[] };
  const per = Math.max(1, Math.ceil(paras.length / zonesCount));
  const flags: boolean[] = [];
  for (let i = 0; i < zonesCount; i += 1) {
    const chunk = paras.slice(i * per, (i + 1) * per);
    if (chunk.length === 0) break;
    flags.push(chunk.some((p) => countOccurrences(p, keyword) > 0));
  }
  return {
    withKeyword: flags.filter(Boolean).length,
    total: flags.length,
    flags,
  };
}

const H_RE = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
const A_HREF_RE = /<a\b[^>]*href=["']([^"']*)["']/gi;
const IMG_RE = /<img\b[^>]*>/gi;
const ALT_IN_IMG_RE = /\balt=["'][^"']*["']/i;

function analyze({
  title,
  metaDescription,
  slug,
  keyword,
  contentHtml,
}: {
  title: string;
  metaDescription: string;
  slug: string;
  keyword: string;
  contentHtml: string;
}) {
  const kw = keyword.trim();
  const text = stripHtml(contentHtml);
  const wordCount = countWords(text);
  const keywordCount = countOccurrences(text, kw);
  const density = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;

  const titleLen = title.trim().length;
  const descLen = metaDescription.trim().length;
  const kwLower = kw.toLowerCase();
  const titleLower = title.toLowerCase().trim();
  const descLower = metaDescription.toLowerCase().trim();
  const slugLower = slug.toLowerCase().trim();

  const titleHasKw = titleLower.includes(kwLower);
  const descHasKw = descLower.includes(kwLower);
  const slugHasKw = kw
    .split(/\s+/)
    .filter(Boolean)
    .every((part) => slugLower.includes(part.toLowerCase()));

  const paras = text
    .split(/\n{1,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const firstParaHasKw = paras[0]
    ? countOccurrences(paras[0], kw) > 0
    : false;

  const headings = Array.from(contentHtml.matchAll(H_RE));
  const subheadingCount = headings.filter((h) =>
    ["2", "3"].includes(h[1])
  ).length;
  const keywordInSubheading = headings.some(
    (h) =>
      ["2", "3"].includes(h[1]) &&
      countOccurrences(stripHtml(h[2]), kw) > 0
  );

  const zones = zoneChecks(text, kw, 4);

  const longParas = paras.filter((p) => countWords(p) > 80);

  const links = Array.from(contentHtml.matchAll(A_HREF_RE));
  const linkCount = links.length;
  const internalCount = links.filter((m) => {
    const href = m[1].toLowerCase();
    return (
      href.startsWith("/") ||
      href.startsWith("#") ||
      /^https?:\/\/(?:www\.)?(?:localhost|127\.0\.0\.1)/.test(href)
    );
  }).length;

  const images = Array.from(contentHtml.matchAll(IMG_RE));
  const imageCount = images.length;
  const imageWithoutAlt = images.filter(
    (m) => !ALT_IN_IMG_RE.test(m[0])
  ).length;

  return {
    wordCount,
    keywordCount,
    density,
    titleLen,
    descLen,
    titleHasKw,
    descHasKw,
    slugHasKw,
    firstParaHasKw,
    subheadingCount,
    keywordInSubheading,
    zonesWithKeyword: zones.withKeyword,
    zonesTotal: zones.total,
    longParaCount: longParas.length,
    linkCount,
    internalCount,
    imageCount,
    imageWithoutAlt,
  };
}

function StatusBadge({
  status,
  children,
}: {
  status: SeoStatus;
  children: React.ReactNode;
}) {
  const color =
    status === "pass"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "warn"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-red-50 text-red-700 border-red-200";
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${color}`}
    >
      {children}
    </span>
  );
}

function CheckRow({
  label,
  status,
  detail,
}: Omit<SeoCheckItem, "id">) {
  const badge =
    status === "pass"
      ? "Lolos"
      : status === "warn"
        ? "Perhatian"
        : "Gagal";
  return (
    <div className="flex items-start justify-between gap-3 border-b border-stone-100 py-2.5 last:border-0">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-stone-800">{label}</p>
        <p className="mt-0.5 text-xs text-stone-500">{detail}</p>
      </div>
      <StatusBadge status={status}>{badge}</StatusBadge>
    </div>
  );
}

function CollapsibleSection({
  title,
  badge,
  open,
  onToggle,
  children,
}: {
  title: string;
  badge?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-stone-50"
      >
        <span className="text-sm font-semibold text-stone-900">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-xs text-stone-400">{badge}</span>
          )}
          <span className="text-stone-400 text-sm">
            {open ? "\u2212" : "+"}
          </span>
        </div>
      </button>
      {open && <div className="border-t border-stone-100">{children}</div>}
    </div>
  );
}

export function SeoPanel({
  title,
  metaDescription,
  slug,
  focusKeyword,
  contentHtml,
  categories,
  categoryId,
  coverImage,
  coverAlt,
  onSlugChange,
  onFocusKeywordChange,
  onCoverImageChange,
  onCoverAltChange,
  onCategoryChange,
}: {
  title: string;
  metaDescription: string;
  slug: string;
  focusKeyword: string;
  contentHtml: string;
  categories: { id: string; name: string }[];
  categoryId: string;
  coverImage: string;
  coverAlt: string;
  onSlugChange: (s: string) => void;
  onFocusKeywordChange: (k: string) => void;
  onCoverImageChange: (u: string) => void;
  onCoverAltChange: (a: string) => void;
  onCategoryChange: (c: string) => void;
}) {
  const [openSections, setOpenSections] = useState({
    score: true,
    settings: true,
    analysis: true,
  });

  function toggleSection(key: keyof typeof openSections) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const result = useMemo(
    () =>
      analyze({
        title,
        metaDescription,
        slug,
        keyword: focusKeyword,
        contentHtml,
      }),
    [title, metaDescription, slug, focusKeyword, contentHtml]
  );

  const items: SeoCheckItem[] = [];
  function add(status: SeoStatus, label: string, detail: string) {
    items.push({
      id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      label,
      status,
      detail,
    });
  }

  const kwFlag = focusKeyword.trim();

  add(
    result.titleHasKw ? "pass" : "fail",
    "Keyword ada di judul",
    result.titleHasKw
      ? `"${focusKeyword}" ditemukan di judul.`
      : "Keyword tidak ditemukan di judul."
  );
  const titleOk = result.titleLen >= 50 && result.titleLen <= 60;
  add(
    titleOk ? "pass" : result.titleLen > 0 ? "warn" : "fail",
    "Panjang judul 50\u201360 karakter",
    `${result.titleLen}/60 karakter (${titleOk ? "ideal" : "di luar target"})`
  );
  const descOk = result.descLen >= 120 && result.descLen <= 155;
  add(
    descOk ? "pass" : result.descLen > 0 ? "warn" : "fail",
    "Panjang meta description 120\u2013155",
    `${result.descLen}/155 karakter`
  );
  add(
    result.descHasKw ? "pass" : "fail",
    "Keyword di meta description",
    result.descHasKw
      ? "Keyword ditemukan di description."
      : "Keyword tidak di description."
  );
  add(
    result.slugHasKw ? "pass" : "fail",
    "Keyword di slug URL",
    result.slugHasKw
      ? `/${slug}`
      : "Keyword tidak ada di slug."
  );
  const wordOk = result.wordCount >= 1500;
  add(
    wordOk ? "pass" : result.wordCount > 0 ? "warn" : "fail",
    "Konten minimal 1500 kata",
    `${result.wordCount} kata (${wordOk ? "cukup" : "kurang"})`
  );
  add(
    result.longParaCount === 0 ? "pass" : "warn",
    "Paragraf tidak terlalu panjang (\u226480 kata)",
    `${result.longParaCount} paragraf panjang`
  );
  const densityOk = result.density >= 0.5 && result.density <= 2;
  add(
    kwFlag
      ? densityOk
        ? "pass"
        : result.density > 0 && result.density < 3
          ? "warn"
          : "fail"
      : "fail",
    "Kepadatan keyword 0,5\u20132%",
    kwFlag
      ? `${result.density.toFixed(2)}% (${result.keywordCount} kemunculan)`
      : "Isi keyword dulu."
  );
  add(
    result.firstParaHasKw ? "pass" : "fail",
    "Keyword di paragraf pertama",
    result.firstParaHasKw
      ? "Ditemukan di pembuka."
      : "Tidak di paragraf pertama."
  );
  add(
    kwFlag ? (result.keywordInSubheading ? "pass" : "fail") : "fail",
    "Keyword di minimal satu H2/H3",
    result.keywordInSubheading
      ? "Ditemukan di subheading."
      : "Belum ada di H2/H3."
  );
  const zonesRatio =
    result.zonesTotal > 0
      ? result.zonesWithKeyword / result.zonesTotal
      : 0;
  add(
    zonesRatio >= 0.75
      ? "pass"
      : zonesRatio >= 0.5
        ? "warn"
        : "fail",
    "Keyword tersebar merata (4 zona)",
    `${result.zonesWithKeyword}/${result.zonesTotal} zona`
  );
  add(
    result.subheadingCount >= 2 ? "pass" : "fail",
    "Minimal 2 subheading (H2/H3)",
    `${result.subheadingCount} subheading`
  );
  add(
    result.linkCount >= 1 ? "pass" : "fail",
    "Ada link di konten",
    `${result.linkCount} link (${result.internalCount} internal)`
  );
  add(
    result.imageCount === 0 || result.imageWithoutAlt === 0
      ? "pass"
      : "fail",
    "Semua gambar punya alt text",
    result.imageCount === 0
      ? "Belum ada gambar di konten."
      : `${result.imageCount - result.imageWithoutAlt}/${result.imageCount} gambar ber-alt`
  );

  const passed = items.filter((i) => i.status === "pass").length;
  const score = Math.round((passed / items.length) * 100);
  const scoreColor =
    score >= 80
      ? "text-emerald-600"
      : score >= 50
        ? "text-amber-600"
        : "text-red-600";
  const barColor =
    score >= 80
      ? "bg-emerald-500"
      : score >= 50
        ? "bg-amber-500"
        : "bg-red-500";
  const predicate =
    score >= 80
      ? { label: "Sangat Baik", className: "bg-emerald-50 text-emerald-700 border-emerald-200" }
      : score >= 50
        ? { label: "Cukup", className: "bg-amber-50 text-amber-700 border-amber-200" }
        : { label: "Perlu Perbaikan", className: "bg-red-50 text-red-700 border-red-200" };

  return (
    <div className="space-y-3">
      {/* Score */}
      <CollapsibleSection
        title="Skor SEO"
        badge={`${score}%`}
        open={openSections.score}
        onToggle={() => toggleSection("score")}
      >
        <div className="px-5 pb-5 pt-4">
          <div className="flex items-baseline gap-3">
            <p className={`font-serif text-4xl font-bold ${scoreColor}`}>
              {score}
              <span className="text-xl">%</span>
            </p>
            <span className="text-xs text-stone-500">
              {passed}/{items.length} lolos
            </span>
            <span
              className={`ml-auto rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${predicate.className}`}
            >
              {predicate.label}
            </span>
          </div>
          <p className="mt-2 text-xs text-stone-500">
            {score >= 80
              ? "Sangat baik \u2014 artikel siap dipublikasikan."
              : score >= 50
                ? "Cukup \u2014 perbaiki beberapa poin untuk hasil maksimal."
                : "Perlu perbaikan \u2014 ikuti checklist di bawah."}
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-stone-100">
            <div
              className={`h-full rounded-full transition-all duration-300 ${barColor}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Pengaturan Post */}
      <CollapsibleSection
        title="Pengaturan Post"
        open={openSections.settings}
        onToggle={() => toggleSection("settings")}
      >
        <div className="space-y-4 p-5">
          <div>
            <label className="label">Focus Keyphrase</label>
            <input
              className="input"
              value={focusKeyword}
              onChange={(e) => onFocusKeywordChange(e.target.value)}
              placeholder="cth: baju batik pria"
            />
            {kwFlag && (
              <p className="mt-1 text-xs text-stone-500">
                {result.keywordCount} kemunculan \u00b7 kepadatan{" "}
                {result.density.toFixed(2)}%
              </p>
            )}
          </div>
          <div>
            <label className="label">Slug URL</label>
            <input
              className="input"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Kategori</label>
            <select
              className="select"
              value={categoryId}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="">Tidak ada kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Gambar Utama</label>
            <ImageUpload
              value={coverImage}
              onChange={onCoverImageChange}
              label="Upload Gambar Utama"
            />
            {coverImage && (
              <div className="mt-2">
                <label className="label">Alt Text Gambar Utama</label>
                <input
                  className="input"
                  value={coverAlt}
                  onChange={(e) => onCoverAltChange(e.target.value)}
                  placeholder="Deskripsi singkat gambar (untuk SEO)"
                />
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Analisis SEO */}
      <CollapsibleSection
        title="Analisis SEO"
        badge={`${passed}/${items.length}`}
        open={openSections.analysis}
        onToggle={() => toggleSection("analysis")}
      >
        <div className="px-5 pb-4">
          {items.map((item) => (
            <CheckRow key={item.id} {...item} />
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}
