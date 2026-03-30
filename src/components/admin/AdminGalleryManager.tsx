"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Images, Plus, Trash2 } from "lucide-react";

type UploadedFile = {
  name: string;
  publicUrl: string;
};

type InitialGalleryItem = {
  bucketPath: string;
  altText: string;
  publicUrl: string;
};

type GalleryRow = {
  id: string;
  bucketPath: string;
  altText: string;
};

type AdminGalleryManagerProps = {
  pageKey: string;
  pageLabel: string;
  pagePath?: string;
  description?: string;
  defaultGalleryCount?: number;
  initialItems: InitialGalleryItem[];
  files: UploadedFile[];
};

function createRow(seed = ""): GalleryRow {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    bucketPath: seed,
    altText: "",
  };
}

export default function AdminGalleryManager({
  pageKey,
  pageLabel,
  pagePath,
  description,
  defaultGalleryCount,
  initialItems,
  files,
}: AdminGalleryManagerProps) {
  const [rows, setRows] = useState<GalleryRow[]>(
    initialItems.map((item, index) => ({
      id: `${item.bucketPath}-${index}`,
      bucketPath: item.bucketPath,
      altText: item.altText,
    })),
  );

  const fileMap = useMemo(
    () => new Map(files.map((file) => [file.name, file.publicUrl])),
    [files],
  );

  function updateRow(
    rowId: string,
    patch: Partial<Pick<GalleryRow, "bucketPath" | "altText">>,
  ) {
    setRows((current) =>
      current.map((row) => (row.id === rowId ? { ...row, ...patch } : row)),
    );
  }

  function removeRow(rowId: string) {
    setRows((current) => current.filter((row) => row.id !== rowId));
  }

  function moveRow(rowId: string, direction: -1 | 1) {
    setRows((current) => {
      const index = current.findIndex((row) => row.id === rowId);
      if (index === -1) return current;

      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= current.length) return current;

      const next = [...current];
      const [row] = next.splice(index, 1);
      next.splice(targetIndex, 0, row);
      return next;
    });
  }

  const hasCustomGallery = rows.some((row) => row.bucketPath);

  return (
    <div className="rounded-3xl border border-primary/12 bg-primary/[0.03] p-5">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Images className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Page Gallery
            </p>
          </div>
          <h5 className="font-serif text-2xl text-foreground">{pageLabel}</h5>
          {pagePath ? (
            <p className="text-xs text-muted-foreground">
              <code>{pagePath}</code>
            </p>
          ) : null}
          <p className="max-w-3xl text-sm text-muted-foreground">
            {description ||
              "Build a custom gallery for this page using uploaded images. If you reset it, the page goes back to its built-in gallery."}
          </p>
          <p className="text-xs text-muted-foreground">
            Custom gallery images fully replace the built-in gallery for this page.
            {defaultGalleryCount
              ? ` Default gallery size: ${defaultGalleryCount} image${
                  defaultGalleryCount === 1 ? "" : "s"
                }.`
              : ""}
          </p>
        </div>

        {pagePath ? (
          <a href={pagePath} target="_blank" rel="noreferrer" className="btn-outline">
            Open Page
          </a>
        ) : null}
      </div>

      {!hasCustomGallery ? (
        <div className="mb-5 rounded-2xl border border-dashed border-white/12 bg-black/10 p-4 text-sm text-muted-foreground">
          This page is currently using its built-in gallery. Add uploaded images
          below if you want a custom gallery instead.
        </div>
      ) : null}

      {files.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/12 bg-black/10 p-4 text-sm text-muted-foreground">
          Upload some images first, then come back here to build this page’s
          gallery.
        </div>
      ) : (
        <form action="/api/admin/site-media-gallery" method="post" className="space-y-5">
          <input type="hidden" name="pageKey" value={pageKey} />

          <div className="space-y-4">
            {rows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/12 bg-black/10 p-4 text-sm text-muted-foreground">
                No custom gallery images yet.
              </div>
            ) : null}

            {rows.map((row, index) => {
              const previewUrl = row.bucketPath ? fileMap.get(row.bucketPath) : null;

              return (
                <div
                  key={row.id}
                  className="rounded-2xl border border-white/10 bg-black/10 p-4"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Gallery image {index + 1}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveRow(row.id, -1)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                        aria-label="Move image up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveRow(row.id, 1)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                        aria-label="Move image down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-400/25 text-rose-200 transition hover:bg-rose-500/10"
                        aria-label="Remove image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                    <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/20">
                      {previewUrl ? (
                        <Image
                          src={previewUrl}
                          alt={row.altText || `${pageLabel} gallery preview`}
                          width={640}
                          height={480}
                          className="aspect-[4/3] h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex aspect-[4/3] items-center justify-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          No image selected
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Uploaded image
                        </label>
                        <select
                          value={row.bucketPath}
                          onChange={(event) =>
                            updateRow(row.id, { bucketPath: event.target.value })
                          }
                          className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground outline-none focus:border-primary"
                        >
                          <option value="">Select an uploaded image</option>
                          {files.map((file) => (
                            <option key={`${row.id}-${file.name}`} value={file.name}>
                              {file.name}
                            </option>
                          ))}
                        </select>
                        <input type="hidden" name="galleryPath" value={row.bucketPath} />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Alt text
                        </label>
                        <input
                          value={row.altText}
                          onChange={(event) =>
                            updateRow(row.id, { altText: event.target.value })
                          }
                          className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground outline-none focus:border-primary"
                          placeholder={`${pageLabel} gallery image ${index + 1}`}
                        />
                        <input type="hidden" name="galleryAlt" value={row.altText} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setRows((current) => [...current, createRow()])}
              className="btn-outline"
            >
              <Plus className="h-4 w-4" />
              Add Gallery Image
            </button>
            <button type="submit" className="btn-primary">
              Save Gallery
            </button>
            <button
              type="submit"
              name="action"
              value="reset"
              className="btn-outline"
            >
              Reset To Default Gallery
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
