import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { allowAdminOnly, rolesAllowed } from "@/utils/permissions";
export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === undefined) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined");
  } else if (process.env.NEXT_PUBLIC_SUPABASE_URL === undefined) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const allowedPages = ["/", "/manifest.json"];
  const adminOnlyPages = allowAdminOnly;

  // Allow access to public assets without authentication
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/static") ||
    request.nextUrl.pathname.startsWith("/images") ||
    request.nextUrl.pathname.endsWith(".png") ||
    request.nextUrl.pathname.endsWith(".svg") ||
    request.nextUrl.pathname.endsWith(".ico") ||
    request.nextUrl.pathname.endsWith(".sw.js")
  ) {
    return supabaseResponse;
  }

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !allowedPages.includes(request.nextUrl.pathname)
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // **Check if the user is an admin before allowing access to "/users" page**
  if (user && adminOnlyPages.includes(request.nextUrl.pathname)) {
    const { data: adminProfile, error } = await supabase
      .from("profiles")
      .select("role, role:roles(role)")
      .eq("id", user.id)
      .single();

    if (
      error ||
      !adminProfile ||
      !rolesAllowed.includes(adminProfile.role.role)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/unauthorized"; // Redirect to a custom unauthorized page
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
