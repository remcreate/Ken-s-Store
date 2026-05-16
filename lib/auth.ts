export const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@example.com";

export function isAdminEmail(email?: string | null) {
  return email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
