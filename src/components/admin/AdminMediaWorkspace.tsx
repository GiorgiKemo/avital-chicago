"use client";

import { useState, useCallback, useEffect } from "react";
import { CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";
import WorkspaceSidebar from "./media/WorkspaceSidebar";
import SlotEditor from "./media/SlotEditor";
import MediaDrawer from "./media/MediaDrawer";
import type { UploadedFile, PageSlotGroup, SlotAssignment, GalleryAssignment, WorkspaceState } from "./media/Types";

type AdminMediaWorkspaceProps = {
  userEmail: string;
  feedback: { tone: "success" | "error"; text: string } | null;
  bucketName: string;
  acceptedFormatsText: string;
  maxUploadSizeText: string;
  files: UploadedFile[];
  pageSections: { sectionName: string; pages: PageSlotGroup[] }[];
  slotAssignments: Record<string, SlotAssignment>;
  galleryAssignments: Record<string, GalleryAssignment[]>;
  initialSelectedPageKey: string;
  initialSelectedSlotKey: string;
  initialUploadedName: string;
};

export default function AdminMediaWorkspace({
  feedback,
  bucketName,
  files,
  pageSections,
  slotAssignments,
  galleryAssignments: serverGalleryAssignments,
  initialSelectedPageKey,
  initialSelectedSlotKey,
}: AdminMediaWorkspaceProps) {
  const [selectedPageKey, setSelectedPageKey] = useState(initialSelectedPageKey);
  const [drawerTarget, setDrawerTarget] = useState<
    | { type: "slot"; key: string }
    | { type: "gallery"; pageKey: string; index: number }
    | null
  >(null);

  // We keep a local copy of galleries so we can dynamically add/remove layers in the UI
  // before submitting to the backend.
  const [localGalleries, setLocalGalleries] = useState<Record<string, GalleryAssignment[]>>(serverGalleryAssignments);

  // Keep local galleries in sync with server when server state changes (e.g. after save)
  useEffect(() => {
    setLocalGalleries(serverGalleryAssignments);
  }, [serverGalleryAssignments]);

  const activePageGroup = pageSections
    .flatMap((s) => s.pages)
    .find((p) => p.pageKey === selectedPageKey);

  const handleOpenDrawerForSlot = useCallback((slotKey: string) => {
    setDrawerTarget({ type: "slot", key: slotKey });
  }, []);

  const handleOpenDrawerForGallery = useCallback((pageKey: string, index: number) => {
    setDrawerTarget({ type: "gallery", pageKey, index });
  }, []);

  const handleAddGalleryImage = useCallback((pageKey: string) => {
    setLocalGalleries((prev) => {
      const current = prev[pageKey] || [];
      return {
        ...prev,
        [pageKey]: [...current, { bucketPath: "", altText: "", objectFit: "cover", updatedAt: null, publicUrl: "" }],
      };
    });
  }, []);

  const handleRemoveGalleryImage = useCallback((pageKey: string, index: number) => {
    setLocalGalleries((prev) => {
      const current = prev[pageKey] || [];
      const updated = [...current];
      updated.splice(index, 1);
      return {
        ...prev,
        [pageKey]: updated,
      };
    });
  }, []);

  const handleSelectImageFromDrawer = (bucketPath: string, publicUrl: string) => {
    if (!drawerTarget) return;

    if (drawerTarget.type === "slot") {
      // For slots, we programmatically submit the form to update it instantly.
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/api/admin/site-media";
      
      const inputs = {
        slotKey: drawerTarget.key,
        bucketPath,
        altText: "", // Keep missing to let backend handle default
        returnPageKey: selectedPageKey
      };
      
      Object.entries(inputs).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      
      document.body.appendChild(form);
      form.submit();
    } else if (drawerTarget.type === "gallery") {
      // Modify local UI state for the gallery array. The user will click "Save Gallery" later.
      setLocalGalleries((prev) => {
        const pageKey = drawerTarget.pageKey;
        const current = [...(prev[pageKey] || [])];
        if (current[drawerTarget.index]) {
          current[drawerTarget.index] = {
            ...current[drawerTarget.index],
            bucketPath,
            publicUrl,
          };
        }
        return { ...prev, [pageKey]: current };
      });
      // Close the drawer
      setDrawerTarget(null);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-black relative">
      <WorkspaceSidebar
        pageSections={pageSections}
        selectedPageKey={selectedPageKey}
        onSelectPage={setSelectedPageKey}
      />

      <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-[#050505] to-[#151515]">
        {feedback && (
          <div
            className={`px-4 py-3 text-sm font-medium tracking-wide flex items-center justify-center shrink-0 ${
              feedback.tone === "error"
                ? "bg-red-500/10 text-red-500 border-b border-red-500/20"
                : "bg-emerald-500/10 text-emerald-500 border-b border-emerald-500/20"
            }`}
          >
            {feedback.tone === "error" ? (
              <AlertTriangle className="w-4 h-4 mr-2" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            {feedback.text}
          </div>
        )}

        {activePageGroup ? (
          <SlotEditor
            pageGroup={activePageGroup}
            slotAssignments={slotAssignments}
            galleryAssignments={localGalleries}
            onOpenDrawerForSlot={handleOpenDrawerForSlot}
            onOpenDrawerForGallery={handleOpenDrawerForGallery}
            onAddGalleryImage={handleAddGalleryImage}
            onRemoveGalleryImage={handleRemoveGalleryImage}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/50 font-outfit">
            Select a page from the sidebar to edit media.
          </div>
        )}
      </div>

      <MediaDrawer
        isOpen={drawerTarget !== null}
        onClose={() => setDrawerTarget(null)}
        files={files}
        onSelectImage={handleSelectImageFromDrawer}
        bucketName={bucketName}
      />
    </div>
  );
}
