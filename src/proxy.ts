import createMiddleware from "next-intl/middleware";
import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const intlMiddleware = createMiddleware({
  locales: ["en", "es"],
  defaultLocale: "es",
});

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathWithoutLocale = pathname.replace(/^\/(en|es)/, "") || "/";
  const isPublicPath =
    pathWithoutLocale === "/login" || pathWithoutLocale === "/register";

  const intlResponse = intlMiddleware(request);

  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse;
  }

  if (isPublicPath) {
    return intlResponse;
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              intlResponse.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const locale = pathname.split("/")[1] || "es";
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    return intlResponse;
  } catch {
    const locale = pathname.split("/")[1] || "es";
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
