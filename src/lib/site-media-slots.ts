import { limousines, partyBuses } from "@/lib/data";

export type SiteMediaPageDefinition = {
  key: string;
  label: string;
  path?: string;
  description?: string;
  supportsGallery?: boolean;
  galleryDescription?: string;
  defaultGalleryCount?: number;
};

export type SiteMediaSlotDefinition = {
  key: string;
  label: string;
  section: string;
  page: SiteMediaPageDefinition;
  description?: string;
  defaultSrc: string;
  defaultAlt: string;
};

function createPage(
  key: string,
  label: string,
  path?: string,
  description?: string,
  options?: Pick<
    SiteMediaPageDefinition,
    "supportsGallery" | "galleryDescription" | "defaultGalleryCount"
  >,
): SiteMediaPageDefinition {
  return {
    key,
    label,
    path,
    description,
    ...options,
  };
}

function normalizePathToKey(path: string) {
  return path.replace(/^\//, "").replace(/\//g, ".");
}

export function getSiteMediaPageKey(path: string) {
  return `page.${normalizePathToKey(path)}`;
}

export function getVehiclePageKey(basePath: string, slug: string) {
  return getSiteMediaPageKey(`${basePath}/${slug}`);
}

export function getVehicleHeroSlotKey(basePath: string, slug: string) {
  return `${getVehiclePageKey(basePath, slug)}.hero`;
}

const brandPage = createPage(
  "global.brand",
  "Global Branding",
  undefined,
  "These assets appear across the site in the header and footer.",
);

const homepagePage = createPage(
  "home",
  "Homepage",
  "/",
  "Main homepage hero rotation.",
);

const partyBusFleetPage = createPage(
  "fleet.party-bus",
  "Party Bus Fleet Page",
  "/chicago-party-bus-rental",
  "Main landing page for the full Chicago party bus fleet.",
);

const limoFleetPage = createPage(
  "fleet.limo",
  "Limo Fleet Page",
  "/chicago-limo-rental",
  "Main landing page for the limousine fleet.",
);

const kidsPage = createPage(
  "kids.party-bus",
  "Kids Party Bus Page",
  "/kids-party-bus",
  "Dedicated kids party bus landing page.",
);

const serviceSlots: SiteMediaSlotDefinition[] = [
  [
    "wedding",
    "Wedding Packages",
    "/images/cars-limo-107.webp",
    "Wedding limo service",
  ],
  [
    "quinceanera",
    "Quinceañera",
    "/images/images-1010.webp",
    "Quinceañera limousine service",
  ],
  [
    "night-parties",
    "Night Out Parties",
    "/images/limo-car-images-1001.webp",
    "Night out party bus interior",
  ],
  [
    "prom",
    "Prom Night",
    "/images/images-2020.webp",
    "Prom limousine service",
  ],
  [
    "bachelor-bachelorette",
    "Bachelor & Bachelorette",
    "/images/image%20(3).webp",
    "Bachelor and bachelorette party bus service",
  ],
  [
    "concerts-sports",
    "Concerts & Sports Events",
    "/images/limo-car-images-1005.webp",
    "Concert and sports limousine service",
  ],
  [
    "birthday",
    "Birthday Celebrations",
    "/images/limo-car-images-1003.webp",
    "Birthday party transportation",
  ],
  [
    "graduation",
    "Graduation Celebrations",
    "/images/gallery/lincoln-navigator/exterior/01.webp",
    "Graduation limousine service",
  ],
  [
    "kids-party-bus",
    "Kids Party Bus",
    "/images/Kids%20Party%20Bus%20image-101.webp",
    "Kids party bus transportation",
  ],
].map(([slug, pageLabel, defaultSrc, defaultAlt]) => ({
  key: `service.${slug}`,
  label: "Page image",
  section: "Services",
  page: createPage(
    `service.${slug}`,
    String(pageLabel),
    `/services/${slug}`,
    `Primary image used on the ${pageLabel} service page and services index.`,
  ),
  description: "Shown on the service listing card and service detail hero.",
  defaultSrc: String(defaultSrc),
  defaultAlt: String(defaultAlt),
}));

const areaSlots: SiteMediaSlotDefinition[] = [
  ["aurora", "/images/areas/aurora/Aurora1.webp", "Aurora transportation service"],
  ["naperville", "/images/areas/naperville/Naperville1.webp", "Naperville transportation service"],
  ["joliet", "/images/areas/joliet/Joliet1.webp", "Joliet transportation service"],
  ["elgin", "/images/areas/elgin/Elgin1.webp", "Elgin transportation service"],
  ["waukegan", "/images/areas/waukegan/Waukegan1.webp", "Waukegan transportation service"],
  ["palatine", "/images/areas/palatine/Palatine1.webp", "Palatine transportation service"],
  ["arlington-heights", "/images/areas/arlington-heights/arlington-heights1.webp", "Arlington Heights transportation service"],
  ["schaumburg", "/images/areas/schaumburg/Schaumburg1.webp", "Schaumburg transportation service"],
  ["bloomington", "/images/areas/bloomington/Bloomington1.webp", "Bloomington transportation service"],
  ["bolingbrook", "/images/areas/bolingbrook/Bolingbrook1.webp", "Bolingbrook transportation service"],
  ["cicero", "/images/areas/cicero/Cicero1.webp", "Cicero transportation service"],
  ["decatur", "/images/areas/decatur/Decatur1.webp", "Decatur transportation service"],
  ["des-plaines", "/images/areas/des-plaines/des-plaines-1.webp", "Des Plaines transportation service"],
  ["evanston", "/images/areas/evanston/Evanston1.webp", "Evanston transportation service"],
  ["oak-lawn", "/images/areas/oak-lawn/oak-lawn-1.webp", "Oak Lawn transportation service"],
  ["orland-park", "/images/areas/orland-park/orland-park-1.webp", "Orland Park transportation service"],
  ["rockford", "/images/areas/rockford/Rockford1.webp", "Rockford transportation service"],
  ["skokie", "/images/areas/skokie/Skokie1.webp", "Skokie transportation service"],
].map(([slug, defaultSrc, defaultAlt]) => {
  const readableName = String(slug).replace(/-/g, " ");

  return {
    key: `area.${slug}`,
    label: "Area hero image",
    section: "Areas",
    page: createPage(
      `area.${slug}`,
      readableName.replace(/\b\w/g, (letter) => letter.toUpperCase()),
      `/areas-we-serve/${slug}`,
      "Used on the area page and related legacy service-area experiences.",
    ),
    description: "Shown on the area page hero and related local coverage sections.",
    defaultSrc: String(defaultSrc),
    defaultAlt: String(defaultAlt),
  };
});

const vehicleHeroSlots: SiteMediaSlotDefinition[] = [
  ...limousines.map((vehicle) => ({
    vehicle,
    basePath: "/chicago-limo-rental",
    section: "Vehicle Detail Pages",
    pageDescription: "Main hero image for this limousine detail page.",
  })),
  ...partyBuses.map((vehicle) => ({
    vehicle,
    basePath: "/chicago-party-bus-rental",
    section: "Vehicle Detail Pages",
    pageDescription: "Main hero image for this party bus detail page.",
  })),
].map(({ vehicle, basePath, section, pageDescription }) => {
  const pagePath = `${basePath}/${vehicle.slug}`;
  const defaultGalleryCount = vehicle.images.slice(1, 13).length;

  return {
    key: getVehicleHeroSlotKey(basePath, vehicle.slug),
    label: "Hero image",
    section,
    page: createPage(
      getVehiclePageKey(basePath, vehicle.slug),
      vehicle.name,
      pagePath,
      pageDescription,
      {
        supportsGallery: true,
        galleryDescription:
          "Manage the gallery visitors see on this vehicle detail page. Hero image stays above; gallery images appear in the gallery section below.",
        defaultGalleryCount,
      },
    ),
    description:
      "This is the first big image visitors see when they open this vehicle page.",
    defaultSrc:
      vehicle.images[0] || "/images/gallery/hummer-h2-triple-axle/exterior/01.webp",
    defaultAlt: `${vehicle.name} detail page hero image`,
  };
});

export const siteMediaSlots: SiteMediaSlotDefinition[] = [
  {
    key: "site.logo.header",
    label: "Header logo",
    section: "Global",
    page: brandPage,
    description: "Shown in the header across the website.",
    defaultSrc: "/images/logos/logo.webp",
    defaultAlt: "Avital Chicago logo",
  },
  {
    key: "site.logo.footer",
    label: "Footer logo",
    section: "Global",
    page: brandPage,
    description: "Shown in the footer across the website.",
    defaultSrc: "/images/logos/logo-footer.webp",
    defaultAlt: "Avital Chicago footer logo",
  },
  {
    key: "home.hero.1",
    label: "Hero image 1",
    section: "Homepage",
    page: homepagePage,
    description: "First image in the automatic homepage hero rotation.",
    defaultSrc: "/images/hero/hero-limo.webp",
    defaultAlt: "White limousine at night in downtown Chicago",
  },
  {
    key: "home.hero.2",
    label: "Hero image 2",
    section: "Homepage",
    page: homepagePage,
    description: "Second image in the automatic homepage hero rotation.",
    defaultSrc: "/images/hero/partybus-interior.webp",
    defaultAlt: "Luxury party bus interior with purple lighting",
  },
  {
    key: "home.hero.3",
    label: "Hero image 3",
    section: "Homepage",
    page: homepagePage,
    description: "Third image in the automatic homepage hero rotation.",
    defaultSrc: "/images/hero/hero-partybus.webp",
    defaultAlt: "Black party bus in downtown Chicago at night",
  },
  ...serviceSlots,
  {
    key: "fleet.party-bus.hero",
    label: "Hero image",
    section: "Fleet Pages",
    page: partyBusFleetPage,
    description: "Main fleet hero image for the party bus landing page.",
    defaultSrc: "/images/chicago-rental.webp",
    defaultAlt: "Chicago party bus landing page from the original Avital website",
  },
  {
    key: "fleet.party-bus.spotlight",
    label: "Spotlight image",
    section: "Fleet Pages",
    page: partyBusFleetPage,
    description: "Side spotlight image on the party bus fleet page.",
    defaultSrc: "/images/party-car-in-limo.webp",
    defaultAlt: "Chicago party bus spotlight image from the original Avital website",
  },
  {
    key: "fleet.party-bus.pricing",
    label: "Pricing image",
    section: "Fleet Pages",
    page: partyBusFleetPage,
    description: "Image paired with the party bus pricing section.",
    defaultSrc: "/images/whitecolorbuses.webp",
    defaultAlt: "Chicago party bus pricing section image from the original Avital website",
  },
  {
    key: "fleet.limo.hero",
    label: "Hero image",
    section: "Fleet Pages",
    page: limoFleetPage,
    description: "Main fleet hero image for the limousine landing page.",
    defaultSrc: "/images/carslimos.webp",
    defaultAlt: "Chicago limousine landing page from the original Avital website",
  },
  {
    key: "fleet.limo.spotlight",
    label: "Spotlight image",
    section: "Fleet Pages",
    page: limoFleetPage,
    description: "Side spotlight image on the limo fleet page.",
    defaultSrc: "/images/whitecolorlimo.webp",
    defaultAlt: "Chicago limousine spotlight image from the original Avital website",
  },
  {
    key: "kids.hero",
    label: "Hero image",
    section: "Kids Page",
    page: kidsPage,
    description: "Primary hero image for the kids party bus page.",
    defaultSrc: "/images/Kids%20Party%20Bus%20image-101.webp",
    defaultAlt: "Kids party bus rental in Chicago",
  },
  {
    key: "kids.interior",
    label: "Interior image",
    section: "Kids Page",
    page: kidsPage,
    description: "Interior image for the kids page experience section.",
    defaultSrc: "/images/Kids%20Party%20Bus%20image-102.webp",
    defaultAlt: "Kids party bus interior",
  },
  {
    key: "kids.experience",
    label: "Experience image",
    section: "Kids Page",
    page: kidsPage,
    description: "Supporting image for the kids page experience section.",
    defaultSrc: "/images/Kids%20Party%20Bus%20image-103.webp",
    defaultAlt: "Kids party bus event experience",
  },
  ...areaSlots,
  ...vehicleHeroSlots,
];

export const siteMediaSlotMap = new Map(
  siteMediaSlots.map((slot) => [slot.key, slot]),
);

export const siteMediaPages = Array.from(
  new Map(siteMediaSlots.map((slot) => [slot.page.key, slot.page])).values(),
);

export const siteMediaPageMap = new Map(
  siteMediaPages.map((page) => [page.key, page]),
);

export function getSiteMediaSlotDefinition(slotKey: string) {
  return siteMediaSlotMap.get(slotKey) ?? null;
}

export function getSiteMediaPageDefinition(pageKey: string) {
  return siteMediaPageMap.get(pageKey) ?? null;
}

export type SiteMediaSlotAssignment = {
  slotKey: string;
  src: string;
  alt: string;
  bucketPath: string | null;
  updatedAt: string | null;
};

export type SiteMediaGalleryAssignment = {
  pageKey: string;
  position: number;
  src: string;
  alt: string;
  bucketPath: string;
  updatedAt: string | null;
};
