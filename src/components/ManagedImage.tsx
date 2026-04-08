"use client";

import { useEffect, useMemo, useState } from "react";
import Image, { type ImageProps } from "next/image";
import type { SiteMediaSlotAssignment } from "@/lib/site-media-slots";

let cachedSlots: Record<string, SiteMediaSlotAssignment> | null = null;
let cachedPromise: Promise<Record<string, SiteMediaSlotAssignment>> | null = null;

async function loadSlotAssignments(forceFresh = false) {
  if (cachedSlots && !forceFresh) {
    return cachedSlots;
  }

  if (!cachedPromise || forceFresh) {
    cachedPromise = fetch("/api/site-media-slots", {
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Could not load site media slots.");
        }

        const payload = (await response.json()) as {
          slots?: Record<string, SiteMediaSlotAssignment>;
        };

        cachedSlots = payload.slots ?? {};
        return cachedSlots;
      })
      .catch(() => ({}));
  }

  return cachedPromise;
}

type ManagedImageProps = Omit<ImageProps, "src" | "alt"> & {
  slotKey: string;
  fallbackSrc: string;
  fallbackAlt: string;
};

export default function ManagedImage({
  slotKey,
  fallbackSrc,
  fallbackAlt,
  ...props
}: ManagedImageProps) {
  const [resolved, setResolved] = useState<SiteMediaSlotAssignment | null>(
    cachedSlots?.[slotKey] ?? null,
  );

  useEffect(() => {
    let active = true;

    loadSlotAssignments().then((slots) => {
      if (active) {
        setResolved(slots[slotKey] ?? null);
      }
    });

    return () => {
      active = false;
    };
  }, [slotKey]);

  const src = useMemo(() => resolved?.src || fallbackSrc, [resolved?.src, fallbackSrc]);
  const alt = useMemo(() => resolved?.alt || fallbackAlt, [resolved?.alt, fallbackAlt]);

  return <Image {...props} src={src} alt={alt} />;
}
