import type { LegacyAreaService } from "@/types";
import legacyAreaServicesJson from "@/lib/legacy-area-services.json";

function repairMojibake(input: string) {
  if (!/[ÃÂâ]/.test(input)) {
    return input;
  }

  let current = input;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const repaired = Buffer.from(current, "latin1").toString("utf8");
    const currentScore = (current.match(/[ÃÂâ]/g) || []).length;
    const repairedScore = (repaired.match(/[ÃÂâ]/g) || []).length;

    if (repairedScore >= currentScore) {
      break;
    }

    current = repaired;
  }

  return current;
}

function repairValue<T>(value: T): T {
  if (typeof value === "string") {
    return repairMojibake(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => repairValue(entry)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, repairValue(entry)]),
    ) as T;
  }

  return value;
}

export const legacyAreaServices = (legacyAreaServicesJson as LegacyAreaService[]).map(
  (entry) => repairValue(entry),
);

const legacyAreaServicesBySlug = new Map(
  legacyAreaServices.map((entry) => [entry.slug, entry]),
);

export function getLegacyAreaServiceBySlug(slug: string) {
  return legacyAreaServicesBySlug.get(slug);
}
