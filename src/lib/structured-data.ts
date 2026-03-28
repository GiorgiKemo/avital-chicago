import { siteConfig } from "@/lib/site-config";

function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return new URL(path, siteConfig.url).toString();
}

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.shortName,
  url: siteConfig.url,
};

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteConfig.name,
  logo: absoluteUrl(siteConfig.images.logo),
  image: absoluteUrl(siteConfig.images.logo),
  url: siteConfig.url,
  telephone: siteConfig.phoneSchema,
  priceRange: "$-$$",
  address: {
    "@type": "PostalAddress",
    ...siteConfig.address,
  },
  geo: {
    "@type": "GeoCoordinates",
    ...siteConfig.geo,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    opens: "09:00",
    closes: "22:00",
  },
  sameAs: [siteConfig.social.facebook],
};

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  alternateName: "avitalchicagolimousine",
  url: siteConfig.url,
  logo: absoluteUrl(siteConfig.images.logo),
  sameAs: [siteConfig.social.facebook],
};

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; item: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.item),
    })),
  };
}
