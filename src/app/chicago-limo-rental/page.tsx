import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import QuoteForm from "@/components/QuoteForm";
import VehicleCard from "@/components/VehicleCard";
import { limousines } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Chicago Limousine Rental",
  description:
    "Explore Avital Chicago's limousine fleet, including Escalade, Hummer, Infiniti, and Lincoln stretch limos.",
};

export default function LimoFleetPage() {
  return (
    <>
      <PageHeader
        label="Limousine Fleet"
        title={
          <>
            Chicago <span className="gradient-text font-semibold">Limousine</span>{" "}
            Rental
          </>
        }
        subtitle="Luxury stretch limousines for weddings, proms, nights out, and private events."
      />

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {limousines.map((vehicle) => (
                <VehicleCard
                  key={vehicle.slug}
                  vehicle={vehicle}
                  basePath="/chicago-limo-rental"
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
