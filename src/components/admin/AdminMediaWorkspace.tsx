"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Images,
  LayoutTemplate,
  Search,
  Upload,
  WandSparkles,
} from "lucide-react";
import type { SiteMediaSlotDefinition } from "@/lib/site-media-slots";
import AdminGalleryManager from "@/components/admin/AdminGalleryManager";
import AdminPreviewImage from "@/components/admin/AdminPreviewImage";

type UploadedFile = {
  name: string;
  publicUrl: string;
  size: number;
  createdAt?: string | null;
};

type SlotAssignmentPreview = {
  bucketPath: string | null;
  altText: string;
  updatedAt: string | null;
  publicUrl: string | null;
};

type GalleryAssignmentPreview = {
  bucketPath: string;
  altText: string;
  updatedAt: string | null;
  publicUrl: string;
};

type PageSlotGroup = {
  section: string;
  pageKey: string;
  pageLabel: string;
  pagePath?: string;
  pageDescription?: string;
  slots: SiteMediaSlotDefinition[];
};

type Feedback = {
  tone: string;
  text: string;
} | null;

type AdminMediaWorkspaceProps = {
  userEmail: string;
  feedback: Feedback;
  bucketName: string;
  acceptedFormatsText: string;
  maxUploadSizeText: string;
  files: UploadedFile[];
  pageSections: {
    sectionName: string;
    pages: PageSlotGroup[];
  }[];
  slotAssignments: Record<string, SlotAssignmentPreview>;
  galleryAssignments: Record<string, GalleryAssignmentPreview[]>;
  initialSelectedPageKey: string;
};

function formatBytes(bytes?: number) {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleString();
}

