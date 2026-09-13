import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatDate, readingTime } from "@/lib/utils";

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const href = `/blog/${article.slug}`;
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-shadow hover:shadow-lg"
    >
      {article.cover_image ? (
        <div className={`w-full overflow-hidden ${featured ? "aspect-[16/9]" : "aspect-[3/2]"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.cover_image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className={`flex w-full items-center justify-center ${featured ? "aspect-[16/9]" : "aspect-[3/2]"} bg-gradient-to-br from-stone-100 to-stone-200`}>
          <span className="font-serif text-2xl font-semibold text-stone-400">
            {article.title.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-stone-400">
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
          className={`mt-2 font-serif font-bold tracking-tight text-stone-900 group-hover:text-accent ${
            featured ? "text-2xl" : "text-lg"
          }`}
        >
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-stone-500">
            {article.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}