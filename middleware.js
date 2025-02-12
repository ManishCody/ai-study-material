import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/create(.*)', '/course(.*)']);

export default clerkMiddleware((auth, req) => {
  console.log('Middleware triggered for:', req.nextUrl.pathname); // Debugging

  if (isProtectedRoute(req)) {
    
  }

  return NextResponse.next(); // Continue request handling
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
