function truncate(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}\u2026`;
}

function formatDomain(siteDomain: string, slug: string): string {
  return siteDomain ? `${siteDomain}/blog/${slug}` : `/blog/${slug}`;
}

export function SerpPreview({
  siteName,
  siteDomain,
  title,
  metaDescription,
  slug,
}: {
  siteName: string;
  siteDomain: string;
  title: string;
  metaDescription: string;
  slug: string;
}) {
  const domain = siteDomain || "contoh-id.com";
  const breadcrumb = siteName || domain;
  const serpTitle = truncate(title || "Judul artikel muncul di sini...", 58);
  const url = `https://${formatDomain(domain, slug)}`;
  const desc = truncate(
    metaDescription ||
      "Meta description akan tampil di sini. Tulis ringkasan 120\u2013155 karakter yang mengandung keyword.",
    155
  );

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <div className="flex items-center gap-2 text-[11px] text-stone-500">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-200 text-[9px] font-bold text-stone-600">
          {siteName?.trim().charAt(0).toUpperCase() ||
            domain.charAt(0).toUpperCase()}
        </span>
        <span>
          {breadcrumb} › {slug ? `blog › ${slug}` : "blog"}
        </span>
      </div>
      <p className="mt-1.5 cursor-pointer truncate text-lg font-medium leading-snug text-[#1a0dab] hover:underline">
        {serpTitle}
      </p>
      <p className="truncate break-all text-sm text-[#006621]">{url}</p>
      <p className="mt-1 text-[13px] leading-snug text-stone-600">{desc}</p>
      <svg
        className="mt-3 h-6 w-6 text-stone-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <circle cx="10.5" cy="10.5" r="7" />
        <path d="m21 21-5.2-5.2" />
      </svg>
    </div>
  );
}