export interface Vehicle {
  slug: string;
  name: string;
  type: "party-bus" | "limo" | "shuttle";
  passengers: number;
  tagline: string;
  description: string;
  features: string[];
  images: string[];
  cardImage?: string;
  youtubeId?: string;
}

export interface Service {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  pageTitle?: string;
  metaDescription?: string;
  contentHtml?: string;
}

export interface Area {
  slug: string;
  name: string;
  description: string;
}

export interface LegacyAreaService {
  slug: string;
  areaName: string;
  legacyPath: string;
  pageTitle: string;
  metaDescription: string;
  bannerImage?: string;
  introHtml?: string;
  servicesHtml?: string;
  fleetHtml?: string;
  whyChooseHtml?: string;
  attractionsHtml?: string;
  mapEmbedUrl?: string;
  relatedPostSlugs: string[];
}

export interface LegacyVehicleDetail {
  slug: string;
  kind: "party-bus" | "limo";
  sourceFile: string;
  legacyPath: string;
  pageTitle: string;
  metaDescription: string;
  featureHeading: string;
  breadcrumbParentLabel: string;
  breadcrumbParentHref: string;
  breadcrumbCurrentLabel: string;
  featureList: string[];
  descriptionParagraphs: string[];
  youtubeId?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  contentHtml: string;
  featuredImage?: string;
}

export interface QuoteSubmission {
  name: string;
  email: string;
  phone: string;
  pickUp: string;
  dropOff: string;
  passengers: string;
  date?: string;
  eventType: string;
  serviceType: string;
  vehicleType: string;
  sourcePage?: string;
}
