import { Link } from 'react-router-dom';
import { ArrowRight, Bus, Check } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import QuoteForm from '@/components/QuoteForm';

const features = [
  'Comfortable reclining seats',
  'Overhead storage compartments',
  'On-board restroom',
  'WiFi connectivity',
  'USB charging ports',
  'Climate control',
  'Professional drivers',
  'Flexible scheduling',
];

const CharterBuses = () => (
  <>
    <PageHeader
      label="Charter Buses"
      title={<>Chicago <span className="gradient-text font-semibold">Charter Bus</span> Rental</>}
      subtitle="Reliable and comfortable charter bus service for groups of all sizes."
    />

    <section className="pb-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          <div>
            <p className="text-muted-foreground leading-relaxed text-lg mb-8">
              Avital Chicago Limousine offers premium charter bus services for corporate outings, school trips, sports teams, and large group transportation needs throughout the Chicagoland area. Our charter buses provide comfortable, safe, and reliable transportation with professional drivers.
            </p>

            <div className="glass-card p-8 mb-8">
              <h3 className="font-serif text-xl text-foreground mb-6">Charter Bus Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-muted-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card-glow p-10 text-center">
              <Bus className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-foreground mb-4">Need a Charter Bus?</h3>
              <p className="text-muted-foreground mb-6">Contact us for custom charter bus quotes tailored to your group's needs.</p>
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

export default CharterBuses;
