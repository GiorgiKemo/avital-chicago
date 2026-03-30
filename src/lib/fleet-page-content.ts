import type { Vehicle } from "@/types";

export interface FleetFeature {
  title: string;
  description: string;
}

export interface FleetFaq {
  question: string;
  answer: string;
}

export interface FleetLinkCard {
  title: string;
  description: string;
  href: string;
  cta: string;
}

export interface FleetLandingContent {
  label: string;
  titleLead: string;
  titleAccent: string;
  titleTrail: string;
  metaTitle: string;
  metaDescription: string;
  heroImage: string;
  heroAlt: string;
  introParagraphs: string[];
  useCasesTitle: string;
  useCasesDescription: string;
  useCaseLinks: Array<{ label: string; href: string }>;
  fleetHeading: string;
  fleetDescription: string;
  spotlightTitle: string;
  spotlightImage: string;
  spotlightAlt: string;
  spotlightParagraphs: string[];
  spotlightFeatures: FleetFeature[];
  featuresTitle: string;
  featuresDescription: string;
  featureBullets: string[];
  crossLinks: FleetLinkCard[];
  pricingTitle?: string;
  pricingImage?: string;
  pricingAlt?: string;
  pricingParagraphs?: string[];
  pricingBullets?: string[];
  closingTitle: string;
  closingParagraphs: string[];
  faqs: FleetFaq[];
  relatedPostSlugs: string[];
}

export const relatedFleetBlogSlugs = [
  "how-to-become-limo-driver-in-chicago",
  "can-you-smoke-weed-on-a-party-bus",
  "benefits-of-hiring-a-hummer-limo",
];

