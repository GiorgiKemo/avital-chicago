import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Check } from 'lucide-react';
import { partyBuses, limousines } from '@/data/vehicles';
import QuoteForm from '@/components/QuoteForm';
import heroPartyBus from '@/assets/hero-partybus.jpg';
import heroLimo from '@/assets/hero-limo.jpg';
import partybusInterior from '@/assets/partybus-interior.jpg';

const VehicleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const isLimo = location.pathname.startsWith('/chicago-limo-rental');
  const vehicles = isLimo ? limousines : partyBuses;
  const vehicle = vehicles.find(v => v.slug === slug);
  const basePath = isLimo ? '/chicago-limo-rental' : '/chicago-party-bus-rental';
  const images = isLimo ? [heroLimo, partybusInterior, heroPartyBus] : [heroPartyBus, partybusInterior, heroLimo];

  if (!vehicle) {
    return (
      <div className="pt-32 pb-24 text-center">
        <h1 className="section-heading">Vehicle not found</h1>
        <Link to={basePath} className="btn-primary mt-8 inline-flex">Back to Fleet</Link>
      </div>
    );
  }

  return (
    <>
      <div className="pt-28 pb-4">
        <div className="container mx-auto px-6">
          <Link to={basePath} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to {isLimo ? 'Limo' : 'Party Bus'} Fleet
          </Link>
        </div>
      </div>

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-2">{vehicle.name}</h1>
              <p className="text-muted-foreground text-lg mb-8">{vehicle.tagline}</p>

              {/* Gallery */}
              <div className="grid grid-cols-1 gap-4 mb-12">
                <div className="rounded-xl overflow-hidden aspect-video">
                  <img src={images[0]} alt={vehicle.name} className="w-full h-full object-cover" width={1920} height={1080} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {images.map((img, i) => (
                    <div key={i} className="rounded-lg overflow-hidden aspect-[4/3]">
                      <img src={img} alt={`${vehicle.name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" width={400} height={300} />
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-12">{vehicle.description}</p>

              {/* Features */}
              <div className="glass-card p-8 mb-8">
                <h3 className="font-serif text-xl text-foreground mb-6">Features & Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {vehicle.features.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capacity */}
              <div className="glass-card-glow p-8 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-serif font-semibold text-foreground">{vehicle.passengers}</p>
                  <p className="text-muted-foreground text-sm">Maximum Passengers</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-28">
                <QuoteForm compact />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VehicleDetail;
