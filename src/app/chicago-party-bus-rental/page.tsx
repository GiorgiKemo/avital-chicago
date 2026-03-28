import type { Metadata } from "next";
import FleetLandingPage from "@/components/FleetLandingPage";
import { partyBusFleetContent } from "@/lib/fleet-page-content";
import { partyBuses } from "@/lib/site-data";

export const metadata: Metadata = {
  title: partyBusFleetContent.metaTitle,
  description: partyBusFleetContent.metaDescription,
};

export default function PartyBusFleetPage() {
  return (
    <FleetLandingPage
      basePath="/chicago-party-bus-rental"
      vehicles={partyBuses}
      content={partyBusFleetContent}
    />
  );
}
