import { MarketplaceBadge } from "@/components/marketplace-badge";
import { RatingInline } from "@/components/rating-inline";
import { getMarketplaceLabel } from "@/lib/marketplace";
import { formatPrice } from "@/lib/utils";
import type { AffiliateLink } from "@/lib/types";

export function ProductCard({ product }: { product: AffiliateLink }) {
  const marketplace = getMarketplaceLabel(product.marketplace, product.url);
  const rating = product.rating != null ? Number(product.rating) : null;
  const hasRating = rating != null && !Number.isNaN(rating) && rating > 0;

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-sm shadow-stone-900/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-stone-900/10 sm:rounded-2xl"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200 sm:aspect-[4/3]">
        {product.gambar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.gambar}
            alt={product.nama}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-serif text-2xl font-semibold text-stone-400 sm:text-3xl">
              {product.nama.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {marketplace && (
          <MarketplaceBadge
            label={marketplace}
            className="left-2 top-2 px-2 py-0.5 text-[10px] shadow-sm sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        {product.kategori && (
          <span className="line-clamp-1 text-[10px] font-medium uppercase tracking-wide text-accent sm:text-xs">
            {product.kategori}
          </span>
        )}
        <h3 className="mt-1 line-clamp-2 font-serif text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-accent sm:mt-1.5 sm:text-base">
          {product.nama}
        </h3>
        {hasRating && (
          <RatingInline
            rating={rating}
            reviewCount={product.rating_count}
            size={12}
            className="mt-1.5 sm:mt-2"
          />
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 sm:pt-4">
          {product.harga != null ? (
            <span className="truncate text-sm font-semibold text-foreground sm:text-base">
              {formatPrice(product.harga)}
            </span>
          ) : (
            <span className="text-xs text-stone-400 sm:text-sm">Lihat Harga</span>
          )}
          <span className="hidden shrink-0 text-[11px] font-medium text-accent sm:inline sm:text-xs">
            Beli &rarr;
          </span>
        </div>
      </div>
    </a>
  );
}
