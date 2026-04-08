"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { SiteMediaGalleryAssignment } from "@/lib/site-media-slots";

let cachedGalleries: Record<string, SiteMediaGalleryAssignment[]> | null = null;
const cachedGalleryPromises = new Map<string, Promise<SiteMediaGalleryAssignment[]>>();

async function loadGalleryAssignments(pageKey: string, forceFresh = false) {
  if (cachedGalleries?.[pageKey] && !forceFresh) {
    return cachedGalleries[pageKey];
  }

  if (!cachedGalleryPromises.has(pageKey) || forceFresh) {
    cachedGalleryPromises.set(
      pageKey,
      fetch(`/api/site-media-galleries?pageKey=${encodeURIComponent(pageKey)}`, {
        cache: "no-store",
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Could not load site media gallery.");
          }

          const payload = (await response.json()) as {
            items?: SiteMediaGalleryAssignment[];
          };

          if (!cachedGalleries) {
            cachedGalleries = {};
          }

          cachedGalleries[pageKey] = payload.items ?? [];
          return cachedGalleries[pageKey];
        })
        .catch(() => []),
    );
  }

  return cachedGalleryPromises.get(pageKey)!;
}

type ManagedGalleryGridProps = {
  pageKey: string;
  pageLabel: string;
  fallbackImages: string[];
};

export default function ManagedGalleryGrid({
  pageKey,
  pageLabel,
  fallbackImages,
}: ManagedGalleryGridProps) {
  const [items, setItems] = useState<SiteMediaGalleryAssignment[] | null>(
    cachedGalleries?.[pageKey] ?? null,
  );

  useEffect(() => {
    let active = true;

    loadGalleryAssignments(pageKey, true).then((galleryItems) => {
      if (active) {
        setItems(galleryItems);
      }
    });

    return () => {
      active = false;
    };
  }, [pageKey]);

  const resolvedItems = useMemo(() => {
    if (items && items.length > 0) {
      return items.map((item, index) => ({
        src: item.src,
        alt: item.alt || `${pageLabel} gallery image ${index + 1}`,
      }));
    }

    return fallbackImages.map((image, index) => ({
      src: image,
      alt: `${pageLabel} gallery ${index + 1}`,
    }));
  }, [fallbackImages, items, pageLabel]);

  if (resolvedItems.length === 0) {
    return (
      <div className="glass-card p-8 text-muted-foreground">
        More gallery images will be added here shortly.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {resolvedItems.map((image, index) => (
        <div
          key={`${image.src}-${index}`}
          className="image-hover-zoom relative aspect-[3/2] overflow-hidden rounded-2xl border border-border"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            quality={95}
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}
