import type { Metadata } from "next";
import FleetLandingPage from "@/components/FleetLandingPage";
import { limoFleetContent } from "@/lib/fleet-page-content";
import { limousines } from "@/lib/site-data";

export const metadata: Metadata = {
  title: limoFleetContent.metaTitle,
  description: limoFleetContent.metaDescription,
};

export default function LimoFleetPage() {
  return (
    <FleetLandingPage
      basePath="/chicago-limo-rental"
      vehicles={limousines}
      content={limoFleetContent}
    />
  );
}
