import type { BlogPost } from "@/types";
import legacyBlogPosts from "@/lib/legacy-blog-posts.json";
import legacyServices from "@/lib/legacy-services.json";
import {
  allVehicles,
  areas,
  limousines,
  partyBuses,
  services as baseServices,
  shuttleBus,
} from "@/lib/data";

const defaultPartyBusImage = "/images/hero/hero-partybus.jpg";
const defaultLimoImage = "/images/hero/hero-limo.jpg";
const defaultServiceImage = "/images/hero/service-wedding.jpg";

export const blogPosts: BlogPost[] = legacyBlogPosts as BlogPost[];
const legacyServicesBySlug = new Map(
  (legacyServices as Array<{ slug: string; pageTitle?: string; metaDescription?: string; contentHtml?: string }>).map(
    (service) => [service.slug, service],
  ),
);

export const services = baseServices.map((service) => ({
  ...service,
  ...legacyServicesBySlug.get(service.slug),
}));

const serviceImageMap: Record<string, string> = {
  wedding: "/images/hero/service-wedding.jpg",
  quinceanera: "/images/hero/service-quinceanera.jpg",
  "night-parties": "/images/hero/service-nightout.jpg",
  prom: "/images/services/chicago-prom-party.webp",
  "bachelor-bachelorette":
    "/images/services/bachelor-bachelorette-party-limousine.webp",
  "concerts-sports": "/images/services/chicago-limo-rental-services.webp",
  birthday: "/images/services/birthday-party.webp",
  graduation: "/images/services/chicago-limo-rental-services.webp",
  "kids-party-bus": defaultPartyBusImage,
};

const areaImageMap: Record<string, string> = {
  aurora: "/images/areas/aurora/Aurora1.png",
  naperville: "/images/areas/naperville/Naperville1.png",
  joliet: "/images/areas/joliet/Joliet1.png",
  elgin: "/images/areas/elgin/Elgin1.png",
  waukegan: "/images/areas/waukegan/Waukegan1.png",
  palatine: "/images/areas/palatine/Palatine1.png",
  "arlington-heights": "/images/areas/arlington-heights/arlington-heights1.png",
  schaumburg: "/images/areas/schaumburg/Schaumburg1.png",
  bloomington: "/images/areas/bloomington/Bloomington1.png",
  bolingbrook: "/images/areas/bolingbrook/Bolingbrook1.png",
  cicero: "/images/areas/cicero/Cicero1.png",
  decatur: "/images/areas/decatur/Decatur1.png",
  "des-plaines": "/images/areas/des-plaines/des-plaines-1.png",
  evanston: "/images/areas/evanston/Evanston1.png",
  "oak-lawn": "/images/areas/oak-lawn/oak-lawn-1.png",
  "orland-park": "/images/areas/orland-park/orland-park-1.png",
  rockford: "/images/areas/rockford/Rockford1.png",
  skokie: "/images/areas/skokie/Skokie1.png",
};

export function getServiceImage(slug: string) {
  return serviceImageMap[slug] || defaultServiceImage;
}

export function getAreaImage(slug: string) {
  return areaImageMap[slug] || defaultLimoImage;
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getPartyBusBySlug(slug: string) {
  return partyBuses.find((vehicle) => vehicle.slug === slug);
}

export function getLimoBySlug(slug: string) {
  return limousines.find((vehicle) => vehicle.slug === slug);
}

export function getVehicleBySlug(slug: string) {
  return allVehicles.find((vehicle) => vehicle.slug === slug);
}

export {
  allVehicles,
  areas,
  limousines,
  partyBuses,
  shuttleBus,
};
