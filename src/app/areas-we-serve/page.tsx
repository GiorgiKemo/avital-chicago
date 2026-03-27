import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { areas } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Areas We Serve",
  description:
    "Browse the Chicagoland areas where Avital Chicago provides party bus, limo, and group transportation service.",
};

export default function AreasWeServePage() {
  return (
    <>
      <PageHeader
        label="Service Areas"
        title={
          <>
            Areas We <span className="gradient-text font-semibold">Serve</span>
          </>
        }
        subtitle="Luxury limousine and party bus service across the greater Chicagoland area."
      />

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {areas.map((area) => (
              <Link
                key={area.slug}
                href={`/areas-we-serve/${area.slug}`}
                className="glass-card p-6 transition-all hover:border-primary/20"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 shrink-0 text-primary" />
                  <h2 className="font-medium text-foreground">{area.name}</h2>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                  {area.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
