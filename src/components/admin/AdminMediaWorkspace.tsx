"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  ExternalLink,
  ImagePlus,
  Images,
  LayoutTemplate,
  Search,
  Sparkles,
  Upload,
} from "lucide-react";
import AdminGalleryManager from "@/components/admin/AdminGalleryManager";
import AdminPreviewImage from "@/components/admin/AdminPreviewImage";
import type { SiteMediaSlotDefinition } from "@/lib/site-media-slots";

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

function formatDate(value?: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString();
}

function createSaveLabel(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes("hero")) return "Change Hero Image";
  if (lower.includes("logo")) return "Update Logo";
  return `Update ${label}`;
}

function createResetLabel(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes("hero")) return "Reset Hero Image";
  if (lower.includes("logo")) return "Reset Logo";
  return `Reset ${label}`;
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
  const allPages = useMemo(
    () => pageSections.flatMap((section) => section.pages),
    [pageSections],
  );

  const initialSectionName =
    pageSections.find((section) =>
      section.pages.some((page) => page.pageKey === initialSelectedPageKey),
    )?.sectionName ??
    pageSections[0]?.sectionName ??
    "";

  const sectionNames = pageSections.map((section) => section.sectionName);
  const initialPage =
    allPages.find((page) => page.pageKey === initialSelectedPageKey) ?? allPages[0] ?? null;
  const initialSlot = initialPage?.slots[0] ?? null;
  const initialAssignment = initialSlot ? slotAssignments[initialSlot.key] : null;

  const [activeSectionName, setActiveSectionName] = useState(initialSectionName);
  const [pageQuery, setPageQuery] = useState("");
  const [assetQuery, setAssetQuery] = useState("");
  const [selectedPageKey, setSelectedPageKey] = useState(initialPage?.pageKey ?? "");
  const [selectedSlotKey, setSelectedSlotKey] = useState(initialSlot?.key ?? "");
  const [assetTab, setAssetTab] = useState<"library" | "upload">("library");
  const [selectedUploadName, setSelectedUploadName] = useState("");
  const [draftBucketPath, setDraftBucketPath] = useState(initialAssignment?.bucketPath ?? "");
  const [draftAltText, setDraftAltText] = useState(
    initialAssignment?.altText ?? initialSlot?.defaultAlt ?? "",
  );

  const activeSection =
    pageSections.find((section) => section.sectionName === activeSectionName) ??
    pageSections[0] ??
    null;

  const visiblePages = useMemo(() => {
    if (!activeSection) return [];
    const query = pageQuery.trim().toLowerCase();
    if (!query) return activeSection.pages;

    return activeSection.pages.filter((page) =>
      [page.pageLabel, page.pagePath || "", page.pageDescription || ""]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [activeSection, pageQuery]);

  const selectedPage =
    allPages.find((page) => page.pageKey === selectedPageKey) ??
    visiblePages[0] ??
    allPages[0] ??
    null;

  const selectedSlot =
    selectedPage?.slots.find((slot) => slot.key === selectedSlotKey) ??
    selectedPage?.slots[0] ??
    null;

  const filteredFiles = useMemo(() => {
    const query = assetQuery.trim().toLowerCase();
    if (!query) return files;
    return files.filter((file) => file.name.toLowerCase().includes(query));
  }, [assetQuery, files]);

  const featuredFiles = filteredFiles.slice(0, 12);
  const selectedFile = files.find((file) => file.name === draftBucketPath) ?? null;
  const previewSrc =
    selectedFile?.publicUrl ||
    slotAssignments[selectedSlot?.key ?? ""]?.publicUrl ||
    selectedSlot?.defaultSrc ||
    "";
  const previewAlt = draftAltText || selectedSlot?.defaultAlt || "Image preview";
  const isCustom = Boolean(slotAssignments[selectedSlot?.key ?? ""]?.bucketPath);

  const totalOverrides = Object.values(slotAssignments).filter(
    (assignment) => assignment.bucketPath,
  ).length;
  const totalGalleryOverrides = Object.values(galleryAssignments).filter(
    (items) => items.length > 0,
  ).length;

  function chooseSlot(slot: SiteMediaSlotDefinition) {
    const assignment = slotAssignments[slot.key];
    setSelectedSlotKey(slot.key);
    setDraftBucketPath(assignment?.bucketPath ?? "");
    setDraftAltText(assignment?.altText ?? slot.defaultAlt);
    setAssetTab("library");
  }

  function choosePage(page: PageSlotGroup) {
    setSelectedPageKey(page.pageKey);
    const nextSlot = page.slots[0];
    if (nextSlot) {
      chooseSlot(nextSlot);
    } else {
      setSelectedSlotKey("");
      setDraftBucketPath("");
      setDraftAltText("");
    }
  }

  function chooseSection(sectionName: string) {
    setActiveSectionName(sectionName);
    const firstPage = pageSections.find(
      (section) => section.sectionName === sectionName,
    )?.pages[0];
    if (firstPage) {
      choosePage(firstPage);
    }
  }

  return (
    <section className="py-10">
      <div className="container mx-auto max-w-[1440px] space-y-8 px-4 md:px-6">
        <div className="overflow-hidden rounded-[32px] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(212,20,90,0.18),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-6 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <p className="pink-label">Admin Media Studio</p>
              <h1 className="section-heading max-w-4xl text-4xl md:text-5xl">
                Edit one page at a time without wrestling the whole site.
              </h1>
              <p className="max-w-3xl text-muted-foreground">
                Choose a collection, choose a page, then change its hero, spotlights,
                and gallery with a clear visual editor. Uploaded files stay in{" "}
                <code>{bucketName}</code>.
              </p>
              <p className="text-sm text-muted-foreground">
                Signed in as <span className="text-foreground">{userEmail}</span>
              </p>
            </div>

            <div className="space-y-3">
              <form action="/api/admin/logout" method="post" className="flex justify-end">
                <button type="submit" className="btn-outline">
                  Sign Out
                </button>
              </form>

              <div className="grid gap-3 sm:grid-cols-3">
              <div className="glass-card rounded-3xl px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Pages
                </p>
                <p className="mt-2 font-serif text-4xl text-foreground">{allPages.length}</p>
              </div>
              <div className="glass-card rounded-3xl px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Slot Overrides
                </p>
                <p className="mt-2 font-serif text-4xl text-foreground">{totalOverrides}</p>
              </div>
              <div className="glass-card rounded-3xl px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Gallery Overrides
                </p>
                <p className="mt-2 font-serif text-4xl text-foreground">
                  {totalGalleryOverrides}
                </p>
              </div>
              </div>
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

        <div className="glass-card rounded-[30px] p-5 md:p-6">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <LayoutTemplate className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-2xl text-foreground">Page Browser</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {sectionNames.map((sectionName) => (
                <button
                  key={sectionName}
                  type="button"
                  onClick={() => {
                    chooseSection(sectionName);
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                    sectionName === activeSectionName
                      ? "bg-primary text-white"
                      : "border border-white/10 bg-white/[0.03] text-muted-foreground hover:border-white/20 hover:text-foreground"
                  }`}
                >
                  {sectionName}
                </button>
              ))}
            </div>

            <label className="relative block max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={pageQuery}
                onChange={(event) => setPageQuery(event.target.value)}
                placeholder={`Search inside ${activeSectionName.toLowerCase() || "pages"}`}
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-foreground outline-none focus:border-primary"
              />
            </label>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visiblePages.map((page) => (
                <button
                  key={page.pageKey}
                  type="button"
                  onClick={() => choosePage(page)}
                  className={`rounded-[24px] border p-4 text-left transition ${
                    page.pageKey === selectedPage?.pageKey
                      ? "border-primary/35 bg-primary/10"
                      : "border-white/8 bg-black/10 hover:border-white/16 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-medium text-foreground">{page.pageLabel}</p>
                      {page.pagePath ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          <code>{page.pagePath}</code>
                        </p>
                      ) : null}
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                  {page.pageDescription ? (
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                      {page.pageDescription}
                    </p>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedPage ? (
          <div className="space-y-6">
            <div className="glass-card rounded-[30px] p-6 md:p-7">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-3">
                  <p className="pink-label">{selectedPage.section}</p>
                  <h2 className="font-serif text-4xl text-foreground md:text-5xl">
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
                      <ExternalLink className="h-4 w-4" />
                      Preview Page
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[30px] p-5 md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <ImagePlus className="h-5 w-5 text-primary" />
                <h3 className="font-serif text-2xl text-foreground">Page Images</h3>
              </div>
              <p className="mb-5 max-w-3xl text-sm text-muted-foreground">
                Select the exact page image you want to update. The most common one is
                usually the hero image.
              </p>

              <div className="flex flex-wrap gap-3">
                {selectedPage.slots.map((slot) => {
                  const hasOverride = Boolean(slotAssignments[slot.key]?.bucketPath);
                  const active = slot.key === selectedSlot?.key;
                  return (
                    <button
                      key={slot.key}
                      type="button"
                      onClick={() => chooseSlot(slot)}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        active
                          ? "border-primary/35 bg-primary/10"
                          : "border-white/8 bg-black/10 hover:border-white/16"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{slot.label}</span>
                        {hasOverride ? (
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
                            Custom
                          </span>
                        ) : (
                          <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            Default
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedSlot ? (
              <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.15fr)_420px]">
                <div className="space-y-6">
                  <div className="overflow-hidden rounded-[30px] border border-white/8 bg-white/[0.03]">
                    <div className="border-b border-white/8 px-6 py-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="pink-label">Selected Slot</p>
                        <h3 className="font-serif text-3xl text-foreground">
                          {selectedSlot.label}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                            isCustom
                              ? "bg-emerald-500/15 text-emerald-200"
                              : "bg-white/8 text-muted-foreground"
                          }`}
                        >
                          {isCustom ? "Custom image live" : "Default image live"}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        {selectedSlot.description ||
                          "Pick a new image below, then save it to this page slot."}
                      </p>
                    </div>

                    <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_320px]">
                      <div className="border-b border-white/8 bg-black/20 xl:border-b-0 xl:border-r">
                        <div className="aspect-[16/10] overflow-hidden">
                          <AdminPreviewImage
                            src={previewSrc}
                            alt={previewAlt}
                            className="h-full w-full object-cover"
                            fallbackLabel="Preview unavailable"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 p-6">
                        <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Current source
                          </p>
                          <p className="mt-2 text-sm text-foreground">
                            {selectedFile ? selectedFile.name : "Built-in default image"}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            Slot key: <code>{selectedSlot.key}</code>
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Quick action
                          </p>
                          <h4 className="mt-2 font-serif text-2xl text-foreground">
                            {createSaveLabel(selectedSlot.label)}
                          </h4>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Choose an uploaded file or upload a fresh one, then apply it
                            directly to this slot.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-[30px] p-5 md:p-6">
                    <div className="mb-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setAssetTab("library")}
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                          assetTab === "library"
                            ? "bg-primary text-white"
                            : "border border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/16 hover:text-foreground"
                        }`}
                      >
                        Choose Uploaded Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setAssetTab("upload")}
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                          assetTab === "upload"
                            ? "bg-primary text-white"
                            : "border border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/16 hover:text-foreground"
                        }`}
                      >
                        Upload New Image
                      </button>
                    </div>

                    {assetTab === "library" ? (
                      <div className="space-y-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                          <div>
                            <p className="pink-label">Library</p>
                            <h4 className="font-serif text-2xl text-foreground">
                              Pick the image you want on this page
                            </h4>
                          </div>
                          <label className="relative block w-full max-w-sm">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                              value={assetQuery}
                              onChange={(event) => setAssetQuery(event.target.value)}
                              placeholder="Search uploaded files"
                              className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-foreground outline-none focus:border-primary"
                            />
                          </label>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                          <button
                            type="button"
                            onClick={() => setDraftBucketPath("")}
                            className={`overflow-hidden rounded-[24px] border p-3 text-left transition ${
                              !draftBucketPath
                                ? "border-primary/40 bg-primary/10"
                                : "border-white/8 bg-black/10 hover:border-white/16"
                            }`}
                          >
                            <div className="flex aspect-[4/3] items-center justify-center rounded-[18px] border border-dashed border-white/12 bg-black/15 text-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
                              Use built-in default
                            </div>
                            <div className="mt-3 flex items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  Default image
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  Safe fallback from the live site
                                </p>
                              </div>
                              {!draftBucketPath ? (
                                <Check className="h-4 w-4 text-primary" />
                              ) : null}
                            </div>
                          </button>

                          {featuredFiles.map((file) => {
                            const active = draftBucketPath === file.name;
                            return (
                              <button
                                key={file.name}
                                type="button"
                                onClick={() => setDraftBucketPath(file.name)}
                                className={`overflow-hidden rounded-[24px] border p-3 text-left transition ${
                                  active
                                    ? "border-primary/40 bg-primary/10"
                                    : "border-white/8 bg-black/10 hover:border-white/16"
                                }`}
                              >
                                <div className="overflow-hidden rounded-[18px] bg-black/15">
                                  <AdminPreviewImage
                                    src={file.publicUrl}
                                    alt={file.name}
                                    className="aspect-[4/3] h-full w-full object-cover"
                                    fallbackLabel="Missing"
                                  />
                                </div>
                                <div className="mt-3 flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-foreground">
                                      {file.name}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                      {formatBytes(file.size)}
                                      {file.createdAt ? ` • ${formatDate(file.createdAt)}` : ""}
                                    </p>
                                  </div>
                                  {active ? <Check className="h-4 w-4 text-primary" /> : null}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {filteredFiles.length > featuredFiles.length ? (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              More uploaded files
                            </label>
                            <select
                              value={draftBucketPath}
                              onChange={(event) => setDraftBucketPath(event.target.value)}
                              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground outline-none focus:border-primary"
                            >
                              <option value="">Use built-in default</option>
                              {filteredFiles.map((file) => (
                                <option key={file.name} value={file.name}>
                                  {file.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div>
                          <p className="pink-label">Upload</p>
                          <h4 className="font-serif text-2xl text-foreground">
                            Upload a fresh image for this page
                          </h4>
                          <p className="mt-2 text-sm text-muted-foreground">
                            After upload, the new file will appear in the uploaded-image
                            picker above.
                          </p>
                        </div>

                        <form
                          action="/api/admin/media/upload"
                          method="post"
                          encType="multipart/form-data"
                          className="space-y-4"
                        >
                          <input
                            type="hidden"
                            name="returnPageKey"
                            value={selectedPage.pageKey}
                          />

                          <label className="block rounded-[28px] border border-dashed border-primary/35 bg-primary/[0.05] p-8 text-center transition hover:border-primary/55 hover:bg-primary/[0.08]">
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
                            <Upload className="mx-auto mb-3 h-8 w-8 text-primary" />
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
                              "No file selected yet."
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              Optional filename hint
                            </label>
                            <input
                              name="name"
                              type="text"
                              placeholder="cadillac-front-three-quarter"
                              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground outline-none focus:border-primary"
                            />
                          </div>

                          <button type="submit" className="btn-primary">
                            <Upload className="h-4 w-4" />
                            Upload Image
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-6">
                  <form
                    action="/api/admin/site-media"
                    method="post"
                    className="glass-card-glow rounded-[30px] p-5 md:p-6"
                  >
                    <input type="hidden" name="slotKey" value={selectedSlot.key} />
                    <input type="hidden" name="returnPageKey" value={selectedPage.pageKey} />
                    <input type="hidden" name="bucketPath" value={draftBucketPath} />

                    <div className="space-y-5">
                      <div>
                        <p className="pink-label">Apply Change</p>
                        <h3 className="font-serif text-3xl text-foreground">
                          {createSaveLabel(selectedSlot.label)}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          This updates the live image for this slot on the selected page.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Alt text
                        </label>
                        <input
                          name="altText"
                          type="text"
                          value={draftAltText}
                          onChange={(event) => setDraftAltText(event.target.value)}
                          className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>

                      <div className="rounded-2xl border border-white/8 bg-black/15 p-4 text-sm text-muted-foreground">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Pending source
                        </p>
                        <p className="mt-2 text-foreground">
                          {selectedFile ? selectedFile.name : "Built-in default image"}
                        </p>
                      </div>

                      <button type="submit" className="btn-primary w-full justify-center">
                        <Sparkles className="h-4 w-4" />
                        {createSaveLabel(selectedSlot.label)}
                      </button>
                    </div>
                  </form>

                  <form
                    action="/api/admin/site-media"
                    method="post"
                    className="glass-card rounded-[30px] p-5 md:p-6"
                  >
                    <input type="hidden" name="slotKey" value={selectedSlot.key} />
                    <input type="hidden" name="returnPageKey" value={selectedPage.pageKey} />
                    <input type="hidden" name="bucketPath" value="" />
                    <input type="hidden" name="altText" value={selectedSlot.defaultAlt} />

                    <div className="space-y-4">
                      <div>
                        <p className="pink-label">Reset</p>
                        <h3 className="font-serif text-2xl text-foreground">
                          {createResetLabel(selectedSlot.label)}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          This removes any custom override and sends the page back to its
                          built-in image.
                        </p>
                      </div>
                      <button type="submit" className="btn-outline w-full justify-center">
                        {createResetLabel(selectedSlot.label)}
                      </button>
                    </div>
                  </form>

                  <div className="glass-card rounded-[30px] p-5 md:p-6">
                    <div className="flex items-center gap-3">
                      <Images className="h-5 w-5 text-primary" />
                      <h3 className="font-serif text-2xl text-foreground">
                        Uploaded Library
                      </h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {files.length} uploaded file{files.length === 1 ? "" : "s"} available
                      across the whole site.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {selectedPage.slots[0]?.page.supportsGallery ? (
              <details className="glass-card rounded-[30px] p-5 md:p-6">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="pink-label">Optional</p>
                      <h3 className="font-serif text-3xl text-foreground">
                        Page Gallery Manager
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Open this only when you want to replace the full gallery for this
                        page.
                      </p>
                    </div>
                    <span className="btn-outline">Open Gallery Tools</span>
                  </div>
                </summary>

                <div className="mt-6">
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
                </div>
              </details>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
