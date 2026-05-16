const adminEmails =
  process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
  "admin@example.com";

export const ADMIN_EMAILS = adminEmails
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const ADMIN_EMAIL = ADMIN_EMAILS[0] || "admin@example.com";

export function isAdminEmail(email?: string | null) {
  return email
    ? ADMIN_EMAILS.includes(email.toLowerCase())
    : false;
}