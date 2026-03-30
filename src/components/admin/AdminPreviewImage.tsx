"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

type AdminPreviewImageProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
};

export default function AdminPreviewImage({
  src,
  alt,
  className,
  fallbackLabel,
}: AdminPreviewImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-3 bg-black/30 text-center text-muted-foreground ${className ?? ""}`}
      >
        <ImageOff className="h-8 w-8 text-primary/70" />
        <div className="space-y-1 px-4">
          <p className="text-sm font-medium text-foreground">
            {fallbackLabel || "Preview unavailable"}
          </p>
          <p className="text-xs text-muted-foreground">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className || "h-full w-full object-cover"}
      onError={() => setFailed(true)}
    />
  );
}
