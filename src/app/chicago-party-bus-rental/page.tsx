import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import QuoteForm from "@/components/QuoteForm";
import VehicleCard from "@/components/VehicleCard";
import { partyBuses } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Chicago Party Bus Rental",
  description:
    "Browse Avital Chicago's party bus fleet with real vehicle galleries, passenger counts, and event-ready luxury interiors.",
};

export default function PartyBusFleetPage() {
  return (
    <>
      <PageHeader
        label="Party Bus Fleet"
        title={
          <>
            Chicago <span className="gradient-text font-semibold">Party Bus</span>{" "}
            Rental
          </>
        }
        subtitle="Browse our party bus lineup and explore the image galleries for each model."
      />

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {partyBuses.map((vehicle) => (
                <VehicleCard
                  key={vehicle.slug}
                  vehicle={vehicle}
                  basePath="/chicago-party-bus-rental"
                />
              ))}
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
