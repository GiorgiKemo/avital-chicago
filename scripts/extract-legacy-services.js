/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const oldSiteDir = path.resolve(
  __dirname,
  "../../OG Websites/avital design --2",
);
const outputPath = path.resolve(__dirname, "../src/lib/legacy-services.json");
const areaOutputPath = path.resolve(
  __dirname,
  "../src/lib/legacy-area-services.json",
);

const serviceFileMap = {
  wedding: "services-weddings.php",
  quinceanera: "services-quinceaneras.php",
  "night-parties": "services-night-parties.php",
  prom: "services-prom-school-dance.php",
  "bachelor-bachelorette": "services-bachelor-bachelorette-party.php",
  "concerts-sports": "services-concerts-sports.php",
  birthday: "services-birthdays.php",
};

const directRouteMap = new Map([
  ["/blog.php", "/blog"],
  ["/contact-us.php", "/contact-us"],
  ["/areas-we-serve.php", "/areas-we-serve"],
  ["/charter-buses-rental-chicago.php", "/charter-buses"],
  ["/charter-buses.php", "/charter-buses"],
  ["/kids-party-bus-chicago.php", "/kids-party-bus"],
  ["/kids-party-bus.php", "/kids-party-bus"],
  ["/party-buses.php", "/chicago-party-bus-rental"],
  ["/limo-fleet.php", "/chicago-limo-rental"],
  ["/chicago-party-bus.php", "/chicago-party-bus-rental"],
  ["/chicago-party-bus-rental.php", "/chicago-party-bus-rental"],
  ["/chicago-limo-rental-services.php", "/chicago-limo-rental"],
  ["/services.php", "/services"],
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
  ["/thank-you.php", "/thank-you"],
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

const htmlEntityMap = {
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&rsquo;": "'",
  "&lsquo;": "'",
  "&rdquo;": '"',
  "&ldquo;": '"',
  "&ndash;": "-",
  "&mdash;": "-",
  "&hellip;": "...",
  "&Prime;": '"',
  "&prime;": "'",
  "&middot;": "·",
  "&copy;": "©",
};

function decodeHtmlEntities(input) {
  return input
    .replace(/&#(\d+);/g, (_, codePoint) =>
      String.fromCodePoint(Number(codePoint)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, codePoint) =>
      String.fromCodePoint(parseInt(codePoint, 16)),
    )
    .replace(
      /&(amp|quot|apos|nbsp|rsquo|lsquo|rdquo|ldquo|ndash|mdash|hellip|Prime|prime|middot|copy|#39);/g,
      (entity) => htmlEntityMap[entity] ?? entity,
    );
}

function repairMojibake(input) {
  if (!/[ÃÂâ]/.test(input)) {
    return input;
  }

  let current = input;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const repaired = Buffer.from(current, "latin1").toString("utf8");
    const currentScore = (current.match(/[ÃÂâ]/g) || []).length;
    const repairedScore = (repaired.match(/[ÃÂâ]/g) || []).length;

    if (repairedScore >= currentScore) {
      break;
    }

    current = repaired;
  }

  return current;
}

function normalizeLegacyCopy(input) {
  return input
    .replace(/\bQuinceaneras\b/g, "Quinceañeras")
    .replace(/\bQuinceanera\b/g, "Quinceañera")
    .replace(/its[’']/g, "its")
    .replace(/\bLICENCED\b/g, "LICENSED")
    .replace(/\bCHOISE\b/g, "CHOICE")
    .replace(/\bChicargy\b/g, "Chicago")
    .replace(/got your covered/g, "got you covered")
    .replace(/at it[’']s very finest/g, "at its very finest")
    .replace(/at it[’']s finest/g, "at its finest")
    .replace(/at it[’']s very best/g, "at its very best")
    .replace(/make is special/g, "make it special")
    .replace(/or should that be remember\?/g, "or should that be remembered?")
    .replace(/<\/a>Avital\b/g, "</a> Avital");
}

function stripTags(input) {
  return normalizeLegacyCopy(
    repairMojibake(decodeHtmlEntities(input.replace(/<[^>]+>/g, ""))),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeUrl(rawUrl) {
  if (!rawUrl) {
    return rawUrl;
  }

  let url = rawUrl.trim();

  if (/^https?:\/\//i.test(url) && !/avitalchicagolimousine\.com/i.test(url)) {
    return url;
  }

  url = url.replace(/^https?:\/\/www\.avitalchicagolimousine\.com/i, "");
  url = url.replace(/^https?:\/\/avitalchicagolimousine\.com/i, "");

  if (!url.startsWith("/") && !url.startsWith("mailto:") && !url.startsWith("tel:")) {
    url = `/${url.replace(/^\/+/, "")}`;
  }

  if (directRouteMap.has(url)) {
    return directRouteMap.get(url);
  }

  url = url.replace(/\/blog\/([^?#]+)\.php/gi, (_, slug) => `/blog/${slug}`);

  return url;
}

function rewriteLegacyUrls(html) {
  return html.replace(
    /(href|src)=(["'])(.*?)\2/gi,
    (_, attribute, _quote, url) => `${attribute}="${normalizeUrl(url)}"`,
  );
}

function slugToTitle(input) {
  return input
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function mapLegacyAreaImageUrl(slug, rawUrl) {
  const normalized = normalizeUrl(rawUrl);
  const rootImageMatch = normalized.match(
    /^\/images\/([^/]+\.(?:png|jpe?g|webp|gif))$/i,
  );

  if (!rootImageMatch) {
    return normalized;
  }

  return `/images/areas/${slug}/${rootImageMatch[1]}`;
}

function extractBalancedDiv(html, marker) {
  const start = html.indexOf(marker);
  if (start === -1) {
    return "";
  }

  const openTagEnd = html.indexOf(">", start);
  if (openTagEnd === -1) {
    return "";
  }

  const divTagPattern = /<\/?div\b[^>]*>/gi;
  divTagPattern.lastIndex = start;

  let depth = 0;
  let match;
  const contentStart = openTagEnd + 1;

  while ((match = divTagPattern.exec(html))) {
    if (match[0].startsWith("</div")) {
      depth -= 1;
      if (depth === 0) {
        return html.slice(contentStart, match.index);
      }
    } else {
      depth += 1;
    }
  }

  return "";
}

function cleanLegacyHtml(contentHtml) {
  return normalizeLegacyCopy(
    repairMojibake(
      rewriteLegacyUrls(
        contentHtml
          .replace(/<script[\s\S]*?<\/script>/gi, "")
          .replace(/<\?php[\s\S]*?\?>/g, "")
          .replace(/\r/g, "")
          .trim(),
      ),
    ),
  );
}

function cleanServiceHtml(contentHtml) {
  return cleanLegacyHtml(
    contentHtml
      .replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, "")
      .replace(/<div class="row services">[\s\S]*?<\/div>\s*<\/div>/i, "")
      .replace(/<div class="gallery">[\s\S]*?<\/div>\s*<\/div>/i, ""),
  );
}

function extractTitle(contentHtml, fallback) {
  const match = contentHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return match ? stripTags(match[1]) : fallback;
}

function extractDescription(pageHtml) {
  const match = pageHtml.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  return match
    ? normalizeLegacyCopy(decodeHtmlEntities(match[1]).replace(/\s+/g, " ").trim())
    : "";
}

function extractBannerImage(pageHtml, slug) {
  const match = pageHtml.match(
    /\.banner-image\s*\{[\s\S]*?background-image:\s*url\((['"]?)(.*?)\1\)/i,
  );
  return match ? mapLegacyAreaImageUrl(slug, match[2]) : "";
}

function extractIframeSrc(pageHtml) {
  const match = pageHtml.match(/<iframe[^>]+src="([^"]+)"/i);
  return match ? match[1] : "";
}

function cleanAreaSectionHtml(contentHtml, slug) {
  return cleanLegacyHtml(contentHtml)
    .replace(
      /src="\/images\/([^/"]+\.(?:png|jpe?g|webp|gif))"/gi,
      (_, fileName) => `src="/images/areas/${slug}/${fileName}"`,
    )
    .replace(
      /href="\/images\/([^/"]+\.(?:png|jpe?g|webp|gif))"/gi,
      (_, fileName) => `href="/images/areas/${slug}/${fileName}"`,
    );
}

function extractRelatedPostSlugs(sectionHtml) {
  if (!sectionHtml) {
    return [];
  }

  const matches = [...sectionHtml.matchAll(/\/blog\/([^/"?#]+)\.php/gi)];
  const uniqueSlugs = new Set(matches.map((match) => match[1]));
  return [...uniqueSlugs];
}

const serviceContent = Object.entries(serviceFileMap).map(([slug, fileName]) => {
  const fullPath = path.join(oldSiteDir, fileName);
  const pageHtml = fs.readFileSync(fullPath, "utf8");
  const rawContent = extractBalancedDiv(pageHtml, '<div class="inner-content">');

  return {
    slug,
    pageTitle: extractTitle(rawContent, slug),
    metaDescription: extractDescription(pageHtml),
    contentHtml: cleanServiceHtml(rawContent),
  };
});

const areaServiceDir = path.join(oldSiteDir, "services");
const areaServiceFiles = fs
  .readdirSync(areaServiceDir)
  .filter((fileName) =>
    /^luxury-party-bus-and-limousine-rental-service-in-[a-z-]+-il\.php$/i.test(
      fileName,
    ),
  )
  .sort();

const areaServiceContent = areaServiceFiles.map((fileName) => {
  const fullPath = path.join(areaServiceDir, fileName);
  const pageHtml = fs.readFileSync(fullPath, "utf8");
  const slugMatch = fileName.match(
    /^luxury-party-bus-and-limousine-rental-service-in-([a-z-]+)-il\.php$/i,
  );
  const slug = slugMatch ? slugMatch[1].toLowerCase() : fileName;
  const breadcrumbMatch = pageHtml.match(/<span>([^<]+)<\/span>\s*<\/p>/i);
  const areaName = breadcrumbMatch
    ? stripTags(breadcrumbMatch[1])
    : slugToTitle(slug);
  const blogSectionHtml = extractBalancedDiv(
    pageHtml,
    '<div class="section-three-blog-page">',
  );

  return {
    slug,
    areaName,
    legacyPath: `/services/${fileName}`,
    pageTitle: repairMojibake(
      decodeHtmlEntities(
        (pageHtml.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] ||
          `Luxury Party Bus and Limousine Rental Service in ${areaName}, IL`,
      ).trim(),
    ),
    metaDescription: extractDescription(pageHtml),
    bannerImage: extractBannerImage(pageHtml, slug),
    introHtml: cleanAreaSectionHtml(
      extractBalancedDiv(pageHtml, '<div class="para-content">'),
      slug,
    ),
    servicesHtml: cleanAreaSectionHtml(
      extractBalancedDiv(pageHtml, '<div class="prices-services-limo">'),
      slug,
    ),
    fleetHtml: cleanAreaSectionHtml(
      extractBalancedDiv(pageHtml, '<div class="Long-limos-subrubs">'),
      slug,
    ),
    whyChooseHtml: cleanAreaSectionHtml(
      extractBalancedDiv(pageHtml, '<div class="left-side-pe-image">'),
      slug,
    ),
    attractionsHtml: cleanAreaSectionHtml(
      extractBalancedDiv(pageHtml, '<div class="pass-cars-type-limos">'),
      slug,
    ),
    mapEmbedUrl: extractIframeSrc(pageHtml),
    relatedPostSlugs: extractRelatedPostSlugs(blogSectionHtml),
  };
});

fs.writeFileSync(outputPath, `${JSON.stringify(serviceContent, null, 2)}\n`);
fs.writeFileSync(areaOutputPath, `${JSON.stringify(areaServiceContent, null, 2)}\n`);
console.log(`Extracted ${serviceContent.length} legacy service pages to ${outputPath}`);
console.log(
  `Extracted ${areaServiceContent.length} legacy area service pages to ${areaOutputPath}`,
);
