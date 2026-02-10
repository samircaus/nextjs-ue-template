import AdventureCard from "../components/AdventureCard";
import { getAdventures, getImageUrl } from "@/lib/data";

export const metadata = {
  title: "Adventures | WKND",
  description: "Curated trips and experiences for the weekend enthusiast.",
};

export default async function AdventuresPage() {
  const adventures = await getAdventures();
  const activities = Array.from(
    new Set(adventures.map((a) => a.activity).filter(Boolean))
  ).sort();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <section className="border-b border-zinc-200 bg-white px-6 py-16 dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Adventures
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Curated trips and experiences for every weekend.
          </p>
        </div>
      </section>

      {activities.length > 0 && (
        <section className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-black">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Activity:
              </span>
              <span className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white dark:bg-zinc-50 dark:text-zinc-900">
                All
              </span>
              {activities.map((activity) => (
                <span
                  key={activity}
                  className="rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  {activity}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Showing {adventures.length} adventures
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {adventures.map((adventure) => (
            <AdventureCard
              key={adventure.slug}
              slug={adventure.slug}
              title={adventure.title}
              activity={adventure.activity}
              price={adventure.price}
              tripLength={adventure.tripLength}
              imageUrl={getImageUrl(adventure.primaryImage) ?? null}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
