import { NextResponse } from "next/server";
import {
  getSiteMediaPageDefinition,
  type SiteMediaGalleryAssignment,
} from "@/lib/site-media-slots";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabase = getSupabaseAdmin();
  const url = new URL(request.url);
  const pageKey = url.searchParams.get("pageKey")?.trim() ?? "";

  if (!supabase || !pageKey) {
    return NextResponse.json({ pageKey, items: [] as SiteMediaGalleryAssignment[] });
  }

  const pageDefinition = getSiteMediaPageDefinition(pageKey);

  if (!pageDefinition?.supportsGallery) {
    return NextResponse.json({ pageKey, items: [] as SiteMediaGalleryAssignment[] });
  }

  const { data, error } = await supabase
    .from("site_media_galleries")
    .select("page_key,position,bucket_path,alt_text,updated_at")
    .eq("page_key", pageKey)
    .order("position", { ascending: true });

  if (error || !data) {
    return NextResponse.json({ pageKey, items: [] as SiteMediaGalleryAssignment[] });
  }

  const items: SiteMediaGalleryAssignment[] = data.map((row) => ({
    pageKey: row.page_key,
    position: row.position,
    bucketPath: row.bucket_path,
    src: supabase.storage.from("media").getPublicUrl(row.bucket_path).data.publicUrl,
    alt: row.alt_text || `${pageDefinition.label} gallery image ${row.position + 1}`,
    updatedAt: row.updated_at,
  }));

  return NextResponse.json({ pageKey, items });
}
