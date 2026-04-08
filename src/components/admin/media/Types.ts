import type { SiteMediaSlotDefinition } from "@/lib/site-media-slots";

export type UploadedFile = {
  name: string;
  publicUrl: string;
  size: number;
  createdAt: string;
};

export type PageSlotGroup = {
  section: string;
  pageKey: string;
  pageLabel: string;
  pagePath?: string;
  pageDescription?: string;
  slots: SiteMediaSlotDefinition[];
};

export type SlotAssignment = {
  bucketPath: string | null;
  altText: string;
  objectFit: string;
  updatedAt: string | null;
  publicUrl: string | null;
};

export type GalleryAssignment = {
  bucketPath: string;
  altText: string;
  objectFit: string;
  updatedAt: string | null;
  publicUrl: string;
};

export type WorkspaceState = {
  selectedPageKey: string;
  selectedSlotKey: string | null;
  selectedGalleryIndex: number | null;
  isDrawerOpen: boolean;
};
