import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const h = await headers();

  const loginToken = h.get("x-aem-login-token") ?? "";
  const authorPreview = h.get("x-author-preview") === "1";
  const authorUrlHeader = h.get("x-aem-author-url") ?? "";

  const token =
    loginToken ||
    process.env.AEM_AUTHOR_TOKEN?.trim() ||
    "";
  const authorUrl =
    authorUrlHeader.replace(/\/$/, "") ||
    process.env.AEM_AUTHOR_URL?.trim() ||
    "";
  const publishUrl = process.env.AEM_PUBLISH_URL?.trim() ?? "";

  const useAuthor = authorPreview && !!authorUrl;
  const baseUrl = useAuthor ? authorUrl : publishUrl;

  if (!baseUrl) {
    return new NextResponse("AEM not configured", { status: 503 });
  }

  const dmPath = `/adobe/dynamicmedia/${path.join("/")}`;
  const destUrl = new URL(dmPath, baseUrl);

  // Forward DM preset / format query params; strip login-token if present
  request.nextUrl.searchParams.forEach((value, key) => {
    if (key !== "login-token") destUrl.searchParams.set(key, value);
  });

  const fetchHeaders: Record<string, string> = {
    Accept: request.headers.get("Accept") ?? "image/*,*/*",
  };
  if (useAuthor && token) {
    fetchHeaders["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(destUrl.toString(), {
      headers: fetchHeaders,
      cache: "no-store",
    });

    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    const body = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "image/jpeg";

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": useAuthor ? "no-store" : "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[DM proxy] fetch failed:", err);
    return new NextResponse("Upstream error", { status: 502 });
  }
}
