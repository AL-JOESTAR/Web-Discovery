import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/db";
import { getSiteUrl } from "@/lib/config";
import { PageHero } from "@/components/site/page-hero";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Kategori",
    description:
      "Jelajahi kategori artikel fashion dan gaya hidup.",
    alternates: { canonical: `${getSiteUrl()}/kategori` },
    openGraph: { type: "website", url: `${getSiteUrl()}/kategori` },
  };
}

export default async function KategoriPage() {
  const categories = await getCategories();

  return (
    <div className="container-wide py-14 sm:py-20">
      <PageHero
        eyebrow="Kategori"
        title="Jelajahi Berdasarkan Topik"
        description="Pilih kategori yang ingin kamu baca."
      />

      <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/kategori/${category.slug}`}
            className="card group flex items-center justify-between p-6 transition-shadow hover:shadow-md"
          >
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900 group-hover:text-accent">
                {category.name}
              </h2>
              {category.description && (
                <p className="mt-1 line-clamp-2 text-sm text-stone-500">
                  {category.description}
                </p>
              )}
            </div>
            <span className="text-stone-300 transition-colors group-hover:text-accent">
              →
            </span>
          </Link>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
            <p className="font-serif text-lg text-stone-500">
              Belum ada kategori.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}