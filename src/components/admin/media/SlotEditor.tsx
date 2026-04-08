import { RefreshCw, Maximize, Target, Image as ImageIcon, Pencil } from "lucide-react";
import type { PageSlotGroup, SlotAssignment, GalleryAssignment } from "./Types";

type SlotEditorProps = {
  pageGroup: PageSlotGroup;
  slotAssignments: Record<string, SlotAssignment>;
  galleryAssignments: Record<string, GalleryAssignment[]>;
  onOpenDrawerForSlot: (slotKey: string) => void;
  onOpenDrawerForGallery: (pageKey: string, index: number) => void;
  onAddGalleryImage: (pageKey: string) => void;
  onRemoveGalleryImage: (pageKey: string, index: number) => void;
};

export default function SlotEditor({
  pageGroup,
  slotAssignments,
  galleryAssignments,
  onOpenDrawerForSlot,
  onOpenDrawerForGallery,
  onAddGalleryImage,
  onRemoveGalleryImage,
}: SlotEditorProps) {
  const galleries =
    pageGroup.slots[0]?.page.supportsGallery
      ? galleryAssignments[pageGroup.pageKey] || []
      : null;

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10">
      {/* Page Header */}
      <div className="border-b border-white/5 pb-5">
        <h1 className="text-2xl font-outfit font-light text-white tracking-wide">
          {pageGroup.pageLabel}
        </h1>
        {pageGroup.pageDescription && (
          <p className="text-white/50 font-inter mt-2 max-w-2xl text-sm leading-relaxed">
            {pageGroup.pageDescription}
          </p>
        )}
      </div>

      {/* Primary Slots */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">
          Primary Slots
        </h2>
        <div className="space-y-3">
          {pageGroup.slots.map((slot) => {
            const assignment = slotAssignments[slot.key];
            const src = assignment?.publicUrl || slot.defaultSrc;
            const isAssigned = !!assignment?.publicUrl;
            const fitMode = assignment?.objectFit === "contain" ? "object-contain" : "object-cover";

            return (
              <div
                key={slot.key}
                className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-3 hover:border-white/10 transition-all group"
              >
                {/* Compact Thumbnail */}
                <div
                  className="relative w-28 h-20 shrink-0 rounded-lg overflow-hidden bg-black/60 cursor-pointer"
                  onClick={() => onOpenDrawerForSlot(slot.key)}
                >
                  <img
                    src={src}
                    alt={slot.defaultAlt}
                    className="w-full h-full object-contain p-1"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Pencil className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Slot Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">{slot.label}</h3>
                  {slot.description && (
                    <p className="text-xs text-white/40 mt-0.5 truncate">{slot.description}</p>
                  )}
                  <div className="mt-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        isAssigned
                          ? "bg-[rgba(var(--primary-rgb),0.1)] text-[var(--primary)] border-[var(--primary)]/30"
                          : "bg-white/5 text-white/30 border-white/10"
                      }`}
                    >
                      {isAssigned ? "Custom" : "Default"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenDrawerForSlot(slot.key)}
                    className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-md transition-colors font-medium"
                  >
                    Change
                  </button>

                  {isAssigned && (
                    <>
                      <form action="/api/admin/site-media" method="POST">
                        <input type="hidden" name="slotKey" value={slot.key} />
                        <input type="hidden" name="returnPageKey" value={pageGroup.pageKey} />
                        <input type="hidden" name="bucketPath" value={assignment.bucketPath || ""} />
                        <input type="hidden" name="altText" value={assignment.altText} />
                        <input
                          type="hidden"
                          name="objectFit"
                          value={assignment.objectFit === "contain" ? "cover" : "contain"}
                        />
                        <button
                          type="submit"
                          title="Toggle Fit / Cover"
                          className="p-1.5 bg-white/5 hover:bg-white/10 text-white/50 rounded-md transition-colors"
                        >
                          {assignment.objectFit === "contain" ? (
                            <Maximize className="w-3.5 h-3.5" />
                          ) : (
                            <Target className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </form>

                      <form action="/api/admin/site-media" method="POST">
                        <input type="hidden" name="slotKey" value={slot.key} />
                        <input type="hidden" name="returnPageKey" value={pageGroup.pageKey} />
                        <input type="hidden" name="bucketPath" value="" />
                        <button
                          type="submit"
                          title="Reset to default"
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400/70 hover:text-red-400 rounded-md transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gallery Settings */}
      {galleries !== null && (
        <div className="space-y-5 pt-8 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">
                Gallery
              </h2>
              <p className="text-xs text-white/30 mt-1">
                Drag-and-drop gallery images for this page.
              </p>
            </div>
            <button
              onClick={() => onAddGalleryImage(pageGroup.pageKey)}
              className="px-4 py-1.5 border border-white/10 hover:bg-white hover:text-black text-white/70 text-xs font-medium transition-colors rounded-lg"
            >
              + Add Image
            </button>
          </div>

          <form action="/api/admin/site-media-gallery" method="POST" className="space-y-5">
            <input type="hidden" name="pageKey" value={pageGroup.pageKey} />
            <input type="hidden" name="returnPageKey" value={pageGroup.pageKey} />

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {galleries.map((item, index) => {
                const isAssigned = !!item.publicUrl;
                return (
                  <div
                    key={index}
                    className="bg-[#111111] border border-white/5 rounded-lg overflow-hidden flex flex-col hover:border-white/10 transition-all"
                  >
                    <div className="relative aspect-[4/3] bg-black/50 group">
                      {isAssigned ? (
                        <img
                          src={item.publicUrl}
                          alt="gallery"
                          className={`w-full h-full ${item.objectFit === "contain" ? "object-contain" : "object-cover"}`}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/20 p-3 text-center">
                          <ImageIcon className="w-6 h-6 mb-1 opacity-40" />
                          <span className="text-[10px] uppercase tracking-widest">Empty</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                        <button
                          type="button"
                          onClick={() => onOpenDrawerForGallery(pageGroup.pageKey, index)}
                          className="px-3 py-1.5 bg-white text-black text-[11px] font-medium rounded-md hover:scale-105 transition-transform"
                        >
                          Select
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveGalleryImage(pageGroup.pageKey, index)}
                          className="px-3 py-1.5 bg-red-600 text-white text-[11px] font-medium rounded-md hover:bg-red-500 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="p-2.5">
                      <input type="hidden" name="galleryPath" value={item.bucketPath} />
                      <input type="hidden" name="galleryObjectFit" value={item.objectFit} />
                      <input
                        type="text"
                        name="galleryAlt"
                        defaultValue={item.altText}
                        placeholder="Alt text..."
                        className="w-full bg-black/40 border border-white/10 text-[11px] text-white px-2 py-1.5 rounded focus:outline-none focus:border-[var(--primary)]"
                      />
                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-white/30 uppercase tracking-widest">
                        <span>#{index + 1}</span>
                        <span>{item.objectFit}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <button
                type="submit"
                name="action"
                value="save"
                className="px-6 py-2 bg-[var(--primary)] text-white text-xs tracking-widest font-semibold uppercase hover:bg-[var(--primary)]/90 rounded-lg transition-all"
              >
                Save Gallery
              </button>
              <button
                type="submit"
                name="action"
                value="reset"
                className="px-6 py-2 bg-transparent border border-white/10 text-white/40 text-xs tracking-widest font-semibold uppercase hover:text-white rounded-lg transition-colors"
                onClick={(e) => {
                  if (!confirm("Reset gallery to default? All custom changes will be lost.")) {
                    e.preventDefault();
                  }
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
