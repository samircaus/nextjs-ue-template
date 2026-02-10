import ArticleCard from "./components/ArticleCard";
import AdventureCard from "./components/AdventureCard";
import { getArticles, getAdventures, getImageUrl } from "@/lib/data";
import { aueResource } from "@/lib/universal-editor";

export default async function Home() {
  const [articles, adventures] = await Promise.all([
    getArticles(),
    getAdventures(),
  ]);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="border-b border-zinc-200 bg-white px-6 py-20 dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              WKND
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Stories and adventures for the weekend enthusiast.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-16">
        {/* Magazine Section */}
        <section className="mb-20">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Magazine
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Travel stories and inspiration
              </p>
            </div>
            <a
              href="/blog"
              className="text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
            >
              View all →
            </a>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {articles.slice(0, 4).map((article) => (
              <ArticleCard
                key={article.slug}
                title={article.title}
                slug={article.slug}
                author={`${article.authorFragment.firstName} ${article.authorFragment.lastName}`}
                imageUrl={getImageUrl(article.featuredImage) ?? null}
                profilePictureUrl={getImageUrl(article.authorFragment.profilePicture) ?? null}
                aueResource={aueResource(article._path)}
              />
            ))}
          </div>
        </section>

        {/* Adventures Section */}
        <section>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Adventures
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Curated trips and experiences
              </p>
            </div>
            <a
              href="/adventures"
              className="text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
            >
              View all →
            </a>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {adventures.slice(0, 4).map((adventure) => (
              <AdventureCard
                key={adventure.slug}
                slug={adventure.slug}
                title={adventure.title}
                activity={adventure.activity}
                price={adventure.price}
                tripLength={adventure.tripLength}
                imageUrl={getImageUrl(adventure.primaryImage) ?? null}
                aueResource={aueResource(adventure._path)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white px-6 py-12 dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto max-w-7xl text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>WKND — Adventure & Travel Magazine</p>
        </div>
      </footer>
    </div>
  );
}
