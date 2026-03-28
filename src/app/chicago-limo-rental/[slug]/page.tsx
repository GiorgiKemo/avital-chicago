import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VehicleDetailPage from "@/components/VehicleDetailPage";
import { cleanLegacyText } from "@/lib/clean-legacy-text";
import { getLegacyVehicleDetail } from "@/lib/legacy-vehicle-details";
import { getLimoBySlug, limousines } from "@/lib/site-data";

export function generateStaticParams() {
  return limousines.map((vehicle) => ({ slug: vehicle.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const vehicle = getLimoBySlug(slug);

    if (!vehicle) {
      return { title: "Limousine Not Found" };
    }

    const legacyDetail = getLegacyVehicleDetail(slug);

    return {
      title:
        cleanLegacyText(legacyDetail?.pageTitle) || `${vehicle.name} Limousine`,
      description:
        cleanLegacyText(legacyDetail?.metaDescription) || vehicle.description,
    };
  });
}

export default async function LimoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = getLimoBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const relatedVehicles = limousines
    .filter((candidate) => candidate.slug !== vehicle.slug)
    .slice(0, 3);

  return (
    <VehicleDetailPage
      basePath="/chicago-limo-rental"
      backLabel="Back to Limo Fleet"
      fleetLabel="Limousine Detail"
      vehicle={vehicle}
      relatedVehicles={relatedVehicles}
    />
  );
}
