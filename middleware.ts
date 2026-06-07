import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Cookie caches the allowlist check for 15 minutes — avoids a DB roundtrip on every admin request
const ADMIN_CACHE_COOKIE = "gmc_admin_ok";
const ADMIN_CACHE_TTL = 900; // seconds

async function fetchAdminRole(email: string): Promise<string | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/admin_users?select=role&email=eq.${encodeURIComponent(email)}&deleted_at=is.null`,
    {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
      cache: "no-store",
    }
  );
  const rows: { role: string }[] = await res.json();
  return rows[0]?.role ?? null;
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname.startsWith("/admin/login");
  const isDeniedPage = pathname.startsWith("/admin/denied");

  // 1. Unauthenticated hitting admin → login
  if (isAdminRoute && !isLoginPage && !isDeniedPage && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (user && isAdminRoute && !isLoginPage && !isDeniedPage) {
    const cached = request.cookies.get(ADMIN_CACHE_COOKIE)?.value;
    let allowed = cached === user.email;

    if (!allowed) {
      const role = await fetchAdminRole(user.email!);
      allowed = !!role;
      if (allowed) {
        supabaseResponse.cookies.set(ADMIN_CACHE_COOKIE, user.email!, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: ADMIN_CACHE_TTL,
          path: "/admin",
        });
      }
    }

    if (!allowed) {
      return NextResponse.redirect(new URL("/admin/denied", request.url));
    }
  }

  // 2. Authenticated + allowed user hitting login → redirect to dashboard
  if (isLoginPage && user) {
    const cached = request.cookies.get(ADMIN_CACHE_COOKIE)?.value;
    if (cached === user.email) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    const role = await fetchAdminRole(user.email!);
    if (role) {
      const res = NextResponse.redirect(new URL("/admin", request.url));
      res.cookies.set(ADMIN_CACHE_COOKIE, user.email!, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: ADMIN_CACHE_TTL,
        path: "/admin",
      });
      return res;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/auth/callback"],
};
