/** Email admin (page /admin) — définir dans Vercel : NEXT_PUBLIC_ADMIN_EMAIL */
export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";

/** Clerk user ID admin (API /api/admin/stats) — définir : ADMIN_USER_ID */
export const ADMIN_USER_ID = process.env.ADMIN_USER_ID ?? "";

export function isAdminUserId(userId: string | null | undefined): boolean {
  return Boolean(ADMIN_USER_ID && userId === ADMIN_USER_ID);
}

export function isAdminEmail(email: string | undefined): boolean {
  return Boolean(ADMIN_EMAIL && email === ADMIN_EMAIL);
}
