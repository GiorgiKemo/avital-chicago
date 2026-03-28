import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const exactRedirects = new Map<string, string>([
  ["/blog.php", "/blog"],
  ["/limo-fleet.php", "/chicago-limo-rental"],
  ["/party-buses.php", "/chicago-party-bus-rental"],
  ["/chicago-party-bus.php", "/chicago-party-bus-rental"],
  ["/chicago-party-bus-rental.php", "/chicago-party-bus-rental"],
  ["/chicago-limo-rental-services.php", "/chicago-limo-rental"],
  ["/services.php", "/services"],
  ["/contact-us.php", "/contact-us"],
  ["/areas-we-serve.php", "/areas-we-serve"],
  ["/charter-buses-rental-chicago.php", "/charter-buses"],
  ["/charter-buses.php", "/charter-buses"],
  ["/kids-party-bus.php", "/kids-party-bus"],
  ["/kids-party-bus-chicago.php", "/kids-party-bus"],
  ["/thank-you.php", "/thank-you"],
  ["/services-weddings.php", "/services/wedding"],
  ["/services-quinceaneras.php", "/services/quinceanera"],
  ["/services-night-parties.php", "/services/night-parties"],
  ["/services-prom-school-dance.php", "/services/prom"],
  ["/services-bachelor-bachelorette-party.php", "/services/bachelor-bachelorette"],
  ["/services-concerts-sports.php", "/services/concerts-sports"],
  ["/services-conserts-sports.php", "/services/concerts-sports"],
  ["/services-birthdays.php", "/services/birthday"],
  ["/services-graduate-party.php", "/services/graduation"],
  ["/services-charter-bus.php", "/charter-buses"],
  ["/services/weddings-party-bus.php", "/services/wedding"],
  ["/services/wedding-limo-rental-services.php", "/services/wedding"],
  ["/services/quinceaneras-party-bus.php", "/services/quinceanera"],
  ["/services/quinceaneras-party-bus-rental.php", "/services/quinceanera"],
  ["/services/night-parties.php", "/services/night-parties"],
  ["/services/chicago-limo-night-parties.php", "/services/night-parties"],
  ["/services/prom-school-dance-party-bus.php", "/services/prom"],
  ["/services/prom-limo-bus-rental.php", "/services/prom"],
  ["/services/bachelor-bachelorette-party.php", "/services/bachelor-bachelorette"],
  ["/services/bachelor-bachelorette-party-bus-rental.php", "/services/bachelor-bachelorette"],
  ["/services/concerts-sports-bus.php", "/services/concerts-sports"],
  ["/services/concerts-sports-bus-service-chicago.php", "/services/concerts-sports"],
  ["/services/conserts-sports.php", "/services/concerts-sports"],
  ["/services/birthdays-party-bus.php", "/services/birthday"],
  ["/services/chicago-birthdays-party-bus.php", "/services/birthday"],
  ["/services/graduate-party.php", "/services/graduation"],
  ["/limo-cadillac-escalade.php", "/chicago-limo-rental/cadillac-escalade"],
  ["/limo-hummer-h2-white-pearl.php", "/chicago-limo-rental/hummer-h2-white-pearl"],
  ["/limo-hummer-h2-double-axle.php", "/chicago-limo-rental/hummer-h2-double-axle"],
  ["/limo-hummer-h2-triple-axle.php", "/chicago-limo-rental/hummer-h2-triple-axle"],
  ["/limo-infiniti-qx56.php", "/chicago-limo-rental/infiniti-qx56"],
  ["/limo-lincoln-navigator.php", "/chicago-limo-rental/lincoln-navigator"],
  ["/party-bus-diamond-exterior.php", "/chicago-party-bus-rental/diamond"],
  ["/party-bus-enclave-edition.php", "/chicago-party-bus-rental/enclave"],
  ["/party-bus-encore-edition.php", "/chicago-party-bus-rental/encore"],
  ["/party-bus-epic-edition.php", "/chicago-party-bus-rental/epic"],
  ["/party-bus-escape-edition.php", "/chicago-party-bus-rental/escape"],
  ["/party-bus-exhibit-edition.php", "/chicago-party-bus-rental/exhibit"],
  ["/party-bus-fantasy-edition.php", "/chicago-party-bus-rental/fantasy"],
  ["/party-bus-fashion-edition.php", "/chicago-party-bus-rental/fashion-versace"],
  ["/party-bus-gatsby-edition.php", "/chicago-party-bus-rental/gatsby"],
  ["/party-bus-hawaii-edition.php", "/chicago-party-bus-rental/hawaii"],
  ["/party-bus-krystal-edition.php", "/chicago-party-bus-rental/krystal"],
  ["/party-bus-olympus-edition.php", "/chicago-party-bus-rental/olympus"],
  ["/party-bus-tiffany-edition.php", "/chicago-party-bus-rental/tiffany-miami"],
  ["/party-bus-venice-edition.php", "/chicago-party-bus-rental/vision-venice"],
  ["/party-bus-vision-edition.php", "/chicago-party-bus-rental/vision-venice"],
  ["/party-bus-vip-edition.php", "/chicago-party-bus-rental/vip"],
  ["/martini-party-bus.php", "/chicago-party-bus-rental/martini"],
  ["/mercedes-charter-party-bus.php", "/chicago-party-bus-rental/mercedes-charter"],
  ["/party-bus-white-pearl.php", "/chicago-party-bus-rental/white-pearl"],
]);

const legacyAreaSlugs = new Set([
  "arlington-heights",
  "aurora",
  "bloomington",
  "bolingbrook",
  "cicero",
  "decatur",
  "des-plaines",
  "elgin",
  "evanston",
  "joliet",
  "naperville",
  "oak-lawn",
  "orland-park",
  "palatine",
  "rockford",
  "schaumburg",
  "skokie",
  "waukegan",
]);

function redirectTo(request: NextRequest, destination: string) {
  return NextResponse.redirect(new URL(destination, request.url), 308);
}

function rewriteTo(request: NextRequest, destination: string) {
  return NextResponse.rewrite(new URL(destination, request.url));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const exactDestination = exactRedirects.get(pathname);
  if (exactDestination) {
    return redirectTo(request, exactDestination);
  }

  const legacyBlogMatch = pathname.match(/^\/blog\/(.+)\.php$/i);
  if (legacyBlogMatch) {
    return redirectTo(request, `/blog/${legacyBlogMatch[1]}`);
  }

  const legacyAreaMatch = pathname.match(
    /^\/services\/luxury-party-bus-and-limousine-rental-service-in-([a-z-]+)-il\.php$/i,
  );
  if (legacyAreaMatch) {
    const areaSlug = legacyAreaMatch[1].toLowerCase();
    if (legacyAreaSlugs.has(areaSlug)) {
      return rewriteTo(request, `/service-areas/${areaSlug}`);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
