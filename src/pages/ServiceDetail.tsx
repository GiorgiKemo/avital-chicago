import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { services } from '@/data/services';
import QuoteForm from '@/components/QuoteForm';
import serviceWedding from '@/assets/service-wedding.jpg';
import serviceQuinceanera from '@/assets/service-quinceanera.jpg';
import serviceNightout from '@/assets/service-nightout.jpg';

const imgs = [serviceWedding, serviceQuinceanera, serviceNightout];

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const idx = services.findIndex(s => s.slug === slug);
  const service = services[idx];

  if (!service) {
    return (
      <div className="pt-32 pb-24 text-center">
        <h1 className="section-heading">Service not found</h1>
        <Link to="/services" className="btn-primary mt-8 inline-flex">All Services</Link>
      </div>
    );
  }

  return (
    <>
      <div className="pt-28 pb-4">
        <div className="container mx-auto px-6">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Services
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] mb-12 overflow-hidden">
        <img src={imgs[idx % 3]} alt={service.name} className="w-full h-full object-cover" width={1920} height={800} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="container mx-auto px-6">
            <p className="pink-label mb-3">{service.name}</p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground">{service.name}</h1>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
            <div>
              <p className="text-muted-foreground leading-relaxed text-lg mb-12">{service.description}</p>

              {/* CTA */}
              <div className="glass-card-glow p-10 text-center">
                <h3 className="font-serif text-2xl text-foreground mb-4">Ready to Book?</h3>
                <p className="text-muted-foreground mb-6">Get a free quote for your {service.name.toLowerCase()} transportation.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/contact-us" className="btn-primary">
                    Get a Quote <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a href="tel:6305506753" className="btn-outline">
                    Call Us <ArrowRight className="w-4 h-4" />
                  </a>
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

export default ServiceDetail;
