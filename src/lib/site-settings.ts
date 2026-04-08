import { getSupabaseAdmin } from "./supabase/admin";

export type SiteSettings = {
  theme_primary_color?: string;
  theme_background_color?: string;
  theme_glass_bg?: string;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");

  if (error || !data) return {};

  const settings: Record<string, string> = {};
  data.forEach((row) => {
    // The value was stored as a JSON string (e.g. '"#d4145a"')
    try {
      settings[row.key] = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
    } catch {
      settings[row.key] = row.value as string;
    }
  });

  return settings;
}
