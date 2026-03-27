/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const oldSiteDir = path.resolve(
  __dirname,
  "../../OG Websites/avital design --2",
);
const blogDir = path.join(oldSiteDir, "blog");
const blogIndexPath = path.join(oldSiteDir, "blog.php");
const outputPath = path.resolve(__dirname, "../src/lib/legacy-blog-posts.json");

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
  ["/party-bus-tiffany-edition.php", "/chicago-party-bus-rental/tiffany-miami"],
  ["/party-bus-vision-edition.php", "/chicago-party-bus-rental/vision-venice"],
  ["/party-bus-venice-edition.php", "/chicago-party-bus-rental/vision-venice"],
  ["/party-bus-gatsby-edition.php", "/chicago-party-bus-rental/gatsby"],
  ["/party-bus-hawaii-edition.php", "/chicago-party-bus-rental/hawaii"],
  ["/party-bus-mercedes-sprinter-edition.php", "/chicago-party-bus-rental/mercedes-sprinter"],
  ["/party-bus-enclave-edition.php", "/chicago-party-bus-rental/enclave"],
  ["/party-bus-encore-edition.php", "/chicago-party-bus-rental/encore"],
  ["/party-bus-epic-edition.php", "/chicago-party-bus-rental/epic"],
  ["/party-bus-escape-edition.php", "/chicago-party-bus-rental/escape"],
  ["/party-bus-exhibit-edition.php", "/chicago-party-bus-rental/exhibit"],
  ["/party-bus-fantasy-edition.php", "/chicago-party-bus-rental/fantasy"],
  ["/party-bus-fashion-edition.php", "/chicago-party-bus-rental/fashion-versace"],
  ["/party-bus-krystal-edition.php", "/chicago-party-bus-rental/krystal"],
  ["/party-bus-olympus-edition.php", "/chicago-party-bus-rental/olympus"],
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
  "&mdash;": "—",
  "&hellip;": "...",
  "&Prime;": '"',
  "&prime;": "'",
  "&middot;": "·",
  "&copy;": "©",
  "&eacute;": "é",
  "&Eacute;": "É",
  "&aacute;": "á",
  "&Aacute;": "Á",
  "&ntilde;": "ñ",
  "&Ntilde;": "Ñ",
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
      /&(amp|quot|apos|nbsp|rsquo|lsquo|rdquo|ldquo|ndash|mdash|hellip|Prime|prime|middot|copy|eacute|Eacute|aacute|Aacute|ntilde|Ntilde|#39);/g,
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

function stripTags(input) {
  return repairMojibake(decodeHtmlEntities(input.replace(/<[^>]+>/g, "")))
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

  if (directRouteMap.has(url)) {
    return directRouteMap.get(url);
  }

  url = url.replace(/\/blog\/([^?#]+)\.php/gi, (_, slug) => `/blog/${slug}`);

  if (/^\/images\//i.test(url)) {
    return url;
  }

  return url;
}

function rewriteLegacyUrls(html) {
  return html.replace(
    /(href|src)=(["'])(.*?)\2/gi,
    (_, attribute, _quote, url) => `${attribute}="${normalizeUrl(url)}"`,
  );
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
  let contentStart = openTagEnd + 1;

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

function extractTitle(contentHtml, fallbackSlug) {
  const titleMatch = contentHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (titleMatch) {
    return stripTags(titleMatch[1]);
  }

  return fallbackSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function extractDate(articleHtml) {
  const dateMatch = articleHtml.match(/"datePublished"\s*:\s*"([^"]+)"/i);
  return dateMatch ? dateMatch[1] : "2020-01-01";
}

function extractDescription(articleHtml) {
  const descriptionMatch = articleHtml.match(
    /<meta\s+name="description"\s+content="([^"]*)"/i,
  );

  return descriptionMatch
    ? decodeHtmlEntities(descriptionMatch[1]).replace(/\s+/g, " ").trim()
    : "";
}

function cleanContentHtml(contentHtml) {
  return repairMojibake(
    rewriteLegacyUrls(
    contentHtml
      .replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, "")
      .replace(/\r/g, "")
      .trim(),
    ),
  );
}

function extractFirstImage(html) {
  const imageMatch = html.match(/<img[^>]+src="([^"]+)"/i);
  return imageMatch ? normalizeUrl(imageMatch[1]) : undefined;
}

function buildListingMap(indexHtml) {
  const listingMap = new Map();
  const itemPattern =
    /<a\s+href="https?:\/\/www\.avitalchicagolimousine\.com\/blog\/([^"]+)\.php"[\s\S]*?<img[^>]+src="([^"]+)"[\s\S]*?<span class="service-name">([\s\S]*?)<\/span>/gi;

  let match;
  while ((match = itemPattern.exec(indexHtml))) {
    const slug = match[1];
    const featuredImage = normalizeUrl(match[2]);
    const listingTitle = stripTags(match[3]);

    if (!listingMap.has(slug)) {
      listingMap.set(slug, { featuredImage, listingTitle });
    }
  }

  return listingMap;
}

const blogIndexHtml = fs.readFileSync(blogIndexPath, "utf8");
const listingMap = buildListingMap(blogIndexHtml);

function buildBlogPost(slug, listingData = {}) {
  const articlePath = path.join(blogDir, `${slug}.php`);
  const articleHtml = fs.readFileSync(articlePath, "utf8");
  const rawContentHtml = extractBalancedDiv(articleHtml, '<div class="inner-content">');
  const contentHtml = cleanContentHtml(rawContentHtml);
  const title = extractTitle(rawContentHtml, slug) || listingData.listingTitle;
  const excerpt = extractDescription(articleHtml) || listingData.listingTitle;
  const featuredImage = listingData.featuredImage || extractFirstImage(contentHtml);

  return {
    slug,
    title,
    excerpt,
    date: extractDate(articleHtml),
    featuredImage,
    contentHtml,
  };
}

const blogPosts = Array.from(listingMap.entries()).map(([slug, listingData]) =>
  buildBlogPost(slug, listingData),
);

const legacyFiles = fs
  .readdirSync(blogDir)
  .filter((fileName) => fileName.endsWith(".php"))
  .map((fileName) => fileName.replace(/\.php$/i, ""))
  .filter((slug) => !slug.startsWith("shared"));

for (const slug of legacyFiles) {
  if (blogPosts.some((post) => post.slug === slug)) {
    continue;
  }

  blogPosts.push(buildBlogPost(slug));
}

fs.writeFileSync(outputPath, `${JSON.stringify(blogPosts, null, 2)}\n`);
console.log(`Extracted ${blogPosts.length} legacy blog posts to ${outputPath}`);
