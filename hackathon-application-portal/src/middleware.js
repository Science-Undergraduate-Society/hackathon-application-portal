import { NextResponse } from "next/server";

const STATIC_ASSET_REGEX = /\.(?:js|css|json|png|jpe?g|gif|svg|ico|webp|woff2?|ttf|eot|txt|xml|map)$/i;

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const isHome = pathname === "/" || pathname === "";
  const isNextInternal = pathname.startsWith("/_next");
  const isApiRoute = pathname.startsWith("/api");
  const isStaticAsset = STATIC_ASSET_REGEX.test(pathname);

  if (isHome || isNextInternal || isApiRoute || isStaticAsset) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/";
  redirectUrl.search = "";

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/:path*"],
};
