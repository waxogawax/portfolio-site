import { clerkMiddleware } from '@clerk/astro/server';

export const onRequest = clerkMiddleware(async (_auth, _context, next) => {
  const response = await next();
  // Diary detail / login / logout pages depend on per-request auth state.
  // Prevent browser back-forward cache, intermediary caches, and Vercel's
  // CDN from ever serving a stale (or wrong-user) copy of these pages.
  response.headers.set('Cache-Control', 'no-store');
  return response;
});
