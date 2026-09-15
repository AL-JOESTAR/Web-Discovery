export function PageHero({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <header className={align === "center" ? "page-hero" : "max-w-2xl"}>
      {eyebrow && (
        <p
          className={
            align === "center"
              ? "page-hero-eyebrow"
              : "font-serif text-sm uppercase tracking-[0.3em] text-accent"
          }
        >
          {eyebrow}
        </p>
      )}
      <h1
        className={
          align === "center"
            ? "page-hero-title"
            : `${eyebrow ? "mt-3" : ""} font-serif text-4xl font-bold tracking-tight sm:text-5xl`
        }
      >
        {title}
      </h1>
      {description && (
        <p
          className={
            align === "center"
              ? "page-hero-desc"
              : "mt-4 text-base leading-relaxed text-stone-500 sm:text-lg"
          }
        >
          {description}
        </p>
      )}
    </header>
  );
}
