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
  const loginToken = searchParams.get("login-token");
  const authorUrl = searchParams.get("author");
  const referer = request.headers.get("referer") ?? "";
  const authorPreview =
    searchParams.get("mode") === "author-preview" ||
    referer.startsWith("https://experience.adobe.com");

  const { origin } = request.nextUrl;

  console.log("[middleware]", pathname, "| login-token:", loginToken ? "present" : "missing", "| author:", authorUrl || "none", "| authorPreview:", authorPreview, "| referer:", referer || "none");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-origin", origin);
  requestHeaders.set("x-pathname", pathname);
  if (loginToken) requestHeaders.set("x-aem-login-token", loginToken);
  if (authorUrl) requestHeaders.set("x-aem-author-url", authorUrl);
  if (authorPreview) requestHeaders.set("x-author-preview", "1");

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  // Run on all routes except Next.js internals and static files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
