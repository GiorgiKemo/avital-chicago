"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import type { Vehicle } from "@/types";

interface VehicleCardProps {
  vehicle: Vehicle;
  basePath: string;
  preferLegacyCardImage?: boolean;
}

const VehicleCard = ({
  vehicle,
  basePath,
  preferLegacyCardImage = false,
}: VehicleCardProps) => {
  const thumbnail =
    (preferLegacyCardImage ? vehicle.cardImage : undefined) ||
    vehicle.images[0] || "/images/gallery/hummer-h2-triple-axle/exterior/01.webp";

  return (
    <div className="h-full">
      <Link
        href={`${basePath}/${vehicle.slug}`}
        className="group glass-card flex h-full flex-col overflow-hidden"
      >
        <div className="image-hover-zoom relative aspect-[3/2]">
          <Image
            src={thumbnail}
            alt={vehicle.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Dark gradient removed to prevent obscuring the baked-in image text */}
          <div className="glass-card absolute right-4 top-4 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-foreground">
            <Users className="h-3.5 w-3.5 text-primary" />
            {vehicle.passengers}
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-serif text-xl tracking-tight text-foreground/90 transition-colors group-hover:text-foreground">
            {vehicle.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{vehicle.tagline}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary transition-all duration-300 group-hover:gap-3 group-hover:text-white">
            Explore <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </div>
  );
};

export default VehicleCard;
