import { limousines } from '@/data/vehicles';
import VehicleCard from '@/components/VehicleCard';
import PageHeader from '@/components/PageHeader';
import QuoteForm from '@/components/QuoteForm';

const LimoFleet = () => (
  <>
    <PageHeader
      label="Limousine Fleet"
      title={<>Chicago <span className="gradient-text font-semibold">Limousine</span> Rental</>}
      subtitle="Our luxury limousine collection features the finest stretch limos in Chicagoland."
    />

    <section className="pb-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {limousines.map(v => (
              <VehicleCard key={v.slug} vehicle={v} basePath="/chicago-limo-rental" />
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

export default LimoFleet;
