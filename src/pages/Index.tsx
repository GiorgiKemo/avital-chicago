import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Calendar, Sparkles, Shield, Wrench, DollarSign, Crown, Award } from 'lucide-react';
import QuoteForm from '@/components/QuoteForm';
import heroPartyBus from '@/assets/hero-partybus.jpg';
import heroLimo from '@/assets/hero-limo.jpg';
import partybusInterior from '@/assets/partybus-interior.jpg';
import serviceWedding from '@/assets/service-wedding.jpg';
import serviceQuinceanera from '@/assets/service-quinceanera.jpg';
import serviceNightout from '@/assets/service-nightout.jpg';

const heroImages = [heroPartyBus, heroLimo, partybusInterior];

const Index = () => {
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setHeroIdx(i => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center overflow-hidden">
        {heroImages.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === heroIdx ? 1 : 0 }}
          >
            <img src={img} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/40" />
        <div className="blur-orb w-[500px] h-[500px] bottom-0 left-1/4" />

        <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="pink-label mb-6">Chicago's Premier Transportation</p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] mb-8">
              Luxury<br />
              <span className="gradient-text font-semibold">Party Bus</span><br />
              & Limousine
            </h1>

            <div className="flex flex-wrap gap-6 mb-10">
              {[
                { icon: Calendar, label: '500+', sub: 'Events' },
                { icon: Users, label: '36', sub: 'Max Passengers' },
                { icon: Star, label: '5.0', sub: 'Star Rating' },
              ].map((badge) => (
                <div key={badge.sub} className="glass-card px-5 py-3 flex items-center gap-3">
                  <badge.icon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-lg font-semibold text-foreground leading-none">{badge.label}</p>
                    <p className="text-xs text-muted-foreground">{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/chicago-party-bus-rental" className="btn-primary">
                Explore Fleet <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:6305506753" className="btn-outline">
                Call Now <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <QuoteForm />
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 relative">
        <div className="blur-orb w-[600px] h-[600px] -top-60 -left-60" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <p className="pink-label mb-4">Our Services</p>
            <h2 className="section-heading">
              Unforgettable <span className="gradient-text font-semibold">Experiences</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: serviceWedding, title: 'Wedding Packages', sub: 'Elegant arrivals for your perfect day', slug: 'wedding' },
              { img: serviceQuinceanera, title: 'Quinceañera Season', sub: 'Celebrate in grand style', slug: 'quinceanera' },
              { img: serviceNightout, title: 'Night Out', sub: 'Turn heads wherever you go', slug: 'night-parties' },
            ].map((card) => (
              <Link key={card.slug} to={`/services/${card.slug}`} className="group relative rounded-xl overflow-hidden h-[450px] image-hover-zoom">
                <img src={card.img} alt={card.title} className="w-full h-full object-cover" loading="lazy" width={800} height={1000} />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl text-foreground mb-1">{card.title}</h3>
                  <p className="text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">{card.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* FLEET PREVIEW */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="pink-label mb-4">Our Fleet</p>
            <h2 className="section-heading">
              Premium <span className="gradient-text font-semibold">Vehicles</span>
            </h2>
          </div>

          {['Party Buses', 'Limousines'].map((category) => (
            <div key={category} className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-2xl text-foreground">{category}</h3>
                <Link
                  to={category === 'Party Buses' ? '/chicago-party-bus-rental' : '/chicago-limo-rental'}
                  className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="group rounded-xl overflow-hidden image-hover-zoom glass-card">
                    <div className="aspect-[4/3] relative">
                      <img
                        src={category === 'Party Buses' ? heroPartyBus : heroLimo}
                        alt={`${category} ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={600}
                        height={450}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="gradient-divider" />

      {/* ABOUT */}
      <section className="py-24 relative">
        <div className="blur-orb w-[500px] h-[500px] top-0 right-0" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="pink-label mb-4">About Us</p>
              <h2 className="section-heading mb-6">
                Chicago's Most <span className="gradient-text font-semibold">Trusted</span> Transportation
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Avital Chicago Limousine And Party Bus is the Chicagoland area's premier luxury transportation provider. 
                With an extensive fleet of meticulously maintained party buses and limousines, we deliver unforgettable 
                experiences for weddings, quinceañeras, proms, corporate events, and nights out on the town.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Our professional chauffeurs are licensed, insured, and dedicated to providing the highest level of service. 
                Every vehicle features state-of-the-art entertainment systems, premium leather interiors, and custom LED lighting.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {['Weddings', 'Quinceañeras', 'Night Parties', 'Prom', 'Concerts', 'Birthdays'].map(s => (
                  <Link key={s} to="/services" className="glass-card px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all">
                    {s} →
                  </Link>
                ))}
              </div>
            </div>

            <div className="glass-card p-8">
              <h3 className="font-serif text-xl text-foreground mb-8">Vehicle Features</h3>
              {[
                { icon: Sparkles, title: 'Premium Interior', desc: 'Leather seating with fiber optic ceilings' },
                { icon: Star, title: 'Entertainment', desc: 'Surround sound, flat screens, laser lights' },
                { icon: Crown, title: 'Bar Service', desc: 'Built-in bars with glassware' },
                { icon: Award, title: 'Party Ready', desc: 'Dancing poles, fog machines, LED floors' },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-4 mb-6 last:mb-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-foreground font-medium text-sm mb-0.5">{f.title}</h4>
                    <p className="text-muted-foreground text-sm">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* WHY CHOOSE US */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="pink-label mb-4">Why Choose Us</p>
            <h2 className="section-heading">
              The Avital <span className="gradient-text font-semibold">Difference</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: '01', icon: Shield, title: 'Professional Service', desc: 'Licensed, insured chauffeurs committed to your safety and comfort.' },
              { num: '02', icon: Sparkles, title: 'Custom Interiors', desc: 'Hand-crafted luxury interiors with premium materials and finishes.' },
              { num: '03', icon: DollarSign, title: 'Affordable Rates', desc: 'Competitive pricing without compromising on quality or experience.' },
              { num: '04', icon: Wrench, title: 'Latest Upgrades', desc: 'Continuously updated entertainment and comfort systems.' },
              { num: '05', icon: Crown, title: 'Classy Models', desc: 'The newest and most stylish vehicles in the Chicagoland area.' },
              { num: '06', icon: Award, title: 'Licensed Chauffeurs', desc: 'Background-checked, professionally trained drivers.' },
            ].map((card) => (
              <div key={card.num} className="glass-card p-8 group hover:border-primary/20 transition-all duration-300">
                <span className="text-3xl font-serif gradient-text font-semibold">{card.num}</span>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mt-4 mb-4">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-foreground font-medium text-lg mb-2">{card.title}</h3>
                <p className="text-muted-foreground text-sm">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* CTA */}
      <section className="py-24 relative text-center">
        <div className="blur-orb w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="container mx-auto px-6 relative z-10">
          <p className="pink-label mb-4">Book Today</p>
          <h2 className="section-heading mb-8">
            Ready to Experience <span className="gradient-text font-semibold">Luxury</span>?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact-us" className="btn-primary">
              Get a Free Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:6305506753" className="btn-outline">
              Call (630) 550-6753 <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Mobile Quote Form */}
      <section className="lg:hidden py-12 px-6">
        <QuoteForm />
      </section>
    </>
  );
};

export default Index;
