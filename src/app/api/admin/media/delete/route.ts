import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  ADMIN_MEDIA_BUCKET,
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
  const path = String(formData.get("path") ?? "");

  if (!isSafeStoragePath(path)) {
    return redirectWithMessage(request, {
      error: "That file path is not valid.",
    });
  }

  const [{ data: slotUsage, error: slotError }, { data: galleryUsage, error: galleryError }] =
    await Promise.all([
      supabase
        .from("site_media_slots")
        .select("slot_key")
        .eq("bucket_path", path)
        .limit(1),
      supabase
        .from("site_media_galleries")
        .select("page_key")
        .eq("bucket_path", path)
        .limit(1),
    ]);

  if (slotError || galleryError) {
    return redirectWithMessage(request, {
      error: slotError?.message || galleryError?.message || "Could not validate image usage.",
    });
  }

  if ((slotUsage?.length ?? 0) > 0 || (galleryUsage?.length ?? 0) > 0) {
    return redirectWithMessage(request, {
      error: "That image is still in use on the website. Reset it from the page editor first.",
    });
  }

  const { error } = await supabase.storage.from(ADMIN_MEDIA_BUCKET).remove([path]);

  if (error) {
    return redirectWithMessage(request, {
      error: error.message,
    });
  }

  revalidatePath("/admin/media");

  return redirectWithMessage(request, {
    status: "deleted",
  });
}
