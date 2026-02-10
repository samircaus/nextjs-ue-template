/**
 * WKND content data layer.
 * Fetches from AEM via persisted GraphQL (Author URL). Image URLs use Publish URL.
 */

import { unstable_cache } from "next/cache";
import { cache } from "react";
import {
  executePersistedQuery,
  getAemPublishUrl,
} from "./aem-client";
import type {
  WkndAdventure,
  WkndAdventureDetail,
  WkndArticleListItem,
  WkndArticleWithContent,
  WkndImage,
} from "./types";

// --- Response shapes from AEM GraphQL ---

interface AdventureListResponse {
  adventureList: { items: WkndAdventure[] };
}

interface AdventureByPathResponse {
  adventureByPath: { item: WkndAdventureDetail | null };
}

/** adventure-by-slug: adventureList filtered by slug (unique), returns full detail. */
interface AdventureBySlugResponse {
  adventureList: { items: WkndAdventureDetail[] };
}

interface ArticlePaginatedResponse {
  articlePaginated: {
    edges: Array<{ cursor: string; node: WkndArticleListItem }>;
    pageInfo?: { endCursor?: string; hasNextPage?: boolean };
  };
}

interface ArticleByPathResponse {
  articleByPath: { item: WkndArticleWithContent | null };
}

/** article-by-slug: articleList filtered by slug (unique), returns full article with main.html. */
interface ArticleBySlugResponse {
  articleList: { items: WkndArticleWithContent[] };
}

// --- Data fetchers (cached so generateStaticParams + page data share one request) ---

async function fetchAdventuresListImpl(): Promise<WkndAdventure[]> {
  try {
    const res = await executePersistedQuery<AdventureListResponse>("adventures-all");
    return res.data?.adventureList?.items ?? [];
  } catch (err) {
    console.error("AEM getAdventures failed:", err);
    return [];
  }
}

const getCachedAdventuresList = cache(fetchAdventuresListImpl);

/** All adventures (list). Returns empty array if AEM is unreachable (e.g. 401 in CI). */
export async function getAdventures(): Promise<WkndAdventure[]> {
  return getCachedAdventuresList();
}

/** Single adventure by content path (full detail). One GraphQL call: adventure-by-path. */
export async function getAdventureByPath(
  adventurePath: string
): Promise<WkndAdventureDetail | undefined> {
  try {
    const res = await executePersistedQuery<AdventureByPathResponse>(
      "adventure-by-path",
      { adventurePath }
    );
    return res.data?.adventureByPath?.item ?? undefined;
  } catch (err) {
    console.error("AEM getAdventureByPath failed:", err);
    return undefined;
  }
}

/** Single adventure by slug (full detail). One GraphQL call: adventure-by-slug. */
export async function getAdventureBySlug(
  slug: string
): Promise<WkndAdventureDetail | undefined> {
  try {
    const res = await executePersistedQuery<AdventureBySlugResponse>(
      "adventure-by-slug",
      { slug }
    );
    const items = res.data?.adventureList?.items ?? [];
    return items[0] ?? undefined;
  } catch (err) {
    console.error("AEM getAdventureBySlug failed:", err);
    return undefined;
  }
}

/** All data for the adventure page: adventure + related. Cached per request. Uses adventure-by-slug + adventures-all (2 GraphQL calls). */
export const getAdventurePageData = cache(async (slug: string): Promise<{
  adventure: WkndAdventureDetail;
  related: WkndAdventure[];
} | null> => {
  const [adventure, list] = await Promise.all([
    getAdventureBySlug(slug),
    getCachedAdventuresList(),
  ]);
  if (!adventure) return null;
  const related = list
    .filter((a) => a.slug !== slug && a.activity === adventure.activity)
    .slice(0, 3);
  return { adventure, related };
});

async function fetchArticlesListImpl(): Promise<WkndArticleListItem[]> {
  try {
    const res = await executePersistedQuery<ArticlePaginatedResponse>("articles-all");
    const edges = res.data?.articlePaginated?.edges ?? [];
    return edges.map((e) => e.node);
  } catch (err) {
    console.error("AEM getArticles failed:", err);
    return [];
  }
}

// Cross-request cache so generateStaticParams and getBlogPostPageData share one fetch (avoids 2x articles-all log).
const getCachedArticlesList = cache(
  unstable_cache(fetchArticlesListImpl, ["articles-all"], { revalidate: 60 })
);

/** All articles (list, no full body). Returns empty array if AEM is unreachable. */
export async function getArticles(): Promise<WkndArticleListItem[]> {
  return getCachedArticlesList();
}

/** Single article by content path (full body). One GraphQL call: article-by-path. */
export async function getArticleByPath(
  articlePath: string
): Promise<WkndArticleWithContent | undefined> {
  try {
    const res = await executePersistedQuery<ArticleByPathResponse>(
      "article-by-path",
      { articlePath }
    );
    return res.data?.articleByPath?.item ?? undefined;
  } catch (err) {
    console.error("AEM getArticleByPath failed:", err);
    return undefined;
  }
}

/**
 * Single article by slug (with main content). One GraphQL call: article-by-slug.
 * AEM persisted query "article-by-slug" must use getArticleBySlug with articleList(filter: {slug}), main { html }. See docs/PERSISTED_QUERIES.md §4b.
 */
export async function getArticleBySlug(
  slug: string
): Promise<WkndArticleWithContent | undefined> {
  try {
    const res = await executePersistedQuery<ArticleBySlugResponse>(
      "article-by-slug",
      { slug }
    );
    const list = res.data?.articleList;
    const items =
      list?.items ??
      (Array.isArray((list as { list?: unknown[] })?.list)
        ? (list as { list: WkndArticleWithContent[] }).list
        : []);
    const article = items[0] ?? undefined;
    if (article && !article.main?.html && !article.main?.plaintext && !article.main?.json && process.env.NODE_ENV === "development") {
      console.warn("[AEM article-by-slug] Article has no main.html, main.plaintext, or main.json. Received keys:", Object.keys(article), "main:", article.main);
    }
    return article;
  } catch (err) {
    console.error("AEM getArticleBySlug failed:", err);
    return undefined;
  }
}

/** All data for the blog post page: article + related. Cached per request. Uses article-by-slug + articles-all (2 GraphQL calls). */
export const getBlogPostPageData = cache(async (slug: string): Promise<{
  article: WkndArticleWithContent;
  relatedArticles: WkndArticleListItem[];
} | null> => {
  const [article, list] = await Promise.all([
    getArticleBySlug(slug),
    getCachedArticlesList(),
  ]);
  if (!article) return null;
  const relatedArticles = list
    .filter((a) => a.slug !== slug)
    .slice(0, 3);
  return { article, relatedArticles };
});

/** Image URL for display. Prefers _dynamicUrl; falls back to _path. Base from AEM Publish URL or env override. */
export function getImageUrl(
  image: WkndImage | string | null | undefined
): string | null {
  if (!image) return null;
  const base =
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? getAemPublishUrl();
  const path =
    typeof image === "string"
      ? image
      : (image._dynamicUrl ?? image._path);
  if (!path) return null;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base.replace(/\/$/, "")}${normalized}`;
}

/** True if URL is from WKND/AEM (use unoptimized so browser loads directly). */
export function isWkndImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const publish = getAemPublishUrl();
  return url.startsWith(publish) || url.includes("adobeaemcloud.com");
}