export const partyBusFleetContent: FleetLandingContent = {
  label: "Party Bus Fleet",
  titleLead: "Chicago",
  titleAccent: "Party Bus",
  titleTrail: "Rental",
  metaTitle: "Chicago Party Bus Rental",
  metaDescription:
    "Browse Avital Chicago's party bus fleet, event coverage, pricing notes, FAQs, and real galleries for each party bus model.",
  heroImage: "/images/chicago-rental.webp",
  heroAlt: "Chicago party bus landing page from the original Avital website",
  introParagraphs: [
    "Are you looking to hire a limo party bus in Chicago, or trying to understand the best rental prices in Chicagoland? You are in the right place.",
    "Our Chicago party bus service is built for birthdays, proms, weddings, bachelor and bachelorette parties, concerts, sports events, and nights out that need a bold arrival and a comfortable ride home.",
    "Pricing depends on the vehicle, hourly use, number of stops, mileage, and passenger count, so the best way to book is to start with the fleet and tell us what kind of event you are planning.",
  ],
  useCasesTitle: "Our Chicago Party Bus Service for Your Special Event",
  useCasesDescription:
    "Book a party bus for the occasions that matter most, from elegant celebrations to full-energy nights around Chicago and the suburbs.",
  useCaseLinks: [
    { label: "Weddings", href: "/services/wedding" },
    { label: "Quinceañeras", href: "/services/quinceanera" },
    { label: "Night Parties", href: "/services/night-parties" },
    { label: "Prom", href: "/services/prom" },
    { label: "Birthdays", href: "/services/birthday" },
    { label: "Bachelor & Bachelorette", href: "/services/bachelor-bachelorette" },
    { label: "Concerts & Sports", href: "/services/concerts-sports" },
    { label: "Kids Party Bus", href: "/kids-party-bus" },
  ],
  fleetHeading: "Chicago Party Bus Fleet",
  fleetDescription:
    "Our fleet ranges from compact sprinter-style party buses to large-capacity showpiece buses with lounge seating, custom bars, television screens, and event-ready lighting.",
  spotlightTitle: "Standout Party Bus Styles",
  spotlightImage: "/images/party-car-in-limo.webp",
  spotlightAlt: "Chicago party bus spotlight image from the original Avital website",
  spotlightParagraphs: [
    "The old fleet page highlighted how different buses fit different moods and group sizes. That still holds true here: some buses are made for full-scale nightlife energy, while others are better for weddings, smaller guest lists, or more budget-conscious bookings.",
    "The Krystal, Miami, Versace, Lounge, Enclave, Venice, Martini, and Olympus lines were especially emphasized because they covered the broadest spread of capacity, lighting style, and price comfort.",
  ],
  spotlightFeatures: [
    {
      title: "Krystal, Exhibit, and Epic",
      description:
        "Large-capacity buses with multiple VIP sections, bold interiors, and the strongest visual impact for bigger groups.",
    },
    {
      title: "Miami, Versace, and Lounge",
      description:
        "Stylized interiors that fit weddings, bachelorettes, and themed celebrations where the ride itself is part of the event.",
    },
    {
      title: "Venice, Martini, and Olympus",
      description:
        "Smaller or more budget-conscious options that still keep the signature lighting, lounge feel, and premium finish.",
    },
  ],
  featuresTitle: "Our Professional Party Buses Feature",
  featuresDescription:
    "The old page focused heavily on the party experience inside the bus, not just the exterior. These are the features clients were most often booking around.",
  featureBullets: [
    "Custom laser and disco lighting integrated into bars, floors, and ceilings",
    "High-output sound systems designed for group celebrations on the move",
    "Main LED screens with supporting displays across the cabin",
    "VIP lounge sections, bars, and layouts built for social events",
    "Party-bus options for night parties, quinceaneras, prom, bachelor and bachelorette events, weddings, birthdays, concerts, and sports nights",
  ],
  crossLinks: [
    {
      title: "Looking For Charter Buses?",
      description:
        "Need a cleaner group-transport option for corporate events, guest shuttles, or larger move-the-group logistics?",
      href: "/charter-buses",
      cta: "View Charter Buses",
    },
    {
      title: "Looking For Limos?",
      description:
        "For weddings, executive events, and more formal arrivals, our stretch limo fleet offers a different kind of luxury.",
      href: "/chicago-limo-rental",
      cta: "View Limos",
    },
  ],
  pricingTitle: "Party Bus Rental Prices in Chicago",
  pricingImage: "/images/whitecolorbuses.webp",
  pricingAlt: "Chicago party bus pricing section image from the original Avital website",
  pricingParagraphs: [
    "Party bus pricing depends on how you plan to use the vehicle. The old site explained that the quote changes with timing, route shape, and vehicle size, and that is still the practical way to estimate it.",
    "Most bookings are priced hourly, with the exact total shaped by your pickup plan, passenger count, and how many stops or miles the itinerary needs.",
  ],
  pricingBullets: [
    "Day of the week and seasonal demand",
    "How many hours you need the bus",
    "Number of stops across Chicago or the suburbs",
    "Overall route mileage",
    "Passenger count and the size of bus required",
  ],
  closingTitle: "Choose the Best Chicago Party Bus in the Chicagoland Area",
  closingParagraphs: [
    "Whatever kind of celebration you are planning, our goal is to match you with the bus that fits your guest count, the feel of the event, and the level of luxury you want on the road.",
    "Start with the fleet, tell us about the route, and we will help you narrow the lineup into the strongest options instead of guessing from a generic rate card.",
  ],
  faqs: [
    {
      question: "What condition is the bus expected to be in?",
      answer:
        "Our buses are expected to be in premium condition, with clean interiors, strong sound systems, LED screens, lighting effects, and event-ready layouts that match the vehicle you booked.",
    },
    {
      question: "Can I view the party buses before making a reservation?",
      answer:
        "Yes. We welcome scheduled viewings so you can confirm that the bus size, interior style, and overall feel match your event before you commit.",
    },
    {
      question: "How far in advance should I book a party bus?",
      answer:
        "As early as possible. Weekends, prom season, and major event dates can fill up quickly, so earlier booking gives you the best shot at your preferred bus.",
    },
    {
      question: "What happens if the event runs longer than initially booked?",
      answer:
        "Extended time can often be arranged, but it is always better to discuss the possibility in advance so there is a plan in place if your event runs over.",
    },
    {
      question: "Is there a minimum rental period for party buses?",
      answer:
        "Yes, most party-bus bookings have minimums. The exact minimum depends on the date, event type, and vehicle you choose.",
    },
    {
      question: "Can I decorate the party bus for my event?",
      answer:
        "Usually yes, but the decoration plan should be cleared in advance so it fits vehicle rules and does not interfere with cleanup or safety.",
    },
    {
      question: "How do I reserve a party bus?",
      answer:
        "Start with the quote form or call us directly, share your date, passenger count, route, and event type, and we will guide you to the best-fit bus and booking details.",
    },
  ],
  relatedPostSlugs: relatedFleetBlogSlugs,
};