export default function AdminMediaWorkspace({
  userEmail,
  feedback,
  bucketName,
  acceptedFormatsText,
  maxUploadSizeText,
  files,
  pageSections,
  slotAssignments,
  galleryAssignments,
  initialSelectedPageKey,
}: AdminMediaWorkspaceProps) {
  const [selectedPageKey, setSelectedPageKey] = useState(initialSelectedPageKey);
  const [pageQuery, setPageQuery] = useState("");
  const [libraryQuery, setLibraryQuery] = useState("");
  const [selectedUploadName, setSelectedUploadName] = useState("");

  const allPages = useMemo(
    () => pageSections.flatMap((section) => section.pages),
    [pageSections],
  );

  const selectedPage =
    allPages.find((page) => page.pageKey === selectedPageKey) ?? allPages[0] ?? null;

  const filteredSections = useMemo(() => {
    const query = pageQuery.trim().toLowerCase();

    if (!query) return pageSections;

    return pageSections
      .map((section) => ({
        ...section,
        pages: section.pages.filter((page) => {
          const haystack = [
            section.sectionName,
            page.pageLabel,
            page.pagePath || "",
            page.pageDescription || "",
          ]
            .join(" ")
            .toLowerCase();
          return haystack.includes(query);
        }),
      }))
      .filter((section) => section.pages.length > 0);
  }, [pageQuery, pageSections]);

  const filteredFiles = useMemo(() => {
    const query = libraryQuery.trim().toLowerCase();
    if (!query) return files;
    return files.filter((file) => file.name.toLowerCase().includes(query));
  }, [files, libraryQuery]);

  const slotCount = allPages.reduce((sum, page) => sum + page.slots.length, 0);
  const overriddenSlotCount = Object.values(slotAssignments).filter(
    (assignment) => assignment.bucketPath,
  ).length;

  return (
    <section className="py-12">
      <div className="container mx-auto space-y-8 px-6">
        <div className="rounded-[32px] border border-white/8 bg-[linear-gradient(135deg,rgba(212,20,90,0.14),rgba(255,255,255,0.03))] p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-3">
              <p className="pink-label">Admin Media Studio</p>
              <h1 className="section-heading max-w-4xl text-4xl md:text-5xl">
                Manage real pages, not random image buckets.
              </h1>
              <p className="max-w-3xl text-muted-foreground">
                Pick a page, update its hero and gallery images, and see exactly
                what part of the site you are editing. Your uploads live in{" "}
                <code>{bucketName}</code> and can be assigned anywhere from this
                dashboard.
              </p>
              <p className="text-sm text-muted-foreground">
                Signed in as <span className="text-foreground">{userEmail}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#upload-studio" className="btn-primary">
                <Upload className="h-4 w-4" />
                Upload Images
              </a>
              {selectedPage?.pagePath ? (
                <a
                  href={selectedPage.pagePath}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline"
                >
                  Open Selected Page
                </a>
              ) : null}
              <form action="/api/admin/logout" method="post">
                <button type="submit" className="btn-outline">
                  Sign Out
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="glass-card rounded-3xl p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Editable Pages
              </p>
              <p className="mt-3 font-serif text-4xl text-foreground">
                {allPages.length}
              </p>
            </div>
            <div className="glass-card rounded-3xl p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Image Slots
              </p>
              <p className="mt-3 font-serif text-4xl text-foreground">{slotCount}</p>
            </div>
            <div className="glass-card rounded-3xl p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Custom Overrides
              </p>
              <p className="mt-3 font-serif text-4xl text-foreground">
                {overriddenSlotCount}
              </p>
            </div>
          </div>
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

        <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
          <aside className="space-y-6">
            <div className="glass-card rounded-[28px] p-5">
              <div className="mb-4 flex items-center gap-3">
                <LayoutTemplate className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-2xl text-foreground">Pages</h2>
              </div>
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={pageQuery}
                  onChange={(event) => setPageQuery(event.target.value)}
                  placeholder="Search pages or routes"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-foreground outline-none focus:border-primary"
                />
              </label>

              <div className="mt-5 space-y-5">
                {filteredSections.map((section) => (
                  <div key={section.sectionName} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {section.sectionName}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {section.pages.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {section.pages.map((page) => (
                        <button
                          key={page.pageKey}
                          type="button"
                          onClick={() => setSelectedPageKey(page.pageKey)}
                          className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                            page.pageKey === selectedPage?.pageKey
                              ? "border-primary/40 bg-primary/10 text-foreground"
                              : "border-white/8 bg-white/[0.02] text-muted-foreground hover:border-white/16 hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium">{page.pageLabel}</p>
                              {page.pagePath ? (
                                <p className="mt-1 text-xs opacity-75">
                                  <code>{page.pagePath}</code>
                                </p>
                              ) : null}
                            </div>
                            <span className="rounded-full bg-black/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]">
                              {page.slots.length}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            {selectedPage ? (
              <>
                <div className="glass-card rounded-[28px] p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <p className="pink-label">{selectedPage.section}</p>
                      <h2 className="font-serif text-4xl text-foreground">
                        {selectedPage.pageLabel}
                      </h2>
                      {selectedPage.pagePath ? (
                        <p className="text-sm text-muted-foreground">
                          <code>{selectedPage.pagePath}</code>
                        </p>
                      ) : null}
                      {selectedPage.pageDescription ? (
                        <p className="max-w-3xl text-sm text-muted-foreground">
                          {selectedPage.pageDescription}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {selectedPage.pagePath ? (
                        <a
                          href={selectedPage.pagePath}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-outline"
                        >
                          Open Page
                        </a>
                      ) : (
                        <Link href="/" className="btn-outline">
                          Back To Site
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {selectedPage.slots.map((slot) => {
                    const assignment = slotAssignments[slot.key];
                    const previewSrc = assignment?.publicUrl || slot.defaultSrc;
                    const previewAlt = assignment?.altText || slot.defaultAlt;
                    const isOverridden = Boolean(assignment?.bucketPath);

                    return (
                      <article
                        key={slot.key}
                        className="overflow-hidden rounded-[28px] border border-white/8 bg-white/[0.03]"
                      >
                        <div className="grid gap-0 lg:grid-cols-[340px_minmax(0,1fr)]">
                          <div className="border-b border-white/8 bg-black/20 lg:border-b-0 lg:border-r">
                            <div className="aspect-[5/4] overflow-hidden">
                              <AdminPreviewImage
                                src={previewSrc}
                                alt={previewAlt}
                                className="h-full w-full object-cover"
                                fallbackLabel="Image preview unavailable"
                              />
                            </div>
                          </div>

                          <div className="p-6">
                            <div className="mb-5 flex flex-wrap items-center gap-3">
                              <h3 className="font-serif text-2xl text-foreground">
                                {slot.label}
                              </h3>
                              <span
                                className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                                  isOverridden
                                    ? "bg-emerald-500/15 text-emerald-200"
                                    : "bg-white/8 text-muted-foreground"
                                }`}
                              >
                                {isOverridden ? "Custom image" : "Default image"}
                              </span>
                            </div>

                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground">
                                <code>{slot.key}</code>
                              </p>
                              {slot.description ? (
                                <p className="max-w-3xl text-sm text-muted-foreground">
                                  {slot.description}
                                </p>
                              ) : null}
                            </div>

                            <form
                              action="/api/admin/site-media"
                              method="post"
                              className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
                            >
                              <input type="hidden" name="slotKey" value={slot.key} />
                              <input
                                type="hidden"
                                name="returnPageKey"
                                value={selectedPage.pageKey}
                              />

                              <div className="space-y-2 xl:col-span-2">
                                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                  Uploaded image
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

                              <div className="space-y-2 xl:col-span-2">
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

                              <button type="submit" className="btn-primary justify-center">
                                Save Image
                              </button>
                              <button
                                type="submit"
                                name="bucketPath"
                                value=""
                                className="btn-outline justify-center"
                              >
                                Reset To Default
                              </button>
                            </form>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {selectedPage.slots[0]?.page.supportsGallery ? (
                  <AdminGalleryManager
                    pageKey={selectedPage.pageKey}
                    pageLabel={selectedPage.pageLabel}
                    pagePath={selectedPage.pagePath}
                    description={selectedPage.slots[0].page.galleryDescription}
                    defaultGalleryCount={selectedPage.slots[0].page.defaultGalleryCount}
                    initialItems={galleryAssignments[selectedPage.pageKey] ?? []}
                    files={files.map((file) => ({
                      name: file.name,
                      publicUrl: file.publicUrl,
                    }))}
                    returnPageKey={selectedPage.pageKey}
                  />
                ) : null}
              </>
            ) : (
              <div className="glass-card rounded-[28px] p-10 text-center text-muted-foreground">
                Choose a page from the left sidebar to start editing.
              </div>
            )}
          </main>

          <aside className="space-y-6" id="upload-studio">
            <div className="glass-card-glow sticky top-28 rounded-[28px] p-6">
              <div className="mb-4 flex items-center gap-3">
                <Upload className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-2xl text-foreground">Upload Studio</h2>
              </div>
              <p className="mb-5 text-sm text-muted-foreground">
                Add a new file here, then assign it to the selected page.
              </p>

              <form
                action="/api/admin/media/upload"
                method="post"
                encType="multipart/form-data"
                className="space-y-4"
              >
                <input
                  type="hidden"
                  name="returnPageKey"
                  value={selectedPage?.pageKey ?? ""}
                />

                <label className="block rounded-3xl border border-dashed border-primary/35 bg-primary/[0.05] p-6 text-center transition hover:border-primary/55 hover:bg-primary/[0.08]">
                  <input
                    name="file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
                    required
                    className="sr-only"
                    onChange={(event) =>
                      setSelectedUploadName(event.target.files?.[0]?.name ?? "")
                    }
                  />
                  <WandSparkles className="mx-auto mb-3 h-8 w-8 text-primary" />
                  <p className="text-base font-semibold text-foreground">
                    Choose image to upload
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {acceptedFormatsText}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Max size: {maxUploadSizeText}
                  </p>
                </label>

                <div className="rounded-2xl border border-white/8 bg-black/15 px-4 py-3 text-sm text-muted-foreground">
                  {selectedUploadName ? (
                    <>
                      Selected file:{" "}
                      <span className="font-medium text-foreground">
                        {selectedUploadName}
                      </span>
                    </>
                  ) : (
                    "No file selected yet. Click the upload card above to choose an image."
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Optional filename hint
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="escape-side-angle"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                <button type="submit" className="btn-primary w-full justify-center">
                  <Upload className="h-4 w-4" />
                  Upload Image
                </button>
              </form>
            </div>

            <div className="glass-card rounded-[28px] p-6">
              <div className="mb-4 flex items-center gap-3">
                <Images className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-2xl text-foreground">Media Library</h2>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                {filteredFiles.length} uploaded file
                {filteredFiles.length === 1 ? "" : "s"} ready to assign.
              </p>

              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={libraryQuery}
                  onChange={(event) => setLibraryQuery(event.target.value)}
                  placeholder="Search uploaded files"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-foreground outline-none focus:border-primary"
                />
              </label>

              <div className="mt-5 space-y-3">
                {filteredFiles.slice(0, 24).map((file) => (
                  <div
                    key={file.name}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] p-3"
                  >
                    <div className="flex gap-3">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-black/20">
                        <AdminPreviewImage
                          src={file.publicUrl}
                          alt={file.name}
                          className="h-full w-full object-cover"
                          fallbackLabel="Missing"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {file.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatBytes(file.size)}
                          {file.createdAt ? ` • ${formatDate(file.createdAt)}` : ""}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <a
                            href={file.publicUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-outline px-3 py-2 text-[11px]"
                          >
                            Open
                          </a>
                          <form action="/api/admin/media/delete" method="post">
                            <input type="hidden" name="path" value={file.name} />
                            <input
                              type="hidden"
                              name="returnPageKey"
                              value={selectedPage?.pageKey ?? ""}
                            />
                            <button
                              type="submit"
                              className="inline-flex items-center justify-center rounded-xl border border-rose-400/25 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-200 transition hover:bg-rose-500/10"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredFiles.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/12 p-5 text-sm text-muted-foreground">
                    No uploaded files match this search yet.
                  </div>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
