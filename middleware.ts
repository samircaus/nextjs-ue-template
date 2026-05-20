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
  const authorPreview =
    searchParams.get("mode") === "author-preview" ||
    request.cookies.get("aem-author-preview")?.value === "1" ||
    referer.startsWith("https://experience.adobe.com");

  const { origin } = request.nextUrl;

  console.log("[middleware]", pathname, "| login-token:", loginToken ? "present" : "missing", "| author:", authorUrl || "none", "| authorPreview:", authorPreview, "| referer:", referer || "none");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-origin", origin);
  requestHeaders.set("x-pathname", pathname);
  if (loginToken) requestHeaders.set("x-aem-login-token", loginToken);
  if (authorUrl) requestHeaders.set("x-aem-author-url", authorUrl);
  if (authorPreview) requestHeaders.set("x-author-preview", "1");

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Persist author context in session cookies so browser-initiated requests (images) inherit it.
  const cookieOpts = { httpOnly: true, sameSite: "lax" as const, path: "/" };
  if (searchParams.get("login-token")) {
    response.cookies.set("aem-login-token", loginToken!, cookieOpts);
  }
  if (searchParams.get("author")) {
    response.cookies.set("aem-author-url", authorUrl!, cookieOpts);
  }
  if (searchParams.get("mode") === "author-preview") {
    response.cookies.set("aem-author-preview", "1", cookieOpts);
  }

  return response;
}

export const config = {
  // Run on all routes except Next.js internals and static files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
