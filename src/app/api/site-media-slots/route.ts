import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  getSiteMediaSlotDefinition,
  siteMediaSlots,
  type SiteMediaSlotAssignment,
} from "@/lib/site-media-slots";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const slots: Record<string, SiteMediaSlotAssignment> = {};

  if (!supabase) {
    return NextResponse.json({ slots });
  }

  const { data, error } = await supabase
    .from("site_media_slots")
    .select("slot_key,bucket_path,alt_text,updated_at");

  if (error || !data) {
    return NextResponse.json({ slots });
  }

  data.forEach((row) => {
    const definition = getSiteMediaSlotDefinition(row.slot_key);
    if (!definition || !row.bucket_path) {
      return;
    }

    const publicUrl = supabase.storage.from("media").getPublicUrl(row.bucket_path).data
      .publicUrl;

    slots[row.slot_key] = {
      slotKey: row.slot_key,
      src: publicUrl,
      alt: row.alt_text || definition.defaultAlt,
      bucketPath: row.bucket_path,
      updatedAt: row.updated_at,
    };
  });

  siteMediaSlots.forEach((definition) => {
    if (!slots[definition.key]) {
      slots[definition.key] = {
        slotKey: definition.key,
        src: definition.defaultSrc,
        alt: definition.defaultAlt,
        bucketPath: null,
        updatedAt: null,
      };
    }
  });

  return NextResponse.json({ slots });
}
