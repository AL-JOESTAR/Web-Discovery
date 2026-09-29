import { cn } from "@/lib/utils";
import { MARKETPLACE_STYLES, type Marketplace } from "@/lib/marketplace";

export function MarketplaceBadge({
  label,
  variant = "overlay",
  className,
}: {
  label: Marketplace;
  variant?: "overlay" | "chip";
  className?: string;
}) {
  const style = MARKETPLACE_STYLES[label];

  if (variant === "chip") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          style.bg,
          style.text,
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
        "absolute left-3 top-3 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-sm transition-[filter] group-hover:brightness-95",
        style.bg,
        style.text,
        className
      )}
    >
      {label}
    </span>
  );
}
