import AdminMediaWorkspace from "@/components/admin/AdminMediaWorkspace";
import {
  ADMIN_MEDIA_BUCKET,
  MAX_MEDIA_UPLOAD_BYTES,
  MEDIA_ACCEPT,
  requireAdminUser,
} from "@/lib/admin-auth";
import {
  siteMediaSlots,
  type SiteMediaSlotDefinition,
} from "@/lib/site-media-slots";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type AdminMediaPageProps = {
  searchParams: Promise<{
    error?: string;
    page?: string;
    status?: string;
  }>;
};

type PageSlotGroup = {
  section: string;
  pageKey: string;
  pageLabel: string;
  pagePath?: string;
  pageDescription?: string;
  slots: SiteMediaSlotDefinition[];
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getStatusMessage(status?: string, error?: string) {
  if (status === "uploaded") {
    return { tone: "success", text: "Image uploaded successfully." };
  }

  if (status === "deleted") {
    return { tone: "success", text: "Image removed successfully." };
  }

  if (status === "slot-saved") {
    return { tone: "success", text: "That website image slot has been updated." };
  }

  if (status === "slot-reset") {
    return { tone: "success", text: "That image slot is back on its built-in default." };
  }

  if (status === "gallery-saved") {
    return { tone: "success", text: "That page gallery has been updated." };
  }

  if (status === "gallery-reset") {
    return { tone: "success", text: "That page gallery is back on its built-in default." };
  }

  if (!error) {
    return null;
  }

  return {
    tone: "error",
    text: error,
  };
}

export default async function AdminMediaPage({
  searchParams,
}: AdminMediaPageProps) {
  const params = await searchParams;
  const user = await requireAdminUser("/admin/media");
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    throw new Error("Supabase admin client is not configured.");
  }

  const { data, error } = await supabase.storage.from(ADMIN_MEDIA_BUCKET).list("", {
    limit: 200,
    sortBy: { column: "created_at", order: "desc" },
  });

  const files =
    data
      ?.filter((item) => item.name && !item.name.endsWith("/"))
      .map((item) => ({
        name: item.name,
        publicUrl: supabase.storage.from(ADMIN_MEDIA_BUCKET).getPublicUrl(item.name)
          .data.publicUrl,
        size: typeof item.metadata?.size === "number" ? item.metadata.size : 0,
        createdAt: item.created_at,
      })) ?? [];

  const { data: slotRows } = await supabase
    .from("site_media_slots")
    .select("slot_key,bucket_path,alt_text,updated_at");

  const { data: galleryRows } = await supabase
    .from("site_media_galleries")
    .select("page_key,position,bucket_path,alt_text,updated_at")
    .order("position", { ascending: true });

  const sectionMap = new Map<string, Map<string, PageSlotGroup>>();

  for (const slot of siteMediaSlots) {
    if (!sectionMap.has(slot.section)) {
      sectionMap.set(slot.section, new Map());
    }

    const pageMap = sectionMap.get(slot.section)!;

    if (!pageMap.has(slot.page.key)) {
      pageMap.set(slot.page.key, {
        section: slot.section,
        pageKey: slot.page.key,
        pageLabel: slot.page.label,
        pagePath: slot.page.path,
        pageDescription: slot.page.description,
        slots: [],
      });
    }

    pageMap.get(slot.page.key)!.slots.push(slot);
  }

  const pageSections = Array.from(sectionMap.entries()).map(([sectionName, pages]) => ({
    sectionName,
    pages: Array.from(pages.values()),
  }));

  const slotAssignments = Object.fromEntries(
    (slotRows ?? []).map((row) => [
      row.slot_key,
      {
        bucketPath: row.bucket_path,
        altText: row.alt_text || "",
        updatedAt: row.updated_at,
        publicUrl: row.bucket_path
          ? supabase.storage.from(ADMIN_MEDIA_BUCKET).getPublicUrl(row.bucket_path).data
              .publicUrl
          : null,
      },
    ]),
  );

  const galleryAssignments: Record<
    string,
    {
      bucketPath: string;
      altText: string;
      updatedAt: string | null;
      publicUrl: string;
    }[]
  > = {};

  for (const row of galleryRows ?? []) {
    if (!galleryAssignments[row.page_key]) {
      galleryAssignments[row.page_key] = [];
    }

    galleryAssignments[row.page_key].push({
      bucketPath: row.bucket_path,
      altText: row.alt_text || "",
      updatedAt: row.updated_at,
      publicUrl: supabase.storage.from(ADMIN_MEDIA_BUCKET).getPublicUrl(row.bucket_path).data
        .publicUrl,
    });
  }

  const initialSelectedPageKey =
    params.page && pageSections.some((section) => section.pages.some((page) => page.pageKey === params.page))
      ? params.page
      : pageSections.flatMap((section) => section.pages)[0]?.pageKey || "";

  return (
    <AdminMediaWorkspace
      userEmail={user.email || ""}
      feedback={getStatusMessage(params.status, params.error || error?.message)}
      bucketName={ADMIN_MEDIA_BUCKET}
      acceptedFormatsText={MEDIA_ACCEPT.join(", ")}
      maxUploadSizeText={formatBytes(MAX_MEDIA_UPLOAD_BYTES)}
      files={files}
      pageSections={pageSections}
      slotAssignments={slotAssignments}
      galleryAssignments={galleryAssignments}
      initialSelectedPageKey={initialSelectedPageKey}
    />
  );
}
