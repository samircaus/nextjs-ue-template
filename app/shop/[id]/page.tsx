import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import productsData from "@data/products.json";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate static params for all products
export async function generateStaticParams() {
  return productsData.map((product) => ({
    id: product.id.toString(),
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = productsData.find((p) => p.id === parseInt(id));

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Shop`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = productsData.find((p) => p.id === parseInt(id));

  if (!product) {
    notFound();
  }

  // Get related products (same category, exclude current)
  const relatedProducts = productsData
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      {/* Product Details */}
      <div className="bg-white dark:bg-black">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Link
            href="/shop"
            className="mb-8 inline-block text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← Back to Shop
          </Link>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
              {product.icon ? (
                <div className="flex h-full w-full items-center justify-center text-[200px]">
                  {product.icon}
                </div>
              ) : (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-16 dark:invert"
                  priority
                />
              )}
              {!product.inStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="rounded-full bg-white px-6 py-3 text-lg font-semibold text-black">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                <span className="rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                  {product.category}
                </span>
              </div>

              <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {product.name}
              </h1>

              <div className="mb-6 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.floor(product.rating)
                          ? "text-yellow-500"
                          : "text-zinc-300 dark:text-zinc-700"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {product.rating}
                </span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  (127 reviews)
                </span>
              </div>

              <p className="mb-8 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                {product.description}
              </p>

              <div className="mb-8 border-y border-zinc-200 py-8 dark:border-zinc-800">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <button
                  disabled={!product.inStock}
                  className="w-full rounded-full bg-zinc-900 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  What's Included
                </h3>
                <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>Instant regret... I mean, delivery!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>Updates (when we remember)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>Documentation that's definitely not AI-generated</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>Support from our rubber duck team</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>30-day "why did I buy this?" guarantee</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-16 border-t border-zinc-200 pt-16 dark:border-zinc-800">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              The Fine Print
            </h2>
            <div className="prose prose-zinc max-w-none dark:prose-invert">
              <p>
                {product.description}
              </p>
              <p>
                Look, we're not saying this will solve all your problems, but it definitely won't make them worse. Probably. 
                Side effects may include increased productivity, spontaneous laughter, and the overwhelming urge to show your coworkers.
              </p>
              <p className="text-sm italic">
                * Results may vary. No actual rubber ducks were harmed in the making of this product. Coffee IV drips are for entertainment purposes only. Please drink responsibly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-zinc-200 bg-white px-6 py-16 dark:border-zinc-800 dark:bg-black">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Related Products
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/shop/${related.id}`}
                  className="group rounded-xl border border-zinc-200 bg-zinc-50 p-6 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-white dark:bg-zinc-800">
                    {related.icon ? (
                      <div className="flex h-full w-full items-center justify-center text-6xl">
                        {related.icon}
                      </div>
                    ) : (
                      <Image
                        src={related.imageUrl}
                        alt={related.name}
                        fill
                        className="object-contain p-8 dark:invert"
                      />
                    )}
                  </div>
                  <span className="mb-2 inline-block rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                    {related.category}
                  </span>
                  <h3 className="mb-2 text-lg font-semibold text-zinc-900 group-hover:text-zinc-600 dark:text-zinc-50 dark:group-hover:text-zinc-300">
                    {related.name}
                  </h3>
                  <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {related.description}
                  </p>
                  <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    ${related.price.toFixed(2)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