export const limoFleetContent: FleetLandingContent = {
  label: "Limousine Fleet",
  titleLead: "Chicago",
  titleAccent: "Limousine",
  titleTrail: "Rental",
  metaTitle: "Chicago Limousine Rental",
  metaDescription:
    "Explore Avital Chicago's limousine fleet with real limo galleries, event coverage, booking guidance, FAQs, and related planning content.",
  heroImage: "/images/carslimos.webp",
  heroAlt: "Chicago limousine landing page from the original Avital website",
  introParagraphs: [
    "If you are looking for limo service in Chicago, our fleet covers everything from executive SUV limos to stretch models built for weddings, nightlife, and milestone celebrations.",
    "We are a Chicago limo service designed around premium vehicles, professional chauffeurs, and flexible booking based on route, passenger count, and the kind of experience you want for the day.",
    "Whether you are planning a polished arrival or an all-night celebration, the goal is the same: match the right vehicle to the event instead of forcing one limo to fit every kind of booking.",
  ],
  useCasesTitle: "Limousine Rental Services for Your Party",
  useCasesDescription:
    "Our limo fleet is used across formal events, nightlife, celebrations, and group outings that still want a refined, chauffeur-driven arrival.",
  useCaseLinks: [
    { label: "Night Parties", href: "/services/night-parties" },
    { label: "Quinceañeras", href: "/services/quinceanera" },
    { label: "Prom", href: "/services/prom" },
    { label: "Bachelor & Bachelorette", href: "/services/bachelor-bachelorette" },
    { label: "Weddings", href: "/services/wedding" },
    { label: "Birthdays", href: "/services/birthday" },
    { label: "Concerts", href: "/services/concerts-sports" },
    { label: "Sports Events", href: "/services/concerts-sports" },
  ],
  fleetHeading: "Our SUV Limo Fleet in Chicago",
  fleetDescription:
    "The limo lineup focuses on stretch SUVs and executive-style limousines with strong interiors, clear capacity ranges, and enough variety to cover both intimate and larger bookings.",
  spotlightTitle: "Long Limos To Hire in Chicago Suburbs",
  spotlightImage: "/images/whitecolorlimo.webp",
  spotlightAlt: "Chicago limousine spotlight image from the original Avital website",
  spotlightParagraphs: [
    "The old limo page centered the fleet around real capacity expectations, from the 14-passenger Lincoln Navigator to the 30-passenger Triple Axle Hummer H2.",
    "That same structure still matters when choosing the fleet: smaller limos fit tighter guest lists and more formal plans, while the larger Hummer and Escalade options work better for bigger wedding parties, prom groups, and nightlife bookings.",
  ],
  spotlightFeatures: [
    {
      title: "30 Passenger Hummer H2 Triple Axle",
      description:
        "The largest limousine option in the fleet, built for groups that want stretch-limo presence with high-capacity seating.",
    },
    {
      title: "25 Passenger Hummer Variants",
      description:
        "Double Axle and White Pearl Hummer options give you standout arrivals with strong capacity and a more dramatic SUV-limo feel.",
    },
    {
      title: "20 and 14 Passenger Executive Options",
      description:
        "Cadillac Escalade, Infiniti QX56, and Lincoln Navigator models give you premium arrivals for weddings, dates, and polished event transport.",
    },
  ],
  featuresTitle: "Our Limousines Features",
  featuresDescription:
    "The old limo page leaned hard into the interior experience. These are the features that defined the limo fleet there and still describe the core offer well.",
  featureBullets: [
    "Lavish leather interiors and executive-style SUV limousine finishes",
    "Disco-raised floors, lighting effects, and built-in laser shows on event-focused models",
    "Television screens across the cabin for entertainment on the ride",
    "Powerful sound systems for parties, celebrations, and nights out",
    "Professional licensed chauffeurs and luxury touches that elevate weddings, birthdays, and private events",
  ],
  crossLinks: [
    {
      title: "Looking For Party Buses?",
      description:
        "If your group size is growing or you want a more nightlife-focused interior, the party bus fleet may be a better fit.",
      href: "/chicago-party-bus-rental",
      cta: "View Party Buses",
    },
    {
      title: "Looking For Charter Buses?",
      description:
        "For guest transportation, corporate routes, and cleaner group logistics, our charter options cover the practical side of luxury transport.",
      href: "/charter-buses",
      cta: "View Charter Buses",
    },
  ],
  closingTitle: "Get a Free Limo Rental Quote Today",
  closingParagraphs: [
    "At the end of the day, the right limo booking comes down to your date, passenger count, route, and the kind of arrival you want to make.",
    "Tell us about the event, and we will help narrow the fleet to the limousines that actually fit your plan instead of leaving you to guess from capacity numbers alone.",
  ],
  faqs: [
    {
      question: "What are the benefits of hiring a limo service?",
      answer:
        "A professional limo service gives you punctual transport, a polished vehicle, a trained chauffeur, and a better group experience for events where arrival matters just as much as the destination.",
    },
    {
      question: "How do I make a reservation for a limousine?",
      answer:
        "You can reserve by sending a quote request or calling directly with your date, event, route, and passenger count so we can match you with the right limo.",
    },
    {
      question: "How do I know you're the right limousine company for me?",
      answer:
        "Look at fleet quality, driver professionalism, safety expectations, booking clarity, and whether the company can actually match the vehicle to your event rather than forcing a generic option.",
    },
    {
      question: "What sets your limousine service apart from others?",
      answer:
        "The combination of a varied stretch-limo fleet, experienced chauffeurs, transparent booking guidance, and vehicles tailored for both formal and celebratory events is what makes the service stand out.",
    },
  ],
  relatedPostSlugs: relatedFleetBlogSlugs,
};

export function getFleetMetricLabel(vehicles: Vehicle[]) {
  const maxPassengers = Math.max(...vehicles.map((vehicle) => vehicle.passengers));
  return {
    count: vehicles.length,
    maxPassengers,
  };
}
