import { cn } from "@/lib/utils";
import type { Marketplace } from "@/lib/marketplace";

export function MarketplaceBadge({
  label,
  variant = "overlay",
  className,
}: {
  label: Marketplace;
  variant?: "overlay" | "chip";
  className?: string;
}) {
  if (variant === "chip") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600",
          className
        )}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-stone-800 shadow-sm backdrop-blur-sm transition-colors group-hover:bg-accent group-hover:text-white",
        className
      )}
    >
      {label}
    </span>
  );
}
