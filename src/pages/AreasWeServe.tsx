import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { areas } from '@/data/areas';
import PageHeader from '@/components/PageHeader';

const AreasWeServe = () => (
  <>
    <PageHeader
      label="Service Areas"
      title={<>Areas We <span className="gradient-text font-semibold">Serve</span></>}
      subtitle="Luxury limousine and party bus service across the greater Chicagoland area."
    />

    <section className="pb-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {areas.map((area) => (
            <Link key={area.slug} to={`/areas-we-serve/${area.slug}`} className="glass-card p-6 group hover:border-primary/20 transition-all">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <h3 className="text-foreground font-medium group-hover:text-primary transition-colors">{area.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{area.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default AreasWeServe;
