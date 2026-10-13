import { ProductCard } from "@/components/site/product-card";
import { SectionHeading } from "@/components/site/section-heading";
import type { AffiliateLink } from "@/lib/types";

export function ArticleProducts({ products }: { products: AffiliateLink[] }) {
  if (products.length === 0) return null;

  return (
    <section className="container-wide mt-16 border-t border-line pt-12 sm:mt-20">
      <SectionHeading
        eyebrow="Belanja"
        title="Rekomendasi Produk"
        description="Produk pilihan yang cocok dengan artikel ini."
      />
      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
