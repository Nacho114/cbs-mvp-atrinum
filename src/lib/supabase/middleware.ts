import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// From The official docs:
// https://supabase.com/docs/guides/auth/server-side/nextjs

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ----- Custom changes ---------

  // NOTES:
  // 1. Be careful not to add ANY api routes
  // under any route that gets re-directed,
  // the middleware will cause these api to silently
  // be ignored

  const pathName = request.nextUrl.pathname

  const isLoginRoute = pathName.startsWith('/login')
  const isAuthRoute = pathName.startsWith('/auth')
  const isAuthOrLoginRoute = isLoginRoute || isAuthRoute

  const isDashboardRoute = pathName.startsWith('/dashboard')
  const isAdminRoute = pathName.startsWith('/admin')
  const isResetRoute = pathName.startsWith('/reset')
  const isCreateProfileRoute = pathName.startsWith('/create-profile')
  const isProtectedRoute =
    isDashboardRoute || isResetRoute || isCreateProfileRoute

  // TODO: admin login route?

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login/admin'
    return NextResponse.redirect(url)
  }

  if (isAuthOrLoginRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // ----- Custom changes END ---------

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

  return supabaseResponse
}
