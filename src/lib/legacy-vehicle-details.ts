import legacyVehicleDetails from "@/lib/legacy-vehicle-details.json";
import type { LegacyVehicleDetail } from "@/types";

const legacyVehicleDetailList = legacyVehicleDetails as LegacyVehicleDetail[];
const legacyVehicleDetailMap = new Map(
  legacyVehicleDetailList.map((detail) => [detail.slug, detail]),
);

export function getLegacyVehicleDetail(slug: string) {
  return legacyVehicleDetailMap.get(slug);
}

export { legacyVehicleDetailList };
