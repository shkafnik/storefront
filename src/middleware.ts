import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_CHANNEL = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "default-channel";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip: already channel-prefixed, Next.js internals, static files, API, checkout
  if (
    pathname.startsWith(`/${DEFAULT_CHANNEL}`) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/checkout") ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_CHANNEL}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?\!_next/static|_next/image|favicon.ico|apple-icon.png|icon.png|opengraph-image.png|twitter-image.png).*)"],
};
