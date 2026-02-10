import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticles, getBlogPostPageData, getImageUrl, isWkndImageUrl } from "@/lib/data";
import { aemRichTextJsonToHtml } from "@/lib/render-rich-text";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect fill='%23e4e4e7' width='800' height='400'/%3E%3Ctext fill='%2371717a' font-family='sans-serif' font-size='24' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EWKND%3C/text%3E%3C/svg%3E";

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const data = await getBlogPostPageData(slug);
  if (!data) return { title: "Article Not Found | WKND" };
  return {
    title: `${data.article.title} | WKND Magazine`,
    description: data.article.title,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const data = await getBlogPostPageData(slug);
  if (!data) notFound();
  const { article, relatedArticles } = data;

  const authorName = `${article.authorFragment.firstName} ${article.authorFragment.lastName}`;
  const featuredImageUrl =
    getImageUrl(article.featuredImage) ?? PLACEHOLDER_IMAGE;
  const profilePictureUrl = getImageUrl(
    article.authorFragment.profilePicture
  );

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <article className="bg-white dark:bg-black">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="mb-6">
            <Link
              href="/blog"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              ← Magazine
            </Link>
          </div>

          <h1 className="mb-8 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {article.title}
          </h1>

          <div className="mb-8 flex items-center gap-3">
            {profilePictureUrl ? (
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <Image
                  src={profilePictureUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="48px"
                  unoptimized={isWkndImageUrl(profilePictureUrl)}
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                {authorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {authorName}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                WKND Contributor
              </p>
            </div>
          </div>

          <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={featuredImageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              unoptimized={featuredImageUrl.startsWith("data:") || isWkndImageUrl(featuredImageUrl)}
            />
          </div>

          {(() => {
            const main = article.main;
            const html = main?.html ?? (main?.json != null ? aemRichTextJsonToHtml(main.json) : "");
            if (html) {
              return (
                <div
                  className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-bold prose-h2:text-3xl prose-h2:tracking-tight prose-h3:text-2xl prose-p:text-zinc-600 prose-p:leading-relaxed dark:prose-p:text-zinc-400 prose-a:text-zinc-900 dark:prose-a:text-zinc-50"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              );
            }
            if (main?.plaintext) {
              return (
                <div className="prose prose-zinc max-w-none dark:prose-invert prose-p:text-zinc-600 dark:prose-p:text-zinc-400">
                  <p className="whitespace-pre-wrap">{main.plaintext}</p>
                </div>
              );
            }
            return (
              <p className="text-zinc-600 dark:text-zinc-400">
                Content for this article is not available.
              </p>
            );
          })()}
        </div>
      </article>

      {relatedArticles.length > 0 && (
        <section className="border-t border-zinc-200 bg-white px-6 py-16 dark:border-zinc-800 dark:bg-black">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              More from the Magazine
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group rounded-xl border border-zinc-200 bg-zinc-50 p-6 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  <h3 className="mb-2 text-lg font-semibold text-zinc-900 group-hover:text-zinc-600 dark:text-zinc-50 dark:group-hover:text-zinc-300">
                    {related.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    By {related.authorFragment.firstName}{" "}
                    {related.authorFragment.lastName}
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
