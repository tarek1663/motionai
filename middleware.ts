import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const protectedRoutes = [
  "/dashboard",
  "/account",
  "/admin",
  "/onboarding",
  "/pricing/success",
] as const;

const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/pricing",
  "/pricing/cancel",
  "/privacy",
  "/terms",
  "/api/stripe/webhook",
] as const;

const isProtectedRoute = createRouteMatcher(protectedRoutes);
const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth().protect();
    return;
  }

  if (!isPublicRoute(req)) {
    // fallback: tout le reste non explicitement public reste protege.
    await auth().protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
