/**
 * AEM GraphQL Persisted Query client.
 * Uses GET requests to execute persisted queries with optional variables.
 *
 * Two content tiers:
 *   - Author  – used when the app runs inside Universal Editor (UE detects this
 *               via x-aem-login-token / x-aem-author-url request headers set by
 *               middleware.ts from UE's ?login-token=…&author=… query params).
 *               Also used when AEM_PREVIEW_MODE=true (local / CI dev convenience).
 *   - Publish – default for all public traffic.
 */

import { headers } from "next/headers";

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
    const h = await headers();
    const token = h.get("x-aem-login-token") ?? "";
    const authorUrl = h.get("x-aem-author-url") ?? "";
    if (token || authorUrl) {
      return {
        authorUrl: authorUrl.replace(/\/$/, "") || getAuthorUrl(),
        token,
      };
    }
  } catch {
    // headers() is only available inside a React Server Component request.
    // Outside that context (e.g. during build/static gen) it throws — ignore.
  }
  return null;
}

/** True when the server was started with AEM_PREVIEW_MODE=true (dev/CI convenience). */
function isEnvAuthorMode(): boolean {
  const v = process.env.AEM_PREVIEW_MODE;
  return v === "true" || v === "1";
}

/**
 * Resolve the base URL and optional Bearer token for the current request.
 *
 * Priority:
 *  1. UE context (x-aem-login-token / x-aem-author-url headers) → Author + token
 *  2. AEM_PREVIEW_MODE env var → Author (no per-request token)
 *  3. Default → Publish
 */
async function resolveContext(): Promise<{ baseUrl: string; token?: string; isAuthor: boolean }> {
  const ue = await getUEContext();
  if (ue) {
    return { baseUrl: ue.authorUrl, token: ue.token || undefined, isAuthor: true };
  }
  if (isEnvAuthorMode()) {
    const url = getAuthorUrl();
    return { baseUrl: url, isAuthor: true };
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

  const url = buildExecuteUrl(baseUrl, queryName, variables);

  if (isDebugEnabled()) {
    console.log("[AEM GraphQL]", isAuthor ? "author" : "publish", queryName, url);
  }

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // Never cache Author responses (per-user auth, draft content).
    // In dev, also skip cache so edits are always fresh.
    ...(isAuthor || process.env.NODE_ENV === "development"
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
