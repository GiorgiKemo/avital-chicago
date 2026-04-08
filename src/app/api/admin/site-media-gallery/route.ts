import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  getAdminSession,
  isSafeStoragePath,
} from "@/lib/admin-auth";
import { getSiteMediaPageDefinition } from "@/lib/site-media-slots";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function redirectWithMessage(request: Request, params: Record<string, string>) {
  const url = new URL("/admin/media", request.url);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const { user, isAdmin } = await getAdminSession();

  if (!user || !isAdmin) {
    return NextResponse.redirect(
      new URL("/admin/login?error=unauthorized", request.url),
      303,
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return redirectWithMessage(request, {
      error: "Supabase admin client is not configured.",
    });
  }

  const formData = await request.formData();
  const pageKey = String(formData.get("pageKey") ?? "").trim();
  const action = String(formData.get("action") ?? "save").trim();
  const returnPageKey = String(formData.get("returnPageKey") ?? "").trim();

  const pageDefinition = getSiteMediaPageDefinition(pageKey);

  if (!pageDefinition?.supportsGallery) {
    return redirectWithMessage(request, {
      error: "That page does not support admin gallery management.",
      ...(returnPageKey ? { page: returnPageKey } : {}),
    });
  }

  const { error: deleteError } = await supabase
    .from("site_media_galleries")
    .delete()
    .eq("page_key", pageKey);

  if (deleteError) {
    return redirectWithMessage(request, {
      error: deleteError.message,
      ...(returnPageKey ? { page: returnPageKey } : {}),
    });
  }

  if (action !== "reset") {
    const bucketPaths = formData
      .getAll("galleryPath")
      .map((value) => String(value ?? "").trim());
    const altTexts = formData
      .getAll("galleryAlt")
      .map((value) => String(value ?? "").trim());
    const objectFits = formData
      .getAll("galleryObjectFit")
      .map((value) => String(value ?? "cover").trim());

    const items = bucketPaths
      .map((bucketPath, index) => ({
        bucketPath,
        altText: altTexts[index] ?? "",
        objectFit: objectFits[index] ?? "cover",
      }))
      .filter((item) => item.bucketPath);

      if (items.some((item) => !isSafeStoragePath(item.bucketPath))) {
        return redirectWithMessage(request, {
          error: "One of the selected gallery files is not a valid storage path.",
          ...(returnPageKey ? { page: returnPageKey } : {}),
        });
      }

    if (items.length > 0) {
      const { error: insertError } = await supabase.from("site_media_galleries").insert(
        items.map((item, index) => ({
          page_key: pageKey,
          position: index,
          bucket_path: item.bucketPath,
          alt_text:
            item.altText || `${pageDefinition.label} gallery image ${index + 1}`,
          object_fit: item.objectFit,
          updated_by_email: user.email ?? null,
        })),
      );

        if (insertError) {
          return redirectWithMessage(request, {
            error: insertError.message,
            ...(returnPageKey ? { page: returnPageKey } : {}),
          });
        }
      }
  }

  revalidatePath("/admin/media");
  if (pageDefinition.path) {
    revalidatePath(pageDefinition.path);
  }

  return redirectWithMessage(request, {
    status: action === "reset" ? "gallery-reset" : "gallery-saved",
    ...(returnPageKey ? { page: returnPageKey } : {}),
  });
}
