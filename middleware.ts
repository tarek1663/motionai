import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/** Routes accessibles sans redirection sign-in (Clerk tourne quand même → auth() OK avec cookie). */
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/render(.*)",
  "/api/stripe/webhook",
  "/pricing(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth().protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
