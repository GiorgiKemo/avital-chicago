import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ManagedImage from "@/components/ManagedImage";
import PageHeader from "@/components/PageHeader";
import { getServiceImage, getServiceSlotKey, services } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Transportation Services",
  description:
    "Explore wedding, quinceanera, prom, nightlife, birthday, and charter transportation services across Chicagoland.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        label="Our Services"
        title={
          <>
            Premium{" "}
            <span className="gradient-text font-semibold">Transportation</span>{" "}
            Services
          </>
        }
        subtitle="From weddings to wild nights out, we have the right vehicle for every occasion."
      />

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group glass-card overflow-hidden"
              >
                <div className="image-hover-zoom relative aspect-[3/2]">
                  <ManagedImage
                    slotKey={getServiceSlotKey(service.slug)}
                    fallbackSrc={getServiceImage(service.slug)}
                    fallbackAlt={service.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <span className="absolute left-4 top-4 font-serif text-3xl font-semibold gradient-text">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="mb-2 font-serif text-xl text-foreground">
                    {service.name}
                  </h2>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {service.shortDescription}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary transition-all group-hover:gap-2">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
