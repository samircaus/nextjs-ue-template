"use client";

import Image from "next/image";
import Link from "next/link";
import { isWkndImageUrl } from "@/lib/data";

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23e4e4e7' width='400' height='300'/%3E%3Ctext fill='%2371717a' font-family='sans-serif' font-size='18' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EWKND%3C/text%3E%3C/svg%3E";

interface AdventureCardProps {
  slug: string;
  title: string;
  activity: string;
  price: number;
  tripLength: string;
  imageUrl: string | null;
}

export default function AdventureCard({
  slug,
  title,
  activity,
  price,
  tripLength,
  imageUrl,
}: AdventureCardProps) {
  const imgSrc = imageUrl || PLACEHOLDER_IMAGE;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <Link href={`/adventures/${slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">View adventure: {title}</span>
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
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
            {activity}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {tripLength}
          </span>
        </div>
        <h3 className="mb-4 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            ${price.toLocaleString()}
          </span>
          <span className="text-sm font-medium text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-50 dark:group-hover:text-zinc-300">
            View trip →
          </span>
        </div>
      </div>
    </div>
  );
}
