import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/builder")) {
    const res = NextResponse.next();

    const supabaseUrl =
      process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabasePublishableKey =
      process.env.SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      "";

    if (!supabaseUrl || !supabasePublishableKey) {
      const url = new URL("/signup", req.url);
      url.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = new URL("/signup", req.url);
      url.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/builder/:path*"],
};
