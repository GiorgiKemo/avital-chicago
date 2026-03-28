import Image from "next/image";
import Link from "next/link";
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

function formatBytes(bytes?: number) {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function toAnchorId(value: string) {
  return value.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase();
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

  const slotAssignments = new Map(
    (slotRows ?? []).map((row) => [
      row.slot_key,
      {
        bucketPath: row.bucket_path,
        altText: row.alt_text,
        updatedAt: row.updated_at,
        publicUrl: row.bucket_path
          ? supabase.storage.from(ADMIN_MEDIA_BUCKET).getPublicUrl(row.bucket_path).data
              .publicUrl
          : null,
      },
    ]),
  );

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

  const feedback = getStatusMessage(params.status, params.error || error?.message);

  return (
    <section className="py-16">
      <div className="container mx-auto space-y-8 px-6">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/8 bg-white/[0.03] p-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="pink-label">Admin Media</p>
            <h1 className="section-heading text-4xl md:text-5xl">
              Upload images and manage them by page.
            </h1>
            <p className="max-w-3xl text-muted-foreground">
              New uploads go to the public Supabase <code>{ADMIN_MEDIA_BUCKET}</code>{" "}
              bucket. Then you assign them to actual routes like{" "}
              <code>/services/wedding</code> or{" "}
              <code>/chicago-limo-rental/cadillac-escalade</code>.
            </p>
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="text-foreground">{user.email}</span>
            </p>
          </div>

          <form action="/api/admin/logout" method="post">
            <button type="submit" className="btn-outline">
              Sign Out
            </button>
          </form>
        </div>

        {feedback ? (
          <div
            className={`rounded-2xl border p-4 text-sm ${
              feedback.tone === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                : "border-amber-500/20 bg-amber-500/10 text-amber-100"
            }`}
          >
            {feedback.text}
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-card-glow rounded-[28px] p-6">
            <h2 className="mb-2 font-serif text-3xl text-foreground">
              Upload a new image
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Accepted formats: JPEG, PNG, WebP, GIF, SVG, AVIF. Max size:{" "}
              {formatBytes(MAX_MEDIA_UPLOAD_BYTES)}.
            </p>

            <form
              action="/api/admin/media/upload"
              method="post"
              encType="multipart/form-data"
              className="space-y-4"
            >
              <div className="space-y-2">
                <label
                  htmlFor="media-file"
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Image File
                </label>
                <input
                  id="media-file"
                  name="file"
                  type="file"
                  accept={MEDIA_ACCEPT.join(",")}
                  required
                  className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.14em] file:text-white"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="file-name"
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Optional filename hint
                </label>
                <input
                  id="file-name"
                  name="name"
                  type="text"
                  placeholder="cadillac-escalade-front-angle"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <button type="submit" className="btn-primary w-full justify-center">
                Upload Image
              </button>
            </form>
          </div>

          <div className="glass-card rounded-[28px] p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl text-foreground">Bucket files</h2>
                <p className="text-sm text-muted-foreground">
                  {files.length} file{files.length === 1 ? "" : "s"} currently in
                  storage.
                </p>
              </div>
              <Link href="/" className="btn-outline">
                Back To Site
              </Link>
            </div>

            {files.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/12 p-8 text-center text-sm text-muted-foreground">
                No uploaded images yet. Use the form to add your first admin-managed
                asset.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {files.map((file) => (
                  <article
                    key={file.name}
                    className="overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03]"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-black/30">
                      <Image
                        src={file.publicUrl}
                        alt={file.name}
                        width={640}
                        height={480}
                        className="h-full w-full object-cover"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="space-y-3 p-4">
                      <div>
                        <p className="truncate text-sm font-semibold text-foreground">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatBytes(file.size)}
                          {file.createdAt
                            ? ` • ${new Date(file.createdAt).toLocaleString()}`
                            : ""}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/8 bg-black/10 p-3 text-xs text-muted-foreground">
                        <p className="mb-1 font-semibold uppercase tracking-[0.16em] text-primary">
                          Public URL
                        </p>
                        <p className="break-all">{file.publicUrl}</p>
                      </div>

                      <div className="flex gap-3">
                        <a
                          href={file.publicUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-outline flex-1 justify-center px-4 py-3 text-[11px]"
                        >
                          Open
                        </a>
                        <form
                          action="/api/admin/media/delete"
                          method="post"
                          className="flex-1"
                        >
                          <input type="hidden" name="path" value={file.name} />
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-xl border border-rose-400/25 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-200 transition hover:bg-rose-500/10"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="glass-card rounded-[32px] p-6 md:p-8">
          <div className="mb-8">
            <p className="pink-label mb-3">Page Directory</p>
            <h2 className="font-serif text-3xl text-foreground md:text-4xl">
              Jump straight to the page you want to edit.
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
              Every image slot below is grouped by actual website page. Open the
              page section, assign an uploaded file, save it, and that route will
              start using the new image.
            </p>
          </div>

          <div className="space-y-8">
            {pageSections.map((section) => (
              <section key={section.sectionName} className="space-y-4">
                <div>
                  <h3 className="font-serif text-2xl text-foreground">
                    {section.sectionName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {section.pages.length} page
                    {section.pages.length === 1 ? "" : "s"} with editable images.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {section.pages.map((page) => (
                    <a
                      key={page.pageKey}
                      href={`#${toAnchorId(page.pageKey)}`}
                      className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                    >
                      {page.pageLabel}
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[32px] p-6 md:p-8">
          <div className="mb-8">
            <p className="pink-label mb-3">Website Image Slots</p>
            <h2 className="font-serif text-3xl text-foreground md:text-4xl">
              Assign uploaded media to the pages that use it.
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
              This is where uploads become live website images. Open any page
              below, pick the uploaded image you want for that route, save it, and
              reset if you ever want to go back to the built-in default.
            </p>
          </div>

          <div className="space-y-10">
            {pageSections.map((section) => (
              <section key={section.sectionName} className="space-y-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl text-foreground">
                      {section.sectionName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {section.pages.length} page
                      {section.pages.length === 1 ? "" : "s"} in this section.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {section.pages.map((page, index) => (
                    <details
                      key={page.pageKey}
                      id={toAnchorId(page.pageKey)}
                      className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 scroll-mt-28"
                      open={index === 0 && section.sectionName === "Homepage"}
                    >
                      <summary className="flex cursor-pointer list-none flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <h4 className="font-serif text-2xl text-foreground">
                              {page.pageLabel}
                            </h4>
                            <span className="rounded-full bg-white/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                              {page.slots.length} slot
                              {page.slots.length === 1 ? "" : "s"}
                            </span>
                          </div>
                          {page.pagePath ? (
                            <p className="text-xs text-muted-foreground">
                              <code>{page.pagePath}</code>
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              Used across multiple pages.
                            </p>
                          )}
                          {page.pageDescription ? (
                            <p className="max-w-3xl text-sm text-muted-foreground">
                              {page.pageDescription}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-3">
                          {page.pagePath ? (
                            <a
                              href={page.pagePath}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-outline"
                            >
                              Open Page
                            </a>
                          ) : null}
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                            Expand
                          </span>
                        </div>
                      </summary>

                      <div className="mt-6 grid gap-5 border-t border-white/8 pt-6 lg:grid-cols-2 2xl:grid-cols-3">
                        {page.slots.map((slot) => {
                          const assignment = slotAssignments.get(slot.key);
                          const previewSrc = assignment?.publicUrl || slot.defaultSrc;
                          const previewAlt = assignment?.altText || slot.defaultAlt;
                          const isOverridden = Boolean(assignment?.bucketPath);

                          return (
                            <article
                              key={slot.key}
                              className="overflow-hidden rounded-3xl border border-white/8 bg-black/10"
                            >
                              <div className="aspect-[16/10] overflow-hidden bg-black/30">
                                <Image
                                  src={previewSrc}
                                  alt={previewAlt}
                                  width={960}
                                  height={600}
                                  className="h-full w-full object-cover"
                                  sizes="(max-width: 1024px) 100vw, 33vw"
                                />
                              </div>

                              <div className="space-y-4 p-5">
                                <div>
                                  <div className="mb-2 flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-foreground">
                                      {slot.label}
                                    </p>
                                    <span
                                      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                                        isOverridden
                                          ? "bg-emerald-500/15 text-emerald-200"
                                          : "bg-white/8 text-muted-foreground"
                                      }`}
                                    >
                                      {isOverridden
                                        ? "Uploaded override"
                                        : "Default image"}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    <code>{slot.key}</code>
                                  </p>
                                  {slot.description ? (
                                    <p className="mt-2 text-sm text-muted-foreground">
                                      {slot.description}
                                    </p>
                                  ) : null}
                                </div>

                                <form
                                  action="/api/admin/site-media"
                                  method="post"
                                  className="space-y-4"
                                >
                                  <input type="hidden" name="slotKey" value={slot.key} />

                                  <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                      Use uploaded image
                                    </label>
                                    <select
                                      name="bucketPath"
                                      defaultValue={assignment?.bucketPath ?? ""}
                                      className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground outline-none focus:border-primary"
                                    >
                                      <option value="">Use built-in default</option>
                                      {files.map((file) => (
                                        <option key={`${slot.key}-${file.name}`} value={file.name}>
                                          {file.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                      Alt text
                                    </label>
                                    <input
                                      name="altText"
                                      type="text"
                                      defaultValue={assignment?.altText ?? slot.defaultAlt}
                                      className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground outline-none focus:border-primary"
                                    />
                                  </div>

                                  <div className="flex gap-3">
                                    <button
                                      type="submit"
                                      className="btn-primary flex-1 justify-center"
                                    >
                                      Save Slot
                                    </button>
                                    <button
                                      type="submit"
                                      name="bucketPath"
                                      value=""
                                      className="btn-outline flex-1 justify-center"
                                    >
                                      Reset
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
