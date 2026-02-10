import ArticleCard from "../components/ArticleCard";
import { getArticles, getImageUrl } from "@/lib/data";
import { aueResource } from "@/lib/universal-editor";

export const metadata = {
  title: "Magazine | WKND",
  description: "Travel stories and inspiration from WKND.",
};

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <section className="border-b border-zinc-200 bg-white px-6 py-16 dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Magazine
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Stories and adventures for the weekend enthusiast.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-16">
        {articles.length === 0 ? (
          <p className="rounded-lg border border-zinc-200 bg-zinc-100 px-6 py-12 text-center text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            No content available. Set <code className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-sm dark:bg-zinc-800">AEM_PUBLISH_URL</code> in your environment to load articles from AEM.
          </p>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Showing {articles.length} articles
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
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
          </>
        )}
      </main>
    </div>
  );
}
