import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdventures, getAdventurePageData, getImageUrl, isWkndImageUrl } from "@/lib/data";
import { aueResource } from "@/lib/universal-editor";

interface AdventurePageProps {
  params: Promise<{ slug: string }>;
}

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect fill='%23e4e4e7' width='800' height='500'/%3E%3Ctext fill='%2371717a' font-family='sans-serif' font-size='24' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EWKND%3C/text%3E%3C/svg%3E";

export async function generateStaticParams() {
  const adventures = await getAdventures();
  return adventures.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: AdventurePageProps) {
  const { slug } = await params;
  const data = await getAdventurePageData(slug);
  if (!data) return { title: "Adventure Not Found | WKND" };
  const { adventure } = data;
  return {
    title: `${adventure.title} | WKND Adventures`,
    description: `${adventure.activity} — ${adventure.tripLength} from $${adventure.price.toLocaleString()}`,
  };
}

export default async function AdventurePage({ params }: AdventurePageProps) {
  const { slug } = await params;
  const data = await getAdventurePageData(slug);
  if (!data) notFound();
  const { adventure, related } = data;

  const imageUrl =
    getImageUrl(adventure.primaryImage) ?? PLACEHOLDER_IMAGE;
  const adventureResource = aueResource(adventure._path);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <div
        className="bg-white dark:bg-black"
        data-aue-resource={adventureResource}
        data-aue-type="reference"
        data-aue-label={adventure.title}
      >
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Link
            href="/adventures"
            className="mb-8 inline-block text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← Back to Adventures
          </Link>

          <div className="grid gap-12 lg:grid-cols-2">
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800"
              data-aue-prop="primaryImage"
              data-aue-type="media"
              data-aue-label="Primary image"
            >
              <Image
                src={imageUrl}
                alt={adventure.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized={imageUrl.startsWith("data:") || isWkndImageUrl(imageUrl)}
              />
            </div>

            <div className="flex flex-col">
              <span className="mb-4 inline-block w-fit rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                {adventure.activity}
              </span>

              <h1
                className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
                data-aue-prop="title"
                data-aue-type="text"
                data-aue-label="title"
              >
                {adventure.title}
              </h1>

              <div className="mb-6 flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                <span>{adventure.tripLength}</span>
                <span>•</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                  ${adventure.price.toLocaleString()}
                </span>
              </div>

              <div
                className="mb-8 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400"
                data-aue-prop="description"
                data-aue-type="richtext"
                data-aue-label="description"
              >
                {adventure.description?.html ? (
                  <div
                    className="prose prose-zinc max-w-none dark:prose-invert prose-p:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: adventure.description.html }}
                  />
                ) : adventure.description?.plaintext ? (
                  <p className="whitespace-pre-wrap">{adventure.description.plaintext}</p>
                ) : (
                  <p>
                    Experience this {adventure.activity.toLowerCase()} adventure over{" "}
                    {adventure.tripLength.toLowerCase()}. Book your spot and get
                    ready for the weekend.
                  </p>
                )}
              </div>

              <button
                type="button"
                className="w-full rounded-full bg-zinc-900 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Book this adventure
              </button>
            </div>
          </div>

          {(() => {
            const itinerary = adventure.itinerary;
            const itineraryUeProps = {
              "data-aue-prop": "itinerary",
              "data-aue-type": "richtext",
              "data-aue-label": "Itinerary",
            };
            if (itinerary?.html) {
              return (
                <div className="mt-16 border-t border-zinc-200 pt-16 dark:border-zinc-800">
                  <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Itinerary
                  </h2>
                  <div
                    className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-semibold prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-a:text-zinc-900 dark:prose-a:text-zinc-50"
                    dangerouslySetInnerHTML={{ __html: itinerary.html }}
                    {...itineraryUeProps}
                  />
                </div>
              );
            }
            if (itinerary?.plaintext) {
              return (
                <div className="mt-16 border-t border-zinc-200 pt-16 dark:border-zinc-800">
                  <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Itinerary
                  </h2>
                  <div
                    className="prose prose-zinc max-w-none dark:prose-invert prose-p:text-zinc-600 dark:prose-p:text-zinc-400"
                    {...itineraryUeProps}
                  >
                    <p className="whitespace-pre-wrap">{itinerary.plaintext}</p>
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-zinc-200 bg-white px-6 py-16 dark:border-zinc-800 dark:bg-black">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              More {adventure.activity}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/adventures/${r.slug}`}
                  className="group rounded-xl border border-zinc-200 bg-zinc-50 p-6 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  <h3 className="mb-2 text-lg font-semibold text-zinc-900 group-hover:text-zinc-600 dark:text-zinc-50 dark:group-hover:text-zinc-300">
                    {r.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {r.tripLength} — ${r.price.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
