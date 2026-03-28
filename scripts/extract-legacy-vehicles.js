/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const oldSiteDir = path.resolve(
  __dirname,
  "../../OG Websites/avital design --2",
);
const outputPath = path.resolve(
  __dirname,
  "../src/lib/legacy-vehicle-details.json",
);

const vehicleFileMap = [
  { slug: "cadillac-escalade", kind: "limo", file: "limo-cadillac-escalade.php" },
  {
    slug: "hummer-h2-white-pearl",
    kind: "limo",
    file: "limo-hummer-h2-white-pearl.php",
  },
  {
    slug: "hummer-h2-double-axle",
    kind: "limo",
    file: "limo-hummer-h2-double-axle.php",
  },
  {
    slug: "hummer-h2-triple-axle",
    kind: "limo",
    file: "limo-hummer-h2-triple-axle.php",
  },
  { slug: "infiniti-qx56", kind: "limo", file: "limo-infiniti-qx56.php" },
  {
    slug: "lincoln-navigator",
    kind: "limo",
    file: "limo-lincoln-navigator.php",
  },
  { slug: "diamond", kind: "party-bus", file: "party-bus-diamond-exterior.php" },
  { slug: "enclave", kind: "party-bus", file: "party-bus-enclave-edition.php" },
  { slug: "encore", kind: "party-bus", file: "party-bus-encore-edition.php" },
  { slug: "epic", kind: "party-bus", file: "party-bus-epic-edition.php" },
  { slug: "escape", kind: "party-bus", file: "party-bus-escape-edition.php" },
  { slug: "exhibit", kind: "party-bus", file: "party-bus-exhibit-edition.php" },
  { slug: "fantasy", kind: "party-bus", file: "party-bus-fantasy-edition.php" },
  {
    slug: "fashion-versace",
    kind: "party-bus",
    file: "party-bus-fashion-edition.php",
  },
  { slug: "gatsby", kind: "party-bus", file: "party-bus-gatsby-edition.php" },
  { slug: "hawaii", kind: "party-bus", file: "party-bus-hawaii-edition.php" },
  { slug: "krystal", kind: "party-bus", file: "party-bus-krystal-edition.php" },
  {
    slug: "mercedes-sprinter",
    kind: "party-bus",
    file: "party-bus-mercedes-sprinter-edition.php",
  },
  { slug: "olympus", kind: "party-bus", file: "party-bus-olympus-edition.php" },
  {
    slug: "tiffany-miami",
    kind: "party-bus",
    file: "party-bus-tiffany-edition.php",
  },
  {
    slug: "vision-venice",
    kind: "party-bus",
    file: "party-bus-vision-edition.php",
  },
  { slug: "vip", kind: "party-bus", file: "party-bus-vip-edition.php" },
  { slug: "white-pearl", kind: "party-bus", file: "party-bus-white-pearl.php" },
  { slug: "martini", kind: "party-bus", file: "martini-party-bus.php" },
  {
    slug: "mercedes-charter",
    kind: "party-bus",
    file: "mercedes-charter-party-bus.php",
  },
];

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
  "&eacute;": "é",
  "&Eacute;": "É",
  "&aacute;": "á",
  "&Aacute;": "Á",
  "&ntilde;": "ñ",
  "&Ntilde;": "Ñ",
};

const mojibakeReplacements = [
  ["â€™", "'"],
  ["â€˜", "'"],
  ["â€œ", '"'],
  ["â€", '"'],
  ["â€\"", '"'],
  ["â€³", '"'],
  ["â€²", "'"],
  ["â€¦", "..."],
  ["â€“", "-"],
  ["â€”", "-"],
  ["Â·", "·"],
  ["Â©", "©"],
  ["Ã±", "ñ"],
  ["Ã¡", "á"],
  ["Ã©", "é"],
  ["Ã‰", "É"],
  ["Ã", "Á"],
];

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
  if (!/[Ãâ]/.test(input)) {
    return input;
  }

  let current = input;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const repaired = Buffer.from(current, "latin1").toString("utf8");
    const currentScore = (current.match(/[Ãâ]/g) || []).length;
    const repairedScore = (repaired.match(/[Ãâ]/g) || []).length;

    if (repairedScore >= currentScore) {
      break;
    }

    current = repaired;
  }

  return current;
}

function cleanText(input) {
  let cleaned = repairMojibake(decodeHtmlEntities(input));

  for (const [searchValue, replaceValue] of mojibakeReplacements) {
    cleaned = cleaned.split(searchValue).join(replaceValue);
  }

  return cleaned
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;!?])/g, "$1")
    .trim();
}

function stripTags(input) {
  return cleanText(input.replace(/<[^>]+>/g, " "));
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

function extractArrayMatches(html, pattern) {
  return Array.from(html.matchAll(pattern), (match) => stripTags(match[1])).filter(
    Boolean,
  );
}

function parseVehiclePage({ slug, kind, file }) {
  const filePath = path.join(oldSiteDir, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const innerContent = extractBalancedDiv(raw, '<div class="inner-content">');

  const pageTitle = cleanText(raw.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "");
  const metaDescription = cleanText(
    raw.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] || "",
  );
  const featureHeading = stripTags(innerContent.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
  const featureList = extractArrayMatches(
    innerContent.match(/<ul class="description-list">([\s\S]*?)<\/ul>/i)?.[1] || "",
    /<li[^>]*>([\s\S]*?)<\/li>/gi,
  );
  const descriptionParagraphs = extractArrayMatches(
    innerContent,
    /<p\b[^>]*>([\s\S]*?)<\/p>/gi,
  );

  const youtubeId =
    raw.match(/youtube\.com\/embed\/([^"?&/]+)/i)?.[1] ||
    undefined;

  const breadcrumbMatches = Array.from(
    raw.matchAll(/<p class="breadcrumbs">([\s\S]*?)<\/p>/gi),
  );
  const breadcrumbHtml = breadcrumbMatches[0]?.[1] || "";
  const breadcrumbLinks = Array.from(
    breadcrumbHtml.matchAll(/<a href="([^"]+)">([\s\S]*?)<\/a>/gi),
  );
  const currentLabel = stripTags(
    breadcrumbHtml.match(/<span>([\s\S]*?)<\/span>/i)?.[1] || "",
  );

  return {
    slug,
    kind,
    sourceFile: file,
    legacyPath: `/${file}`,
    pageTitle,
    metaDescription,
    featureHeading,
    breadcrumbParentLabel: stripTags(breadcrumbLinks[1]?.[2] || ""),
    breadcrumbParentHref: breadcrumbLinks[1]?.[1] || "",
    breadcrumbCurrentLabel: currentLabel,
    featureList,
    descriptionParagraphs,
    youtubeId,
  };
}

const results = vehicleFileMap
  .filter(({ file }) => fs.existsSync(path.join(oldSiteDir, file)))
  .map(parseVehiclePage)
  .sort((left, right) => left.slug.localeCompare(right.slug));

fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

console.log(
  `Extracted ${results.length} legacy vehicle detail records to ${outputPath}`,
);
