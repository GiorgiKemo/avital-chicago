import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { services } from '@/data/services';
import PageHeader from '@/components/PageHeader';
import serviceWedding from '@/assets/service-wedding.jpg';
import serviceQuinceanera from '@/assets/service-quinceanera.jpg';
import serviceNightout from '@/assets/service-nightout.jpg';

const imgs = [serviceWedding, serviceQuinceanera, serviceNightout];

const Services = () => (
  <>
    <PageHeader
      label="Our Services"
      title={<>Premium <span className="gradient-text font-semibold">Transportation</span> Services</>}
      subtitle="From weddings to wild nights out, we have the perfect ride for every occasion."
    />

    <section className="pb-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <Link key={s.slug} to={`/services/${s.slug}`} className="group glass-card overflow-hidden">
              <div className="image-hover-zoom relative aspect-[4/3]">
                <img src={imgs[i % 3]} alt={s.name} className="w-full h-full object-cover" loading="lazy" width={600} height={450} />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <span className="absolute top-4 left-4 text-3xl font-serif gradient-text font-semibold">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl text-foreground mb-2">{s.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{s.shortDescription}</p>
                <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-primary font-semibold group-hover:gap-2 transition-all">
                  Learn More <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default Services;
