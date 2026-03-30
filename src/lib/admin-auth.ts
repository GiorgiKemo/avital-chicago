import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";

export const ADMIN_MEDIA_BUCKET = "media";
export const MAX_MEDIA_UPLOAD_BYTES = 15 * 1024 * 1024;
export const MEDIA_ACCEPT = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
];

export function isAdminBypassEnabled() {
  return (
    (process.env.ADMIN_BYPASS_AUTH ?? "").trim().toLowerCase() === "true"
  );
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getAllowedAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);
}

export function isAdminConfigured() {
  if (isAdminBypassEnabled()) {
    return true;
  }

  return getAllowedAdminEmails().length > 0;
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return getAllowedAdminEmails().includes(normalizeEmail(email));
}

export function getAdminDisabledReason() {
  if (isAdminBypassEnabled()) {
    return null;
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return "Supabase auth is not configured yet.";
  }

  if (!isAdminConfigured()) {
    return "Add ADMIN_EMAILS to enable admin access.";
  }

  return null;
}

export function getSafeNextPath(next?: string | null) {
  if (!next || !next.startsWith("/")) {
    return "/admin/media";
  }

  return next;
}

export function isSafeStoragePath(path: string) {
  return (
    Boolean(path) &&
    !path.startsWith("/") &&
    !path.includes("..") &&
    /^[a-zA-Z0-9/_\-.]+$/.test(path)
  );
}

export async function getAdminSession() {
  if (isAdminBypassEnabled()) {
    const email = getAllowedAdminEmails()[0] ?? "admin@local";

    return {
      supabase: null,
      user: { email } as { email: string },
      isAdmin: true,
    };
  }

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.auth.getUser();
  const user = error ? null : data.user;

  return {
    supabase,
    user,
    isAdmin: isAdminEmail(user?.email),
  };
}

export async function requireAdminUser(next = "/admin/media") {
  if (isAdminBypassEnabled()) {
    return { email: getAllowedAdminEmails()[0] ?? "admin@local" } as {
      email: string;
    };
  }

  const { user, isAdmin } = await getAdminSession();

  if (!user) {
    redirect(`/admin/login?next=${encodeURIComponent(next)}`);
  }

  if (!isAdmin) {
    redirect("/admin/login?error=unauthorized");
  }

  return user;
}
