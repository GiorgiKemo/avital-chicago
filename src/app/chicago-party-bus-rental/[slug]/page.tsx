import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VehicleDetailPage from "@/components/VehicleDetailPage";
import { cleanLegacyText } from "@/lib/clean-legacy-text";
import { getLegacyVehicleDetail } from "@/lib/legacy-vehicle-details";
import { getPartyBusBySlug, partyBuses } from "@/lib/site-data";

export function generateStaticParams() {
  return partyBuses.map((vehicle) => ({ slug: vehicle.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const vehicle = getPartyBusBySlug(slug);

    if (!vehicle) {
      return { title: "Party Bus Not Found" };
    }

    const legacyDetail = getLegacyVehicleDetail(slug);

    return {
      title:
        cleanLegacyText(legacyDetail?.pageTitle) || `${vehicle.name} Party Bus`,
      description:
        cleanLegacyText(legacyDetail?.metaDescription) || vehicle.description,
    };
  });
}

export default async function PartyBusDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = getPartyBusBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const relatedVehicles = partyBuses
    .filter((candidate) => candidate.slug !== vehicle.slug)
    .slice(0, 3);

  return (
    <VehicleDetailPage
      basePath="/chicago-party-bus-rental"
      backLabel="Back to Party Bus Fleet"
      fleetLabel="Party Bus Detail"
      vehicle={vehicle}
      relatedVehicles={relatedVehicles}
    />
  );
}
