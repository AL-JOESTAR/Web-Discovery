import Link from "next/link";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div>
        {eyebrow && (
          <p className="font-serif text-sm uppercase tracking-[0.3em] text-accent">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-lg text-muted">{description}</p>
        )}
      </div>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="btn-ghost shrink-0 self-start sm:self-auto"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
