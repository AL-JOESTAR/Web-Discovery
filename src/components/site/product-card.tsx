import { formatPrice } from "@/lib/utils";
import type { AffiliateLink } from "@/lib/types";

export function ProductCard({ product }: { product: AffiliateLink }) {
  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm shadow-stone-900/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-stone-900/10"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200">
        {product.gambar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.gambar}
            alt={product.nama}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-serif text-3xl font-semibold text-stone-400">
              {product.nama.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {product.kategori && (
          <span className="text-xs font-medium uppercase tracking-wide text-accent">
            {product.kategori}
          </span>
        )}
        <h3 className="mt-1.5 line-clamp-2 font-serif font-bold tracking-tight text-foreground transition-colors group-hover:text-accent">
          {product.nama}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          {product.harga != null ? (
            <span className="text-base font-semibold text-foreground">
              {formatPrice(product.harga)}
            </span>
          ) : (
            <span className="text-sm text-stone-400">Lihat Harga</span>
          )}
          <span className="shrink-0 text-xs font-medium text-accent">
            Beli &rarr;
          </span>
        </div>
      </div>
    </a>
  );
}