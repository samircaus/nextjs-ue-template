import Image from "next/image";
import Link from "next/link";
import { isWkndImageUrl } from "@/lib/data";

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23e4e4e7' width='400' height='300'/%3E%3Ctext fill='%2371717a' font-family='sans-serif' font-size='18' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EWKND%3C/text%3E%3C/svg%3E";

interface ArticleCardProps {
  title: string;
  slug: string;
  author: string;
  imageUrl: string | null;
  profilePictureUrl?: string | null;
  excerpt?: string | null;
  date?: string | null;
  category?: string | null;
  /** When set, wraps the card in a UE-instrumented component (for list/edit in Universal Editor). */
  aueResource?: string | null;
}

export default function ArticleCard({
  title,
  slug,
  author,
  imageUrl,
  profilePictureUrl,
  excerpt,
  date,
  category,
  aueResource,
}: ArticleCardProps) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const imgSrc = imageUrl || PLACEHOLDER_IMAGE;

  const content = (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <Link href={`/blog/${slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">Read article: {title}</span>
      </Link>
      <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized={imgSrc.startsWith("data:") || isWkndImageUrl(imgSrc)}
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center gap-2">
          {category && (
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
              {category}
            </span>
          )}
          {formattedDate && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {formattedDate}
            </span>
          )}
        </div>
        <h3 className="mb-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
        {excerpt && (
          <p className="mb-4 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2">
            {excerpt}
          </p>
        )}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {profilePictureUrl ? (
              <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <Image
                  src={profilePictureUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="32px"
                  unoptimized={isWkndImageUrl(profilePictureUrl)}
                />
              </div>
            ) : (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                {author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
            )}
            <span className="truncate text-sm text-zinc-500 dark:text-zinc-400">
              By {author}
            </span>
          </div>
          <span className="flex-shrink-0 text-sm font-medium text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-50 dark:group-hover:text-zinc-300">
            Read more →
          </span>
        </div>
      </div>
    </article>
  );

  if (aueResource) {
    return (
      <div
        data-aue-resource={aueResource}
        data-aue-type="component"
        data-aue-label={title}
      >
        {content}
      </div>
    );
  }
  return content;
}
