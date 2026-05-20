/**
 * AEM GraphQL Persisted Query client.
 * Uses GET requests to execute persisted queries with optional variables.
 *
 * Two content tiers:
 *   - Author  – used when the app runs inside Universal Editor (UE detects this
 *               via x-aem-login-token / x-aem-author-url request headers set by
 *               middleware.ts from UE's ?login-token=…&author=… query params).
 *               Also used when ?mode=author-preview is in the URL (x-author-preview header).
 *   - Publish – default for all public traffic.
 */

const CONFIG_NAME = "wknd-shared";

/** True when DEBUG or AEM_DEBUG is enabled (e.g. DEBUG=1 or AEM_DEBUG=true). */
function isDebugEnabled(): boolean {
  const v = process.env.DEBUG ?? process.env.AEM_DEBUG;
  return v === "true" || v === "1" || v === "yes";
}

function getAuthorUrl(): string {
  return process.env.AEM_AUTHOR_URL?.trim().replace(/\/$/, "") ?? "";
}

function getPublishUrl(): string {
  return process.env.AEM_PUBLISH_URL?.trim().replace(/\/$/, "") ?? "";
}

/**
 * Read the UE context that middleware.ts promoted to request headers.
 * Returns the AEM Author URL and Bearer token when the app is running inside UE.
 */
async function getUEContext(): Promise<{ authorUrl: string; token: string } | null> {
  try {
    // Dynamic import keeps "next/headers" out of the module-level scope so this
    // file can safely be imported by Client Components without a build error.
    const { headers } = await import("next/headers");
    const h = await headers();
    const token = h.get("x-aem-login-token") ?? "";
    const authorUrl = h.get("x-aem-author-url") ?? "";
    const authorPreview = h.get("x-author-preview") === "1";
    console.log("[AEM] getUEContext token:", token ? "present" : "missing", "| authorUrl:", authorUrl || "none", "| authorPreview:", authorPreview);
    if (token || authorUrl || authorPreview) {
      return {
        authorUrl: authorUrl.replace(/\/$/, "") || getAuthorUrl(),
        token,
      };
    }
  } catch (e) {
    console.log("[AEM] getUEContext headers() threw:", e);
  }
  return null;
}

/**
 * Resolve the base URL and optional Bearer token for the current request.
 *
 * Priority:
 *  1. UE context (x-aem-login-token / x-aem-author-url headers) → Author + token
 *  2. Default → Publish
 */
async function resolveContext(): Promise<{ baseUrl: string; token?: string; isAuthor: boolean }> {
  const ue = await getUEContext();
  if (ue) {
    return { baseUrl: ue.authorUrl, token: ue.token || undefined, isAuthor: true };
  }
  return { baseUrl: getPublishUrl(), isAuthor: false };
}

/**
 * Build the URL for a persisted query with optional variables.
 * Variables are appended as ;var1=value1;var2=value2 (UTF-8 encoded per AEM spec).
 * @see https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/headless/graphql-api/persisted-queries.html#encoding-query-url
 */
function buildExecuteUrl(
  base: string,
  queryName: string,
  variables?: Record<string, string | number | boolean>
): string {
  let path = `/graphql/execute.json/${CONFIG_NAME}/${queryName}`;
  if (variables && Object.keys(variables).length > 0) {
    const suffix =
      ";" +
      Object.entries(variables)
        .map(([k, v]) => `${k}=${String(v)}`)
        .join(";");
    path += encodeURIComponent(suffix);
  }
  return `${base}${path}`;
}

export interface AemGraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

/**
 * Execute a persisted query by name with optional variables.
 * Uses GET so responses can be cached at Dispatcher/CDN (Publish only).
 * Author requests (UE or preview mode) are always uncached.
 */
export async function executePersistedQuery<T>(
  queryName: string,
  variables?: Record<string, string | number | boolean>
): Promise<AemGraphQLResponse<T>> {
  const { baseUrl, token, isAuthor } = await resolveContext();

  if (!baseUrl) {
    return {};
  }

  const urlObj = new URL(buildExecuteUrl(baseUrl, queryName, variables));
  // Cache-bust: AEM's persisted-query CDN cache (s-maxage=7200) would otherwise serve stale data.
  urlObj.searchParams.set("_", String(Date.now()));
  if (token) urlObj.searchParams.set("login-token", token);
  const url = urlObj.toString();

  if (isDebugEnabled()) {
    console.log("[AEM GraphQL]", isAuthor ? "author" : "publish", queryName, url);
  }

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AEM GraphQL request failed (${res.status}): ${url} - ${text}`);
  }

  const json = (await res.json()) as AemGraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(`AEM GraphQL errors: ${json.errors.map((e) => e.message).join("; ")}`);
  }
  return json;
}

/**
 * Base URL for image/asset URLs (always Publish — images are CDN-delivered
 * and do not require auth, even when editing in UE).
 */
export function getAemPublishUrl(): string {
  return getPublishUrl();
}

/** True when AEM Publish is configured. */
export function isAemConfigured(): boolean {
  return getPublishUrl().length > 0;
}
