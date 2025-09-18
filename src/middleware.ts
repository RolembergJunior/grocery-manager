import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth({
  providers: [Google],
});

export default auth(async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!auth();

  const protectedRoutes = ["/", "/shopping-list"];

  const authRoutes = ["/login"];

  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isAuthenticated && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
