import { partyBuses } from '@/data/vehicles';
import VehicleCard from '@/components/VehicleCard';
import PageHeader from '@/components/PageHeader';
import QuoteForm from '@/components/QuoteForm';

const PartyBusFleet = () => (
  <>
    <PageHeader
      label="Party Bus Fleet"
      title={<>Chicago <span className="gradient-text font-semibold">Party Bus</span> Rental</>}
      subtitle="Browse our stunning collection of party buses, each uniquely designed for an unforgettable experience."
    />

    <section className="pb-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {partyBuses.map(v => (
              <VehicleCard key={v.slug} vehicle={v} basePath="/chicago-party-bus-rental" />
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

export default PartyBusFleet;
