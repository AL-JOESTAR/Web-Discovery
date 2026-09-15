import Link from "next/link";
import {
  getLandingContent,
  getPublishedArticles,
  getCategories,
  getSiteSettings,
} from "@/lib/db";
import { ArticleCard } from "@/components/site/article-card";
import { SectionHeading } from "@/components/site/section-heading";
import { Hero } from "@/components/site/hero";

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
      <Hero
        name={name}
        title={landing.hero.title}
        subtitle={landing.hero.subtitle}
        ctaText={landing.hero.cta_text || "Jelajahi Artikel"}
        ctaLink={landing.hero.cta_link || "/blog"}
        image={landing.hero.image}
      />

      {categories.length > 0 && (
        <section className="border-b border-stone-200 bg-white">
          <div className="container-wide flex gap-3 overflow-x-auto py-5 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/kategori/${category.slug}`}
                className="shrink-0 rounded-full border border-stone-200 bg-stone-50 px-4 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:border-accent hover:bg-accent hover:text-white"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-wide py-16 sm:py-24">
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
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <ArticleCard
                key={article.id}
                article={article}
                featured={i === 0}
                className={i === 0 ? "sm:col-span-2" : undefined}
              />
            ))}
          </div>
        )}
      </section>

      {landing.about.title && (
        <section className="border-y border-stone-200 bg-white">
          <div className="container-wide grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="font-serif text-sm uppercase tracking-[0.3em] text-accent">
                Tentang
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
                {landing.about.title}
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-stone-600">
                {landing.about.content}
              </p>
            </div>
            <div>
              {landing.about.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={landing.about.image}
                  alt={landing.about.title}
                  className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lg shadow-stone-900/10"
                />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center rounded-3xl bg-stone-100 font-serif text-4xl text-stone-400">
                  {name}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {landing.features.items.length > 0 && (
        <section className="container-wide py-16 sm:py-24">
          <SectionHeading
            eyebrow="Keunggulan"
            title={landing.features.title}
            description={landing.features.subtitle}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {landing.features.items.map((feature) => (
              <div key={feature.title} className="card p-7">
                <p className="font-serif text-xl font-semibold text-stone-900">
                  {feature.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-stone-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {landing.newsletter.title && (
        <section className="bg-stone-950 px-4 py-16 text-center text-white sm:py-24">
          <div className="mx-auto max-w-xl">
            <p className="font-serif text-sm uppercase tracking-[0.3em] text-accent">
              Newsletter
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              {landing.newsletter.title}
            </h2>
            <p className="mt-3 text-stone-400">{landing.newsletter.subtitle}</p>
            <form className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="email kamu"
                className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white outline-none placeholder:text-stone-400 focus:border-accent"
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
