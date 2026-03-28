/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const imagesRoot = path.join(repoRoot, "public", "images");
const srcRoot = path.join(repoRoot, "src");
const manifestPath = path.join(imagesRoot, "image-manifest.json");
const heroPrefix = "/images/hero/";
const rasterPattern = /\.(?:png|jpe?g)$/i;
const textFilePattern = /\.(?:ts|tsx|js|jsx|json|md)$/i;
const imageRefPattern = /\/images\/[^"'<>]+?\.(?:png|jpe?g)/gi;

const stats = {
  converted: 0,
  skipped: 0,
  updatedFiles: 0,
  updatedRefs: 0,
};

function walk(dir, predicate, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, predicate, out);
      continue;
    }
    if (predicate(fullPath)) {
      out.push(fullPath);
    }
  }
  return out;
}

function toWebpPath(filePath) {
  return filePath.replace(rasterPattern, ".webp");
}

function isHeroFile(filePath) {
  return filePath.startsWith(path.join(imagesRoot, "hero"));
}

function convertToWebp(filePath) {
  if (!rasterPattern.test(filePath) || isHeroFile(filePath)) {
    return;
  }

  const webpPath = toWebpPath(filePath);
  if (fs.existsSync(webpPath)) {
    stats.skipped += 1;
    return;
  }

  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-loglevel",
      "error",
      "-i",
      filePath,
      "-c:v",
      "libwebp",
      "-quality",
      "90",
      "-compression_level",
      "6",
      webpPath,
    ],
    { stdio: "pipe" },
  );

  if (result.status !== 0) {
    const stderr = (result.stderr || "").toString().trim();
    throw new Error(`ffmpeg failed for ${filePath}: ${stderr}`);
  }

  stats.converted += 1;
}

function updateRefsInFile(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  let updatedRefCount = 0;

  const next = original.replace(imageRefPattern, (match) => {
    if (match.startsWith(heroPrefix)) {
      return match;
    }

    const decodedPath = decodeURIComponent(match).replace(/^\//, "");
    const sourcePath = path.join(repoRoot, "public", ...decodedPath.split("/"));
    const webpPath = toWebpPath(sourcePath);

    if (!fs.existsSync(webpPath)) {
      return match;
    }

    updatedRefCount += 1;
    return match.replace(rasterPattern, ".webp");
  });

  if (next !== original) {
    fs.writeFileSync(filePath, next);
    stats.updatedFiles += 1;
    stats.updatedRefs += updatedRefCount;
  }
}

function main() {
  if (!fs.existsSync(imagesRoot)) {
    throw new Error(`Images directory not found: ${imagesRoot}`);
  }

  const rasterFiles = walk(imagesRoot, (filePath) => rasterPattern.test(filePath));
  for (const filePath of rasterFiles) {
    convertToWebp(filePath);
  }

  const textFiles = [
    manifestPath,
    ...walk(srcRoot, (filePath) => textFilePattern.test(filePath)),
  ];

  for (const filePath of textFiles) {
    updateRefsInFile(filePath);
  }

  console.log(
    JSON.stringify(
      {
        converted: stats.converted,
        skippedExisting: stats.skipped,
        updatedFiles: stats.updatedFiles,
        updatedRefs: stats.updatedRefs,
      },
      null,
      2,
    ),
  );
}

main();
