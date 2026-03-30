import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  ADMIN_MEDIA_BUCKET,
  MAX_MEDIA_UPLOAD_BYTES,
  MEDIA_ACCEPT,
  getAdminSession,
  isSafeStoragePath,
} from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function redirectWithMessage(
  request: Request,
  params: Record<string, string>,
) {
  const url = new URL("/admin/media", request.url);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return NextResponse.redirect(url, 303);
}

function sanitizeName(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function resolveExtension(file: File) {
  const extFromName = file.name.split(".").pop()?.toLowerCase();
  if (extFromName && /^[a-z0-9]+$/.test(extFromName)) {
    return extFromName;
  }

  switch (file.type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/svg+xml":
      return "svg";
    case "image/avif":
      return "avif";
    default:
      return "bin";
  }
}

export async function POST(request: Request) {
  const { user, isAdmin } = await getAdminSession();

  if (!user || !isAdmin) {
    return NextResponse.redirect(new URL("/admin/login?error=unauthorized", request.url), 303);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return redirectWithMessage(request, {
      error: "Supabase storage is not configured yet.",
    });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const fileNameHint = String(formData.get("name") ?? "");
  const returnPageKey = String(formData.get("returnPageKey") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) {
    return redirectWithMessage(request, {
      error: "Choose an image before uploading.",
      ...(returnPageKey ? { page: returnPageKey } : {}),
    });
  }

  if (file.size > MAX_MEDIA_UPLOAD_BYTES) {
    return redirectWithMessage(request, {
      error: `That image is too large. Max size is ${Math.floor(
        MAX_MEDIA_UPLOAD_BYTES / (1024 * 1024),
      )}MB.`,
      ...(returnPageKey ? { page: returnPageKey } : {}),
    });
  }

  if (!MEDIA_ACCEPT.includes(file.type)) {
    return redirectWithMessage(request, {
      error: "That file type is not allowed for the media bucket.",
      ...(returnPageKey ? { page: returnPageKey } : {}),
    });
  }

  const ext = resolveExtension(file);
  const baseName = sanitizeName(fileNameHint || file.name) || "upload";
  const path = `${Date.now()}-${randomUUID().slice(0, 8)}-${baseName}.${ext}`;

  if (!isSafeStoragePath(path)) {
    return redirectWithMessage(request, {
      error: "We could not create a safe filename for that upload.",
      ...(returnPageKey ? { page: returnPageKey } : {}),
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(ADMIN_MEDIA_BUCKET).upload(path, buffer, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) {
    return redirectWithMessage(request, {
      error: error.message,
      ...(returnPageKey ? { page: returnPageKey } : {}),
    });
  }

  revalidatePath("/admin/media");

  return redirectWithMessage(request, {
    status: "uploaded",
    ...(returnPageKey ? { page: returnPageKey } : {}),
  });
}
