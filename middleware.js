import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import axios from "axios";

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/create(.*)', '/course(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect(); // Ensure user is logged in

    // If the user is trying to access `/create`, check their credits
    if (req.nextUrl.pathname.startsWith("/create")) {
      const userEmail = auth.user?.primaryEmailAddress?.emailAddress;
      
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/check-credits`, {
          params: { email: userEmail },
        });

        if (!res.data.hasCredits) {
          return NextResponse.redirect(new URL("/dashboard", req.url)); // Redirect if no credits
        }
      } catch (error) {
        return NextResponse.redirect(new URL("/dashboard", req.url)); // Redirect on error
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
