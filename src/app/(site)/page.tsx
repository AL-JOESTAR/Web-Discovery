import Link from "next/link";
import {
  getLandingContent,
  getPublishedArticles,
  getCategories,
  getSiteSettings,
} from "@/lib/db";
import { ArticleCard } from "@/components/site/article-card";
import { SectionHeading } from "@/components/site/section-heading";

export default async function HomePage() {
  const [landing, articles, categories, settings] = await Promise.all([
    getLandingContent(),
    getPublishedArticles(6),
    getCategories(),
    getSiteSettings(),
  ]);
  const site = settings?.site;
  const name = site?.name ?? "Fashion";

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-stone-200 bg-stone-950 text-white">
        {landing.hero.image && (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={landing.hero.image}
              alt=""
              className="h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 to-stone-950/40" />
          </div>
        )}
        <div className="container-page relative py-24 sm:py-32">
          <p className="font-serif text-sm uppercase tracking-[0.3em] text-accent">
            {name}
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            {landing.hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-300">
            {landing.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={landing.hero.cta_link || "/blog"}
              className="btn-primary"
            >
              {landing.hero.cta_text || "Jelajahi Artikel"}
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="border-b border-stone-200 bg-white">
          <div className="container-page flex flex-wrap items-center gap-3 py-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/kategori/${category.slug}`}
                className="rounded-full border border-stone-300 px-4 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:border-accent hover:bg-accent hover:text-white"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent articles */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Terbaru"
          title="Artikel Terkini"
          description="Inspirasi fashion terbaru untuk harimu."
          actionHref="/blog"
          actionLabel="Lihat Semua"
        />
        {articles.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
            <p className="font-serif text-lg text-stone-500">
              Belum ada artikel yang dipublikasikan.
            </p>
            <p className="mt-1 text-sm text-stone-400">
              Artikel baru akan muncul di sini setelah publish dari dashboard.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <ArticleCard key={article.id} article={article} featured={i === 0} />
            ))}
          </div>
        )}
      </section>

      {/* About */}
      {landing.about.title && (
        <section className="border-t border-stone-200 bg-white">
          <div className="container-page grid items-center gap-10 py-16 sm:py-20 md:grid-cols-2">
            <div>
              <p className="font-serif text-sm uppercase tracking-[0.3em] text-accent">
                Tentang
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
                {landing.about.title}
              </h2>
              <p className="mt-5 leading-relaxed text-stone-600">
                {landing.about.content}
              </p>
            </div>
            <div>
              {landing.about.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={landing.about.image}
                  alt={landing.about.title}
                  className="aspect-[4/3] w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-stone-100 font-serif text-4xl text-stone-400">
                  {name}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {landing.features.items.length > 0 && (
        <section className="container-page py-16 sm:py-20">
          <SectionHeading
            eyebrow="Keunggulan"
            title={landing.features.title}
            description={landing.features.subtitle}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {landing.features.items.map((feature) => (
              <div key={feature.title} className="card p-6">
                <p className="font-serif text-lg font-semibold text-stone-900">
                  {feature.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      {landing.newsletter.title && (
        <section className="border-t border-stone-200 bg-stone-950 px-4 py-16 text-center text-white sm:py-20">
          <div className="mx-auto max-w-xl">
            <h2 className="font-serif text-3xl font-bold tracking-tight">
              {landing.newsletter.title}
            </h2>
            <p className="mt-3 text-stone-400">{landing.newsletter.subtitle}</p>
            <form className="mx-auto mt-7 flex max-w-md gap-2">
              <input
                type="email"
                placeholder="email kamu"
                className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm text-white outline-none placeholder:text-stone-400 focus:border-accent"
              />
              <button type="submit" className="btn-primary shrink-0">
                Daftar
              </button>
            </form>
          </div>
        </section>
      )}
    </>
  );
}