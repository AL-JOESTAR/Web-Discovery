import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_RATING = 5;

export function StarRow({
  rating,
  className,
  size = 14,
}: {
  rating: number;
  className?: string;
  size?: number;
}) {
  const clamped = Math.max(0, Math.min(MAX_RATING, rating));
  const percent = Math.round((clamped / MAX_RATING) * 1000) / 10;

  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      role="img"
      aria-label={`Rating ${clamped.toFixed(1)} dari 5`}
    >
      <span className="flex shrink-0 text-stone-300" aria-hidden="true">
        {Array.from({ length: MAX_RATING }, (_, i) => (
          <Star key={i} size={size} className="shrink-0 fill-current" strokeWidth={1.5} />
        ))}
      </span>
      <span
        className="absolute left-0 top-0 flex h-full overflow-hidden text-amber-400"
        style={{ width: `${percent}%` }}
        aria-hidden="true"
      >
        {Array.from({ length: MAX_RATING }, (_, i) => (
          <Star key={i} size={size} className="shrink-0 fill-current" strokeWidth={1.5} />
        ))}
      </span>
    </span>
  );
}
