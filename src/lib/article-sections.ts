import type { ArticleSectionImage } from "@/lib/types";

const H2_RE = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;

function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function extractHeadings(html: string): string[] {
  if (!html) return [];
  const headings: string[] = [];
  let match: RegExpExecArray | null;
  H2_RE.lastIndex = 0;
  while ((match = H2_RE.exec(html))) {
    headings.push(stripTags(match[1]));
  }
  return headings;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function buildFigure(
  section: ArticleSectionImage,
  align: "left" | "right"
): string {
  const alt = escapeAttr(section.alt?.trim() || section.heading?.trim() || "Ilustrasi");
  const caption = section.caption?.trim();
  const figure =
    `<figure class="article-figure" data-align="${align}">` +
    `<img src="${escapeAttr(section.url)}" alt="${alt}" loading="lazy" decoding="async" />` +
    (caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "") +
    `</figure>`;
  return figure;
}

export function insertSectionImages(
  html: string,
  sections?: ArticleSectionImage[] | null
): string {
  if (!html || !sections || sections.length === 0) return html;
  const headings = extractHeadings(html);
  if (headings.length === 0) return html;

  const byHeading = new Map<string, ArticleSectionImage[]>();
  for (const s of sections) {
    if (!s.url) continue;
    const key = normalizeHeading(s.heading ?? "");
    if (!key) continue;
    const list = byHeading.get(key);
    if (list) list.push(s);
    else byHeading.set(key, [s]);
  }

  const usedIndices = new Set<number>();
  let injected = 0;
  let index = 0;

  const parts = html.split(H2_RE);
  const output: string[] = [parts[0]];

  for (let i = 1; i < parts.length; i += 2) {
    const headingHtml = `<h2>${parts[i]}</h2>`;
    const rest = parts[i + 1] ?? "";
    const headingText = stripTags(parts[i]);
    const normalized = normalizeHeading(headingText);
    output.push(headingHtml);

    const candidates = byHeading.get(normalized) ?? [];
    let matched: ArticleSectionImage | null = null;

    for (const c of candidates) {
      if (!usedIndices.has(c.index)) {
        matched = c;
        usedIndices.add(c.index);
        break;
      }
    }

    if (!matched && !usedIndices.has(index)) {
      const fallback = sections.find(
        (s) => s.url && s.index === index && !usedIndices.has(s.index)
      );
      if (fallback) {
        matched = fallback;
        usedIndices.add(fallback.index);
      }
    }

    if (matched) {
      const align: "left" | "right" = injected % 2 === 0 ? "left" : "right";
      output.push(buildFigure(matched, align));
      injected += 1;
    }

    output.push(rest);
    index += 1;
  }

  return output.join("");
}