import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
])

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/',
  '/onboarding(.*)',
  '/learn(.*)',
  '/api/users(.*)',
  '/api/progress(.*)',
  '/api/creations(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // If the route is public, allow access without authentication
  if (isPublicRoute(req)) return

  // If the route is protected or if no specific matcher applies, require authentication
  if (isProtectedRoute(req) || !isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}