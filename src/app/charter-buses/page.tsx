import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bus, Check } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import QuoteForm from "@/components/QuoteForm";
import { shuttleBus } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Charter Buses",
  description:
    "Reliable and comfortable charter bus service for weddings, school trips, corporate travel, and large group transportation.",
};

export default function CharterBusesPage() {
  return (
    <>
      <PageHeader
        label="Charter Buses"
        title={
          <>
            Chicago <span className="gradient-text font-semibold">Charter Bus</span>{" "}
            Rental
          </>
        }
        subtitle="Reliable and comfortable charter bus service for groups of all sizes."
      />

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="relative mb-8 aspect-[16/8] overflow-hidden rounded-2xl">
                <Image
                  src={shuttleBus.images[0] || "/images/hero/hero-partybus.jpg"}
                  alt={shuttleBus.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 900px"
                />
              </div>

              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                Avital Chicago Limousine offers premium charter bus service for
                corporate outings, school trips, wedding guest movement, sports
                teams, and large-group transportation throughout Chicagoland.
              </p>

              <div className="glass-card mb-8 p-8">
                <h2 className="mb-6 font-serif text-xl text-foreground">
                  Charter Bus Features
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {shuttleBus.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card-glow p-10 text-center">
                <Bus className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h2 className="mb-4 font-serif text-2xl text-foreground">
                  Need a Charter Bus?
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Contact us for a custom quote tailored to your group, route, and schedule.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/contact-us" className="btn-primary">
                    Get a Quote <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a href="tel:6305506753" className="btn-outline">
                    Call Us <ArrowRight className="h-4 w-4" />
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
}
