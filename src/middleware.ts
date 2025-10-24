import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { defaultLocale, localePrefix, locales } from "@fb/utils/navigation";

const intlMiddleware = createMiddleware({
  defaultLocale,
  localePrefix,
  locales,
  localeDetection: false,
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect root path `/` to `/fa`
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}`;
    return NextResponse.redirect(url);
  }

  // Redirect `/en` and anything under it to `/fa`
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en/, `/${defaultLocale}`);
    return NextResponse.redirect(url);
  }

  // Use next-intl middleware for everything else
  return intlMiddleware(request);
}

export const config = {
  // This line is in documentation
  // matcher: ["/", `/(fa|en)/:path*`],
  //
  // And sometimes this error occurs: Unable to find `next-intl` locale because the middleware didn't run on this request.
  // This is the solution:
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|favicon.svg|images/books|icons|manifest|img|fonts|.*\\..*).*)",
    "/(.*)/lucide-react.js.map",
  ],
};
