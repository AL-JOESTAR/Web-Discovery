import { Star } from "lucide-react";
import { cn, formatCount } from "@/lib/utils";

const MAX_RATING = 5;

/** Rating ringkas: satu bintang diikuti angka dan jumlah ulasan.
 *  whole bar disembunyikan dari pembaca layar karena sudah ada aria-label
 *  di elemen pembungkus, supaya tidak dibaca dua kali. */
export function RatingInline({
  rating,
  reviewCount,
  size = 14,
  className,
}: {
  rating: number;
  reviewCount?: number | null;
  size?: number;
  className?: string;
}) {
  const value = Number.isFinite(rating)
    ? Math.max(0, Math.min(MAX_RATING, rating))
    : 0;
  const reviews = formatCount(reviewCount);

  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      role="img"
      aria-label={
        reviews
          ? `Rating ${value.toFixed(1)} dari 5, ${reviews} ulasan`
          : `Rating ${value.toFixed(1)} dari 5`
      }
    >
      <Star
        size={size}
        strokeWidth={1.5}
        aria-hidden="true"
        className="shrink-0 fill-current text-amber-400"
      />
      <span className="text-xs font-semibold text-foreground" aria-hidden="true">
        {value.toFixed(1)}
      </span>
      {reviews && (
        <span className="text-xs text-stone-400" aria-hidden="true">
          <span className="text-stone-300">&middot;</span> {reviews} ulasan
        </span>
      )}
    </span>
  );
}
