import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { areas } from '@/data/areas';
import { services } from '@/data/services';
import QuoteForm from '@/components/QuoteForm';

const AreaDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const area = areas.find(a => a.slug === slug);

  if (!area) {
    return (
      <div className="pt-32 pb-24 text-center">
        <h1 className="section-heading">Area not found</h1>
        <Link to="/areas-we-serve" className="btn-primary mt-8 inline-flex">All Areas</Link>
      </div>
    );
  }

  return (
    <>
      <div className="pt-28 pb-4">
        <div className="container mx-auto px-6">
          <Link to="/areas-we-serve" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Areas
          </Link>
        </div>
      </div>

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
            <div>
              <p className="pink-label mb-4">Serving {area.name}</p>
              <h1 className="section-heading mb-6">
                Party Bus & Limo Rental in <span className="gradient-text font-semibold">{area.name}</span>
              </h1>
              <p className="text-muted-foreground leading-relaxed text-lg mb-8">{area.description}</p>
              <p className="text-muted-foreground leading-relaxed mb-12">
                Whether you're planning a wedding, quinceañera, prom, or night out in {area.name}, Avital Chicago Limousine provides premium transportation services tailored to your needs. Our fleet of luxury party buses and limousines is available for pickup and drop-off throughout {area.name} and the surrounding areas.
              </p>

              {/* Services Available */}
              <div className="glass-card p-8 mb-8">
                <h3 className="font-serif text-xl text-foreground mb-6">Services Available in {area.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map(s => (
                    <Link key={s.slug} to={`/services/${s.slug}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="glass-card-glow p-10 text-center">
                <h3 className="font-serif text-2xl text-foreground mb-4">Book Your Ride in {area.name}</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/contact-us" className="btn-primary">Get a Quote <ArrowRight className="w-4 h-4" /></Link>
                  <a href="tel:6305506753" className="btn-outline">Call Us <ArrowRight className="w-4 h-4" /></a>
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

export default AreaDetail;
