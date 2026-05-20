/**
 * Universal Editor request context forwarding.
 *
 * When AEM Universal Editor opens the app it appends query params:
 *   ?author=https://author-…  &  login-token=<IMS bearer token>
 *
 * These are request-scoped and cannot live in process.env, so we promote them
 * to synthetic request headers here so that server components and lib/aem-client
 * can read them with `headers()` without prop-drilling.
 */
import { NextRequest, NextResponse } from "next/server";

export const runtime = "experimental-edge";

export function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;

  // Query params take priority; cookies as fallback for browser-initiated requests (images, etc.)
  const loginToken =
    searchParams.get("login-token") ??
    request.cookies.get("aem-login-token")?.value ??
    null;
  const authorUrl =
    searchParams.get("author") ??
    request.cookies.get("aem-author-url")?.value ??
    null;
  const referer = request.headers.get("referer") ?? "";
  const isUeReferer =
    referer.startsWith("https://experience.adobe.com") ||
    referer.includes("mode=author-preview");
  const authorPreview =
    searchParams.get("mode") === "author-preview" ||
    request.cookies.get("aem-author-preview")?.value === "1" ||
    isUeReferer;

  const { origin } = request.nextUrl;

  console.log("[middleware]", pathname, "| login-token:", loginToken ? "present" : "missing", "| author:", authorUrl || "none", "| authorPreview:", authorPreview, "| referer:", referer || "none");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-origin", origin);
  requestHeaders.set("x-pathname", pathname);
  if (loginToken) requestHeaders.set("x-aem-login-token", loginToken);
  if (authorUrl) requestHeaders.set("x-aem-author-url", authorUrl);
  if (authorPreview) requestHeaders.set("x-author-preview", "1");

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Persist author context in session cookies so browser-initiated requests (images, RSC) inherit it.
  // SameSite=None + Secure + Partitioned (CHIPS) are required when the site runs inside the UE iframe
  // on experience.adobe.com — Lax cookies are not sent/stored in that third-party context.
  const cookieOpts = {
    httpOnly: true,
    sameSite: "none" as const,
    secure: true,
    partitioned: true,
    path: "/",
    maxAge: 60 * 60 * 8,
  };
  if (loginToken && searchParams.get("login-token")) {
    response.cookies.set("aem-login-token", loginToken, cookieOpts);
  }
  if (authorUrl && searchParams.get("author")) {
    response.cookies.set("aem-author-url", authorUrl, cookieOpts);
  }
  // Set cookie whenever authorPreview is true — covers ?mode=author-preview, UE referer, and
  // any navigation within the iframe where query params are gone but context must persist.
  if (authorPreview) {
    response.cookies.set("aem-author-preview", "1", cookieOpts);
  }

  return response;
}

export const config = {
  // Run on all routes except Next.js internals and static files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
