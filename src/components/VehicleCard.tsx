import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import type { Vehicle } from '@/data/vehicles';
import heroPartyBus from '@/assets/hero-partybus.jpg';

interface VehicleCardProps {
  vehicle: Vehicle;
  basePath: string;
}

const VehicleCard = ({ vehicle, basePath }: VehicleCardProps) => (
  <Link to={`${basePath}/${vehicle.slug}`} className="group glass-card overflow-hidden">
    <div className="image-hover-zoom relative aspect-[4/3]">
      <img
        src={heroPartyBus}
        alt={vehicle.name}
        className="w-full h-full object-cover"
        loading="lazy"
        width={600}
        height={450}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
      <div className="absolute top-4 right-4 glass-card px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-foreground">
        <Users className="w-3.5 h-3.5 text-primary" />
        {vehicle.passengers}
      </div>
    </div>
    <div className="p-5">
      <h3 className="font-serif text-lg text-sky-accent group-hover:text-foreground transition-colors">{vehicle.name}</h3>
      <p className="text-sm text-muted-foreground mt-1">{vehicle.tagline}</p>
      <span className="inline-flex items-center gap-1 mt-3 text-xs uppercase tracking-wider text-primary font-semibold group-hover:gap-2 transition-all">
        Explore →
      </span>
    </div>
  </Link>
);

export default VehicleCard;
