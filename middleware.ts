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

export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const loginToken = searchParams.get("login-token");
  const authorUrl = searchParams.get("author");

  if (!loginToken && !authorUrl) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  if (loginToken) requestHeaders.set("x-aem-login-token", loginToken);
  if (authorUrl) requestHeaders.set("x-aem-author-url", authorUrl);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  // Run on all routes except Next.js internals and static files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
