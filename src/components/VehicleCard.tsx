import Link from "next/link";
import Image from "next/image";
import { Users } from "lucide-react";
import type { Vehicle } from "@/types";

interface VehicleCardProps {
  vehicle: Vehicle;
  basePath: string;
}

const VehicleCard = ({ vehicle, basePath }: VehicleCardProps) => {
  const thumbnail = vehicle.images[0] || "/images/hero/hero-partybus.jpg";

  return (
    <Link href={`${basePath}/${vehicle.slug}`} className="group glass-card overflow-hidden">
      <div className="image-hover-zoom relative aspect-[4/3]">
        <Image
          src={thumbnail}
          alt={vehicle.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute top-4 right-4 glass-card px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Users className="w-3.5 h-3.5 text-primary" />
          {vehicle.passengers}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg text-sky-accent group-hover:text-foreground transition-colors">
          {vehicle.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{vehicle.tagline}</p>
        <span className="inline-flex items-center gap-1 mt-3 text-xs uppercase tracking-wider text-primary font-semibold group-hover:gap-2 transition-all">
          Explore →
        </span>
      </div>
    </Link>
  );
};

export default VehicleCard;
