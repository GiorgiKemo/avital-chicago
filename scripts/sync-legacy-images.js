/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const oldImagesDir = path.resolve(
  __dirname,
  "../../OG Websites/avital design --2/images",
);
const publicImagesDir = path.resolve(__dirname, "../public/images");

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function syncDirectory(sourceDir, targetDir) {
  ensureDir(targetDir);

  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      syncDirectory(sourcePath, targetPath);
      continue;
    }

    if (!fs.existsSync(targetPath)) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

if (!fs.existsSync(oldImagesDir)) {
  console.error(`Legacy images directory not found: ${oldImagesDir}`);
  process.exit(1);
}

syncDirectory(oldImagesDir, publicImagesDir);
console.log(`Legacy images synced from ${oldImagesDir} to ${publicImagesDir}`);
