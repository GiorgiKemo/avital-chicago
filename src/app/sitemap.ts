import type { MetadataRoute } from "next";
import { areas, blogPosts, limousines, partyBuses, services } from "@/lib/site-data";

const baseUrl = "https://www.avitalchicagolimousine.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/chicago-party-bus-rental",
    "/chicago-limo-rental",
    "/services",
    "/contact-us",
    "/blog",
    "/areas-we-serve",
    "/charter-buses",
    "/kids-party-bus",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  const partyBusRoutes = partyBuses.map((vehicle) => ({
    url: `${baseUrl}/chicago-party-bus-rental/${vehicle.slug}`,
    lastModified: new Date(),
  }));

  const limoRoutes = limousines.map((vehicle) => ({
    url: `${baseUrl}/chicago-limo-rental/${vehicle.slug}`,
    lastModified: new Date(),
  }));

  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
  }));

  const areaRoutes = areas.map((area) => ({
    url: `${baseUrl}/areas-we-serve/${area.slug}`,
    lastModified: new Date(),
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [
    ...staticRoutes,
    ...partyBusRoutes,
    ...limoRoutes,
    ...serviceRoutes,
    ...areaRoutes,
    ...blogRoutes,
  ];
}
