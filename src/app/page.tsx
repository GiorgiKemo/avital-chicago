import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Crown,
  DollarSign,
  Shield,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import HomeHero from "@/components/HomeHero";
import QuoteForm from "@/components/QuoteForm";
import VehicleCard from "@/components/VehicleCard";
import { limousines, partyBuses, services } from "@/lib/site-data";
import { getHomepageServiceCardImage } from "@/lib/site-data";

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <section className="px-6 py-12 lg:hidden">
        <div className="container mx-auto">
          <QuoteForm />
        </div>
      </section>

      <section className="relative py-24">
        <div className="blur-orb -left-60 -top-60 h-[600px] w-[600px]" />
        <div className="container relative z-10 mx-auto px-6">
          <div className="mb-16 text-center">
            <p className="pink-label mb-4">Our Services</p>
            <h2 className="section-heading">
              Unforgettable{" "}
              <span className="gradient-text font-semibold">Experiences</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {services.slice(0, 3).map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group relative h-[450px] overflow-hidden rounded-xl"
              >
                <div className="image-hover-zoom absolute inset-0">
                  <Image
                    src={getHomepageServiceCardImage(service.slug)}
                    alt={service.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={95}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-serif text-2xl text-foreground">
                    {service.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {service.shortDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-divider" />

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <p className="pink-label mb-4">Our Fleet</p>
            <h2 className="section-heading">
              Premium <span className="gradient-text font-semibold">Vehicles</span>
            </h2>
          </div>

          <div className="mb-16">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3 className="font-serif text-2xl text-foreground">Party Buses</h3>
              <Link
                href="/chicago-party-bus-rental"
                className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {partyBuses.slice(0, 3).map((vehicle) => (
                <VehicleCard
                  key={vehicle.slug}
                  vehicle={vehicle}
                  basePath="/chicago-party-bus-rental"
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3 className="font-serif text-2xl text-foreground">Limousines</h3>
              <Link
                href="/chicago-limo-rental"
                className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {limousines.slice(0, 3).map((vehicle) => (
                <VehicleCard
                  key={vehicle.slug}
                  vehicle={vehicle}
                  basePath="/chicago-limo-rental"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="gradient-divider" />

      <section className="relative py-24">
        <div className="blur-orb right-0 top-0 h-[500px] w-[500px]" />
        <div className="container relative z-10 mx-auto px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <p className="pink-label mb-4">About Us</p>
              <h2 className="section-heading mb-6">
                Chicago&apos;s Most{" "}
                <span className="gradient-text font-semibold">Trusted</span>{" "}
                Transportation
              </h2>
              <p className="mb-6 leading-relaxed text-muted-foreground">
                Avital Chicago Limousine And Party Bus is built around luxury
                group transportation for weddings, quinceaneras, proms, nights
                out, concerts, and private events throughout Chicagoland.
              </p>
              <p className="mb-8 leading-relaxed text-muted-foreground">
                Our fleet pairs bold vehicle choices with professional chauffeur
                service, premium interiors, and image-rich galleries that help
                clients pick the right vehicle before they book.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Weddings",
                  "Quinceañeras",
                  "Night Parties",
                  "Prom",
                  "Concerts",
                  "Birthdays",
                ].map((item) => (
                  <Link
                    key={item}
                    href="/services"
                    className="glass-card px-4 py-3 text-sm text-muted-foreground transition-all hover:border-primary/20 hover:text-foreground"
                  >
                    {item} {"->"}
                  </Link>
                ))}
              </div>
            </div>

            <div className="glass-card p-8">
              <h3 className="mb-8 font-serif text-xl text-foreground">
                Vehicle Features
              </h3>
              {[
                {
                  icon: Sparkles,
                  title: "Premium Interior",
                  desc: "Leather seating with layered lighting and polished trim.",
                },
                {
                  icon: Star,
                  title: "Entertainment",
                  desc: "Sound systems, flat screens, and event-ready lighting.",
                },
                {
                  icon: Crown,
                  title: "Bar Service",
                  desc: "Built-in bars and lounge layouts across much of the fleet.",
                },
                {
                  icon: Award,
                  title: "Party Ready",
                  desc: "Vehicles designed for birthdays, proms, and private events.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="mb-6 flex items-start gap-4 last:mb-0"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-0.5 text-sm font-medium text-foreground">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="gradient-divider" />

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <p className="pink-label mb-4">Why Choose Us</p>
            <h2 className="section-heading">
              The Avital <span className="gradient-text font-semibold">Difference</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                num: "01",
                icon: Shield,
                title: "Professional Service",
                desc: "Licensed, insured chauffeurs focused on safety and timing.",
              },
              {
                num: "02",
                icon: Sparkles,
                title: "Custom Interiors",
                desc: "Premium cabins with lighting, lounge seating, and entertainment.",
              },
              {
                num: "03",
                icon: DollarSign,
                title: "Affordable Rates",
                desc: "Competitive pricing without flattening the experience.",
              },
              {
                num: "04",
                icon: Wrench,
                title: "Upgraded Fleet",
                desc: "Large image-backed inventory with multiple vehicle styles.",
              },
              {
                num: "05",
                icon: Crown,
                title: "Classy Models",
                desc: "A fleet built for weddings, nightlife, and formal events alike.",
              },
              {
                num: "06",
                icon: Award,
                title: "Experienced Chauffeurs",
                desc: "Drivers trained for event-day reliability and polished service.",
              },
            ].map((card) => (
              <div
                key={card.num}
                className="glass-card p-8 transition-all duration-300 hover:border-primary/20"
              >
                <span className="gradient-text font-serif text-3xl font-semibold">
                  {card.num}
                </span>
                <div className="mb-4 mt-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-foreground">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-divider" />

      <section className="relative py-24 text-center">
        <div className="blur-orb left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2" />
        <div className="container relative z-10 mx-auto px-6">
          <p className="pink-label mb-4">Book Today</p>
          <h2 className="section-heading mb-8">
            Ready to Experience{" "}
            <span className="gradient-text font-semibold">Luxury</span>?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact-us" className="btn-primary">
              Get a Free Quote <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="tel:6305506753" className="btn-outline">
              Call (630) 550-6753 <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
