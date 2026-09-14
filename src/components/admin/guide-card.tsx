import type { Guide } from "@/lib/guides";

export function GuideCard({
  guide,
  defaultOpen = false,
}: {
  guide: Guide;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group card overflow-hidden" open={defaultOpen} >
      <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-3.5 transition-colors hover:bg-stone-50 [&::-webkit-details-marker]:hidden">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
          ?
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-stone-900">{guide.title}</p>
          <p className="text-xs text-stone-500">
            {guide.steps.length} langkah \u00b7 klik untuk buka/tutup
          </p>
        </div>
        <span className="ml-auto text-stone-400 transition-transform group-open:rotate-180">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </summary>
      <div className="border-t border-stone-100 px-5 py-4">
        <p className="mb-4 text-sm text-stone-600">{guide.intro}</p>
        <ol className="space-y-4">
          {guide.steps.map((step, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-800">
                  {step.title}
                </p>
                <p className="text-[13px] leading-relaxed text-stone-500">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}