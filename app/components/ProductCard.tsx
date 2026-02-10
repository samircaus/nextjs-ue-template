"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  rating: number;
  icon?: string;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  category,
  imageUrl,
  inStock,
  rating,
  icon,
}: ProductCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <Link href={`/shop/${id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View product: {name}</span>
      </Link>
      <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {icon ? (
          <div className="flex h-full w-full items-center justify-center text-7xl transition-transform group-hover:scale-110">
            {icon}
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-contain p-8 transition-transform group-hover:scale-105 dark:invert"
          />
        )}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
            {category}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {rating}
            </span>
            <span className="text-yellow-500">★</span>
          </div>
        </div>
        <h3 className="mb-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {name}
        </h3>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            ${price.toFixed(2)}
          </span>
          <button
            disabled={!inStock}
            className="relative z-20 rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic here
            }}
          >
            {inStock ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}
