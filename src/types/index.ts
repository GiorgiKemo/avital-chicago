export interface Vehicle {
  slug: string;
  name: string;
  type: "party-bus" | "limo" | "shuttle";
  passengers: number;
  tagline: string;
  description: string;
  features: string[];
  images: string[];
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
  pickUp?: string;
  dropOff?: string;
  passengers?: string;
  date?: string;
  eventType?: string;
  serviceType?: string;
  vehicleType?: string;
}
