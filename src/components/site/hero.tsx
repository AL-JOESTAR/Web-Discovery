import Link from "next/link";

export function Hero({
  name,
  title,
  subtitle,
  ctaText,
  ctaLink,
  image,
}: {
  name: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string | null;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-section-dark text-white">
      {image ? (
        <>
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover object-center lg:object-[70%_center]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-section-dark via-section-dark/75 to-section-dark/25 lg:bg-gradient-to-r lg:from-section-dark lg:via-section-dark/80 lg:to-section-dark/15" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_color-mix(in_srgb,var(--accent)_28%,transparent),_transparent_55%),linear-gradient(160deg,var(--section-dark)_0%,color-mix(in_srgb,var(--section-dark)_90%,white)_45%,var(--section-dark)_100%)]" />
      )}

      <div className="relative flex min-h-[calc(100svh-4.5rem)] flex-col justify-end px-4 py-16 sm:justify-center sm:px-6 sm:pt-20 sm:pb-32 lg:px-12 lg:pt-24 lg:pb-40">
        <div className="max-w-xl lg:max-w-2xl">
          <p className="font-serif text-sm uppercase tracking-[0.35em] text-accent">
            {name}
          </p>
          <h1 className="hero-title mt-4 text-balance text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-200 sm:text-xl lg:mt-8 lg:max-w-2xl lg:text-2xl">
            {subtitle}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={ctaLink || "/blog"}
              className="btn-primary w-full sm:w-auto"
            >
              {ctaText || "Jelajahi Artikel"}
            </Link>
            <Link href="/kategori" className="btn-ghost-dark w-full sm:w-auto">
              Kategori
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
