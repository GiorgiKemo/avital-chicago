"use server";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateThemeSettings(formData: FormData) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase admin not found");

  const primaryColor = formData.get("theme_primary_color")?.toString() || "#d4145a";
  const backgroundColor = formData.get("theme_background_color")?.toString() || "#08080a";
  const glassBg = formData.get("theme_glass_bg")?.toString() || "rgba(20, 20, 24, 0.6)";

  const updates = [
    { key: "theme_primary_color", value: JSON.stringify(primaryColor) },
    { key: "theme_background_color", value: JSON.stringify(backgroundColor) },
    { key: "theme_glass_bg", value: JSON.stringify(glassBg) },
  ];

  for (const item of updates) {
    await supabase.from("site_settings").upsert(
      { key: item.key, value: item.value, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
  }

  // Force Next.js to purge the entire site cache so colors update instantly everywhere
  revalidatePath("/", "layout");
}
