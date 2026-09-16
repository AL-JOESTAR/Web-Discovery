import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatDate, readingTime, cn } from "@/lib/utils";

export function ArticleCard({
  article,
  featured = false,
  className,
}: {
  article: Article;
  featured?: boolean;
  className?: string;
}) {
  const href = `/blog/${article.slug}`;
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm shadow-stone-900/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-stone-900/10",
        featured && "lg:flex-row",
        className
      )}
    >
      {article.cover_image ? (
        <div
          className={cn(
            "w-full overflow-hidden",
            featured
              ? "aspect-[16/9] lg:aspect-auto lg:h-auto lg:w-[48%] lg:min-h-[280px]"
              : "aspect-[3/2]"
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.cover_image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div
          className={cn(
            "flex w-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200",
            featured
              ? "aspect-[16/9] lg:aspect-auto lg:w-[48%] lg:min-h-[280px]"
              : "aspect-[3/2]"
          )}
        >
          <span className="font-serif text-2xl font-semibold text-stone-400">
            {article.title.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div className={cn("flex flex-1 flex-col p-5", featured && "lg:justify-center lg:p-8")}>
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400">
          {article.category && (
            <span className="font-medium uppercase tracking-wide text-accent">
              {article.category.name}
            </span>
          )}
          <span>•</span>
          <span>{formatDate(article.published_at || article.created_at)}</span>
          <span>•</span>
          <span>{readingTime(article.content_html)} mnt</span>
        </div>
        <h3
          className={cn(
            "mt-2 font-serif font-bold tracking-tight text-foreground transition-colors group-hover:text-accent",
            featured ? "text-2xl sm:text-3xl" : "text-lg"
          )}
        >
          {article.title}
        </h3>
        {article.excerpt && (
          <p
            className={cn(
              "mt-2 leading-relaxed text-muted",
              featured ? "line-clamp-3 text-base" : "line-clamp-2 flex-1 text-sm"
            )}
          >
            {article.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
