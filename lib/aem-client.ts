/**
 * AEM GraphQL Persisted Query client.
 * Uses GET requests to execute persisted queries with optional variables.
 *
 * - Production (default): GraphQL and assets use AEM **Publish** (AEM_PUBLISH_URL).
 * - Cloudflare --env preview: GraphQL and assets use AEM **Preview** tier (AEM_PREVIEW_URL).
 * - Preview mode (AEM_PREVIEW_MODE): GraphQL uses AEM **Author** (AEM_AUTHOR_URL) for draft content.
 */

const CONFIG_NAME = "wknd-shared";

/** True when DEBUG or AEM_DEBUG is enabled (e.g. DEBUG=1 or AEM_DEBUG=true). Logs each GraphQL query URL server-side. */
function isDebugEnabled(): boolean {
  const v = process.env.DEBUG ?? process.env.AEM_DEBUG;
  return v === "true" || v === "1" || v === "yes";
}

/** True when server is running in preview mode (e.g. for editors to see draft content from Author). */
function isPreviewMode(): boolean {
  const v = process.env.AEM_PREVIEW_MODE;
  return v === "true" || v === "1";
}

function getAuthorUrl(): string {
  const url = process.env.AEM_AUTHOR_URL?.trim() ?? "";
  return url ? url.replace(/\/$/, "") : "";
}

function getPublishUrl(): string {
  const url = process.env.AEM_PUBLISH_URL?.trim() ?? "";
  return url ? url.replace(/\/$/, "") : "";
}

function getPreviewUrl(): string {
  const url = process.env.AEM_PREVIEW_URL?.trim() ?? "";
  return url ? url.replace(/\/$/, "") : "";
}

/** True when deployment should use AEM Preview tier (e.g. Cloudflare --env preview). */
function usePreviewUrl(): boolean {
  const v = process.env.AEM_USE_PREVIEW_URL;
  return v === "true" || v === "1";
}

/**
 * Base URL used to execute GraphQL persisted queries.
 * Cloudflare preview env: AEM Preview tier. Preview mode: Author. Default: Publish.
 */
function getGraphqlBaseUrl(): string {
  if (usePreviewUrl()) {
    const preview = getPreviewUrl();
    if (preview) return preview;
  }
  if (isPreviewMode()) {
    return getAuthorUrl();
  }
  return getPublishUrl();
}

/**
 * Build the URL for a persisted query with optional variables.
 * Variables are appended as ;var1=value1;var2=value2 and the suffix is UTF-8 encoded.
 * @see https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/headless/graphql-api/persisted-queries.html#encoding-query-url
 */
function buildExecuteUrl(queryName: string, variables?: Record<string, string | number | boolean>): string {
  const base = getGraphqlBaseUrl();
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
 * Uses GET so responses can be cached at Dispatcher/CDN.
 * If AEM is not configured (no AEM_PUBLISH_URL in production), returns empty data without fetching.
 */
export async function executePersistedQuery<T>(
  queryName: string,
  variables?: Record<string, string | number | boolean>
): Promise<AemGraphQLResponse<T>> {
  const base = getGraphqlBaseUrl();
  if (!base) {
    return {};
  }
  const url = buildExecuteUrl(queryName, variables);
  if (isDebugEnabled()) {
    console.log("[AEM GraphQL]", queryName, url);
  }
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    ...(process.env.NODE_ENV === "development"
      ? { cache: "no-store" as RequestCache }
      : { next: { revalidate: 60 } }),
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

/** Whether the app is using Author for GraphQL (preview mode). */
export function getAemPreviewMode(): boolean {
  return isPreviewMode();
}

/** Author base URL. Only used for GraphQL when preview mode is on. */
export function getAemAuthorUrl(): string {
  return getAuthorUrl();
}

/** Publish (or Preview when AEM_USE_PREVIEW_URL) base URL for image/asset URLs and fallback. */
export function getAemPublishUrl(): string {
  if (usePreviewUrl()) {
    const preview = getPreviewUrl();
    if (preview) return preview;
  }
  return getPublishUrl();
}

/** True when AEM is configured (Publish or Preview URL set). */
export function isAemConfigured(): boolean {
  return getGraphqlBaseUrl().length > 0;
}
