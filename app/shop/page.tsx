import ProductCard from "../components/ProductCard";
import productsData from "@data/products.json";

export const metadata = {
  title: "Shop - Premium Products",
  description: "Browse our collection of premium tools and resources for developers.",
};

export default function ShopPage() {
  const categories = Array.from(new Set(productsData.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="border-b border-zinc-200 bg-white px-6 py-16 dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Shop Premium Products
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Totally necessary items that will solve all your problems. Probably. No refunds.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Categories:
            </span>
            <button className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white dark:bg-zinc-50 dark:text-zinc-900">
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className="rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Showing {productsData.length} products
          </p>
          <select className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 transition-colors hover:border-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
          </select>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {productsData.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              category={product.category}
              imageUrl={product.imageUrl}
              inStock={product.inStock}
              rating={product.rating}
              icon={product.icon}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
