import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  getAdminSession,
} from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSiteMediaSlotDefinition } from "@/lib/site-media-slots";

function redirectWithMessage(request: Request, params: Record<string, string>) {
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
      error: "Supabase admin client is not configured.",
    });
  }

  const formData = await request.formData();
  const slotKey = String(formData.get("slotKey") ?? "");
  const bucketPath = String(formData.get("bucketPath") ?? "").trim();
  const altText = String(formData.get("altText") ?? "").trim();
  const returnPageKey = String(formData.get("returnPageKey") ?? "").trim();

  const definition = getSiteMediaSlotDefinition(slotKey);

  if (!definition) {
    return redirectWithMessage(request, {
      error: "That site image slot does not exist.",
      ...(returnPageKey ? { page: returnPageKey } : {}),
    });
  }

  if (!bucketPath) {
    const { error } = await supabase.from("site_media_slots").delete().eq("slot_key", slotKey);

    if (error) {
      return redirectWithMessage(request, {
        error: error.message,
        ...(returnPageKey ? { page: returnPageKey } : {}),
      });
    }

    revalidatePath("/admin/media");
    if (definition.page.path) {
      revalidatePath(definition.page.path);
    }

    return redirectWithMessage(request, {
      status: "slot-reset",
      ...(returnPageKey ? { page: returnPageKey } : {}),
    });
  }

  const { error } = await supabase.from("site_media_slots").upsert(
    {
      slot_key: slotKey,
      bucket_path: bucketPath,
      alt_text: altText || definition.defaultAlt,
      updated_by_email: user.email ?? null,
    },
    {
      onConflict: "slot_key",
    },
  );

  if (error) {
    return redirectWithMessage(request, {
      error: error.message,
      ...(returnPageKey ? { page: returnPageKey } : {}),
    });
  }

  revalidatePath("/admin/media");
  if (definition.page.path) {
    revalidatePath(definition.page.path);
  } else {
    revalidatePath("/");
  }

  return redirectWithMessage(request, {
    status: "slot-saved",
    ...(returnPageKey ? { page: returnPageKey } : {}),
  });
}
