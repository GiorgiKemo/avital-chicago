import type { BlogPost } from "@/types";
import {
  allVehicles,
  areas,
  limousines,
  partyBuses,
  services,
  shuttleBus,
} from "@/lib/data";

const defaultPartyBusImage = "/images/hero/hero-partybus.jpg";
const defaultLimoImage = "/images/hero/hero-limo.jpg";
const defaultServiceImage = "/images/hero/service-wedding.jpg";

export const blogPosts: BlogPost[] = [
  {
    slug: "ultimate-guide-chicago-party-bus",
    title: "The Ultimate Guide to Renting a Party Bus in Chicago",
    excerpt:
      "Everything you need to know about choosing the right party bus for a Chicago celebration.",
    date: "2024-12-15",
    featuredImage: "/images/blog/chicago-theater.webp",
    content:
      "Planning a celebration in Chicago? A party bus rental can turn transportation into part of the event itself. Start with group size, then think about timing, number of stops, and the mood you want from the ride. The best bookings pair the right vehicle with realistic travel flow and enough room for the group to stay comfortable all night.",
  },
  {
    slug: "top-wedding-transportation-tips",
    title: "Top Wedding Transportation Tips for Chicago Couples",
    excerpt:
      "Practical advice for keeping wedding-day transportation elegant and stress-free.",
    date: "2024-11-28",
    featuredImage: "/images/blog/wedding-transportation-limo.webp",
    content:
      "Wedding transportation works best when it is planned early and built around the real timeline of the day. Leave buffer time for traffic, photos, and venue access. Decide whether you only need a limo for the wedding party or multiple vehicles for family and guest transfers. A polished transportation plan protects the rhythm of the whole event.",
  },
  {
    slug: "quinceanera-party-bus-ideas",
    title: "Quinceanera Party Bus Ideas for a Grand Celebration",
    excerpt:
      "Creative ways to make a quinceanera ride feel as memorable as the celebration itself.",
    date: "2024-11-10",
    featuredImage: "/images/hero/service-quinceanera.jpg",
    content:
      "A quinceanera party bus should feel special from the first pickup. Coordinated lighting, matching playlists, and a vehicle that keeps the court together can make the ride a real part of the celebration instead of just a transfer between venues.",
  },
  {
    slug: "chicago-nightlife-limo-guide",
    title: "Chicago Nightlife: Best Spots to Visit by Limo",
    excerpt:
      "A luxury route through some of Chicago's most popular nightlife districts.",
    date: "2024-10-22",
    featuredImage: "/images/blog/luxury-stretch-limousine.webp",
    content:
      "Chicago nightlife works especially well with a limo or party bus because it removes the stress between stops. River North, West Loop, and Gold Coast all become easier when your group can stay together and avoid parking or rideshare coordination.",
  },
  {
    slug: "what-is-a-party-bus",
    title: "What Is a Party Bus and When Should You Book One?",
    excerpt:
      "A quick breakdown of how party buses work and when they make the most sense.",
    date: "2024-09-18",
    featuredImage: "/images/blog/special-occasions-for-hire-a-limo.webp",
    content:
      "A party bus is a chauffeur-driven event vehicle that blends group transportation with lounge-style social space. It is a strong fit for birthdays, proms, bachelorette parties, concerts, and nights out when the ride should feel like part of the event.",
  },
  {
    slug: "top-perks-of-chauffeured-limo-rentals-in-chicago",
    title: "Top Perks of Chauffeured Limo Rentals in Chicago",
    excerpt:
      "Why chauffeured transportation still stands apart for formal events and city travel.",
    date: "2024-08-30",
    featuredImage: "/images/blog/limousine-driver.webp",
    content:
      "A chauffeur-driven limo brings more than a polished vehicle. It brings timing, coordination, and a smoother overall experience for events where presentation matters. That is why limos remain such a strong choice for weddings, anniversaries, executive pickups, and formal nights in the city.",
  },
];

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
  services,
  shuttleBus,
};
