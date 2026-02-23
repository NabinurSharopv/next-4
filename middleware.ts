import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const role = request.cookies.get("role")?.value;
    const pathname = request.nextUrl.pathname;

    // Agar /login ga so'rov bo'lsa, /auth/login ga redirect qil
    if (pathname === "/login") {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Agar /auth/login ga so'rov bo'lsa va token bo'lsa, bosh sahifaga redirect qil
    if (pathname === "/auth/login" && token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Token bo'lmasa va himoyalangan sahifaga kirsa, login sahifasiga redirect
    if (!token && (
        pathname === "/" ||
        pathname.startsWith("/about") ||
        pathname.startsWith("/contact") ||
        pathname.startsWith("/manager") ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/developer")
    )) {
        return NextResponse.redirect(new URL("/auth/login", request.url)); // /login emas, /auth/login
    }

    // Role tekshirish
    if (pathname.startsWith("/manager") && role !== "manager" && role !== "developer") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/admin") && role !== "admin" && role !== "developer") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/login",           // <-- /login ni ham matcherga qo'shdik
        "/auth/login",      // <-- /auth/login ni ham qo'shdik
        "/about",
        "/contact",
        "/manager/:path*",
        "/admin/:path*",
        "/developer/:path*",
    ],
};