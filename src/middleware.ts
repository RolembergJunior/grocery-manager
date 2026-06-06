import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "firebase-session";

const protectedRoutes = ["/", "/shopping-list", "/subscribe"];
const authRoutes = ["/login"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.cookies.get(SESSION_COOKIE)?.value;

  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isAuthenticated && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
