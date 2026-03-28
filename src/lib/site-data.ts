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

const defaultPartyBusImage = "/images/gallery/hummer-h2-triple-axle/exterior/01.webp";
const defaultLimoImage = "/images/gallery/cadillac-escalade/exterior/01.webp";
const defaultServiceImage = "/images/gallery/cadillac-escalade/exterior/01.webp";

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
  wedding: "/images/gallery/cadillac-escalade/exterior/01.webp",
  quinceanera: "/images/gallery/hummer-h2-triple-axle/exterior/01.webp",
  "night-parties": "/images/gallery/tiffany-miami/interior/DSC03542-min.webp",
  prom: "/images/gallery/lincoln-navigator/exterior/01.webp",
  "bachelor-bachelorette":
    "/images/gallery/diamond/interior/DSC03601-min.webp",
  "concerts-sports": "/images/gallery/infiniti-qx56/exterior/01.webp",
  birthday: "/images/gallery/tiffany-miami/interior/DSC03542-min.webp",
  graduation: "/images/gallery/lincoln-navigator/exterior/01.webp",
  "kids-party-bus": defaultPartyBusImage,
};

const areaImageMap: Record<string, string> = {
  aurora: "/images/areas/aurora/Aurora1.webp",
  naperville: "/images/areas/naperville/Naperville1.webp",
  joliet: "/images/areas/joliet/Joliet1.webp",
  elgin: "/images/areas/elgin/Elgin1.webp",
  waukegan: "/images/areas/waukegan/Waukegan1.webp",
  palatine: "/images/areas/palatine/Palatine1.webp",
  "arlington-heights": "/images/areas/arlington-heights/arlington-heights1.webp",
  schaumburg: "/images/areas/schaumburg/Schaumburg1.webp",
  bloomington: "/images/areas/bloomington/Bloomington1.webp",
  bolingbrook: "/images/areas/bolingbrook/Bolingbrook1.webp",
  cicero: "/images/areas/cicero/Cicero1.webp",
  decatur: "/images/areas/decatur/Decatur1.webp",
  "des-plaines": "/images/areas/des-plaines/des-plaines-1.webp",
  evanston: "/images/areas/evanston/Evanston1.webp",
  "oak-lawn": "/images/areas/oak-lawn/oak-lawn-1.webp",
  "orland-park": "/images/areas/orland-park/orland-park-1.webp",
  rockford: "/images/areas/rockford/Rockford1.webp",
  skokie: "/images/areas/skokie/Skokie1.webp",
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
