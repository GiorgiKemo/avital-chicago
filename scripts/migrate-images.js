/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Image Migration Script
 * Copies and organizes images from the old PHP site into the new Next.js public/ folder.
 * Run: node scripts/migrate-images.js
 */

const fs = require('fs');
const path = require('path');

const OLD_SITE = path.resolve(__dirname, '../../OG Websites/avital design --2');
const NEW_PUBLIC = path.resolve(__dirname, '../public/images');
const HERO_FILES = new Set([
  'hero-limo.jpg',
  'partybus-interior.jpg',
  'hero-partybus.jpg',
]);

// Map old gallery folder names (with typos) to clean vehicle slugs
const GALLERY_MAP = {
  // Party Buses
  'party-bus-diamond-interior': { slug: 'diamond', type: 'interior' },
  'party-bus-diamond-exterior': { slug: 'diamond', type: 'exterior' },
  'party-bus-tiffany-edition-interior': { slug: 'tiffany-miami', type: 'interior' },
  'party-bus-tiffany-edition-exterior': { slug: 'tiffany-miami', type: 'exterior' },
  'party-bus-vision-edition-interior': { slug: 'vision-venice', type: 'interior' },
  'party-bus-vision-edition-exterior': { slug: 'vision-venice', type: 'exterior' },
  'party-bus-venice-edition-interior': { slug: 'vision-venice', type: 'interior' },
  'party-bus-venice-edition-exterior': { slug: 'vision-venice', type: 'exterior' },
  'party-bus-gatsby-edition-interrior': { slug: 'gatsby', type: 'interior' },
  'party-bus-gatsby-edition-exterrior': { slug: 'gatsby', type: 'exterior' },
  'party-bus-hawaii-edition-interior': { slug: 'hawaii', type: 'interior' },
  'party-bus-hawaii-edition-exterior': { slug: 'hawaii', type: 'exterior' },
  'party-bus-mercedes-sprinter-edition-interior': { slug: 'mercedes-sprinter', type: 'interior' },
  'party-bus-mercedes-sprinter-edition-exterrior': { slug: 'mercedes-sprinter', type: 'exterior' },
  'party-bus-enclave-edition-interior': { slug: 'enclave', type: 'interior' },
  'party-bus-enclave-edition-exterior': { slug: 'enclave', type: 'exterior' },
  'party-bus-encore-edition-interior': { slug: 'encore', type: 'interior' },
  'party-bus-epic-edition-interrior': { slug: 'epic', type: 'interior' },
  'party-bus-escape-edition-interrior': { slug: 'escape', type: 'interior' },
  'party-bus-exhibit-interior': { slug: 'exhibit', type: 'interior' },
  'party-bus-exhibit-exterior': { slug: 'exhibit', type: 'exterior' },
  'party-bus-fantasy-edition-interior': { slug: 'fantasy', type: 'interior' },
  'party-bus-fantasy-edition-exterior': { slug: 'fantasy', type: 'exterior' },
  'party-bus-fashion-edition-interior': { slug: 'fashion-versace', type: 'interior' },
  'party-bus-fashion-edition-exterior': { slug: 'fashion-versace', type: 'exterior' },
  'party-bus-krystal-edition-interior': { slug: 'krystal', type: 'interior' },
  'party-bus-krystal-edition-exterior': { slug: 'krystal', type: 'exterior' },
  'party-bus-olympus-edition-interior': { slug: 'olympus', type: 'interior' },
  'party-bus-olympus-edition-exterior': { slug: 'olympus', type: 'exterior' },
  'party-bus-vip1-edition-interior': { slug: 'vip', type: 'interior' },
  'party-bus-vip1-edition-exterrior': { slug: 'vip', type: 'exterior' },
  'party-bus-martini-edition-interior': { slug: 'martini', type: 'interior' },
  'party-bus-martini-edition-exterior': { slug: 'martini', type: 'exterior' },
  'party-bus-mercedes-charter-edition-interior': { slug: 'mercedes-charter', type: 'interior' },
  'party-bus-mercedes-charter-edition-exterior': { slug: 'mercedes-charter', type: 'exterior' },
  'party-bus-white-pearl-interior': { slug: 'white-pearl', type: 'interior' },
  'party-bus-white-pearl-exterior': { slug: 'white-pearl', type: 'exterior' },
  'party-bus-lounge-edition-interior': { slug: 'lounge', type: 'interior' },
  'party-bus-lounge-edition-exterior': { slug: 'lounge', type: 'exterior' },
  'chicago-edition-interior': { slug: 'chicago-edition', type: 'interior' },
  'chicago-edition-exterior': { slug: 'chicago-edition', type: 'exterior' },
  'shuttle-bus-interior': { slug: 'shuttle-bus', type: 'interior' },
  'shuttle-bus-exterior': { slug: 'shuttle-bus', type: 'exterior' },
  // Limousines
  'cadilac-escalade-interior': { slug: 'cadillac-escalade', type: 'interior' },
  'cadilac-escalade-exterior': { slug: 'cadillac-escalade', type: 'exterior' },
  'hummer-h2-white-pearl-interior': { slug: 'hummer-h2-white-pearl', type: 'interior' },
  'hummer-h2-white-pearl-exterior': { slug: 'hummer-h2-white-pearl', type: 'exterior' },
  'double-axle-hummer-h2-exterior-interior': { slug: 'hummer-h2-double-axle', type: 'interior' },
  'double-axle-hummer-h2-exterior': { slug: 'hummer-h2-double-axle', type: 'exterior' },
  'triple-axle-hummer-h2-interior': { slug: 'hummer-h2-triple-axle', type: 'interior' },
  'triple-axle-hummer-h2-exterior': { slug: 'hummer-h2-triple-axle', type: 'exterior' },
  'infiniti-qx56-interior': { slug: 'infiniti-qx56', type: 'interior' },
  'infiniti-qx56-exterior': { slug: 'infiniti-qx56', type: 'exterior' },
  'lincoln-navigator-interiro': { slug: 'lincoln-navigator', type: 'interior' },
  'lincoln-navigator-exterior': { slug: 'lincoln-navigator', type: 'exterior' },
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    return true;
  }
  return false;
}

function isImage(file) {
  return /\.(webp|jpg|jpeg|png|svg)$/i.test(file);
}

function preferWebp(files) {
  // For each base name, prefer .webp over .jpg/.png
  const map = new Map();
  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    const base = path.basename(f, ext);
    const existing = map.get(base);
    if (!existing || ext === '.webp') {
      map.set(base, f);
    }
  }
  return Array.from(map.values());
}

let totalCopied = 0;

// 1. Copy vehicle gallery images
console.log('=== Copying vehicle gallery images ===');
const galleryDir = path.join(OLD_SITE, 'images', 'gallery');
if (fs.existsSync(galleryDir)) {
  const folders = fs.readdirSync(galleryDir);
  for (const folder of folders) {
    const mapping = GALLERY_MAP[folder];
    if (!mapping) {
      console.log(`  SKIP: ${folder} (no mapping)`);
      continue;
    }

    const srcDir = path.join(galleryDir, folder);
    if (!fs.statSync(srcDir).isDirectory()) continue;

    const destDir = path.join(NEW_PUBLIC, 'gallery', mapping.slug, mapping.type);
    ensureDir(destDir);

    const files = fs.readdirSync(srcDir).filter(isImage);
    const selected = preferWebp(files);

    for (const file of selected) {
      if (copyFile(path.join(srcDir, file), path.join(destDir, file))) {
        totalCopied++;
      }
    }
    console.log(`  ${folder} → gallery/${mapping.slug}/${mapping.type}/ (${selected.length} images)`);
  }
}

// 2. Copy hero images from new design assets
console.log('\n=== Copying hero images ===');
const heroDir = path.join(NEW_PUBLIC, 'hero');
ensureDir(heroDir);
const newDesignAssets = path.resolve(__dirname, '../../avital-new-design/src/assets');
if (fs.existsSync(newDesignAssets)) {
  const heroFiles = fs.readdirSync(newDesignAssets).filter(
    (file) => isImage(file) && HERO_FILES.has(file),
  );
  for (const file of heroFiles) {
    if (copyFile(path.join(newDesignAssets, file), path.join(heroDir, file))) {
      totalCopied++;
    }
    console.log(`  ${file} → hero/${file}`);
  }
}

// 3. Copy logos
console.log('\n=== Copying logos ===');
const logosDir = path.join(NEW_PUBLIC, 'logos');
ensureDir(logosDir);
const logoFiles = [
  { src: 'images/logo.webp', dest: 'logo.webp' },
  { src: 'images/logo-footer.webp', dest: 'logo-footer.webp' },
];
for (const logo of logoFiles) {
  const srcPath = path.join(OLD_SITE, logo.src);
  if (fs.existsSync(srcPath)) {
    if (copyFile(srcPath, path.join(logosDir, logo.dest))) {
      totalCopied++;
    }
    console.log(`  ${logo.src} → logos/${logo.dest}`);
  }
}

// 4. Copy service images
console.log('\n=== Copying service images ===');
const svcDir = path.join(OLD_SITE, 'images', 'services');
if (fs.existsSync(svcDir)) {
  const destSvcDir = path.join(NEW_PUBLIC, 'services');
  ensureDir(destSvcDir);
  const svcFiles = fs.readdirSync(svcDir).filter(isImage);
  const selected = preferWebp(svcFiles);
  for (const file of selected) {
    if (copyFile(path.join(svcDir, file), path.join(destSvcDir, file))) {
      totalCopied++;
    }
  }
  console.log(`  Root service images: ${selected.length}`);

  // Weddings subfolder
  const weddingsDir = path.join(svcDir, 'weddings');
  if (fs.existsSync(weddingsDir)) {
    const destWedDir = path.join(destSvcDir, 'weddings');
    ensureDir(destWedDir);
    const wFiles = fs.readdirSync(weddingsDir).filter(isImage);
    const wSelected = preferWebp(wFiles);
    for (const file of wSelected) {
      if (copyFile(path.join(weddingsDir, file), path.join(destWedDir, file))) {
        totalCopied++;
      }
    }
    console.log(`  Wedding images: ${wSelected.length}`);
  }
}

// 5. Copy blog images
console.log('\n=== Copying blog images ===');
const blogDir = path.join(OLD_SITE, 'images', 'blog-new');
if (fs.existsSync(blogDir)) {
  const destBlogDir = path.join(NEW_PUBLIC, 'blog');
  ensureDir(destBlogDir);
  const blogFiles = fs.readdirSync(blogDir).filter(isImage);
  const selected = preferWebp(blogFiles);
  for (const file of selected) {
    if (copyFile(path.join(blogDir, file), path.join(destBlogDir, file))) {
      totalCopied++;
    }
  }
  console.log(`  Blog images: ${selected.length}`);
}

// 6. Copy area/location images
console.log('\n=== Copying area images ===');
const areasDestDir = path.join(NEW_PUBLIC, 'areas');
ensureDir(areasDestDir);
const areaPatterns = [
  'Aurora', 'Naperville', 'Joliet', 'Elgin', 'Waukegan', 'Palatine',
  'Arlington-Heights', 'Schaumburg', 'Bloomington', 'Bolingbrook',
  'Cicero', 'Decatur', 'Des-Plaines', 'Evanston', 'Oak-Lawn',
  'Orland-Park', 'Rockford', 'Skokie',
];
const rootImages = path.join(OLD_SITE, 'images');
if (fs.existsSync(rootImages)) {
  const allRootFiles = fs.readdirSync(rootImages).filter(isImage);
  for (const area of areaPatterns) {
    const areaFiles = allRootFiles.filter(f => f.toLowerCase().startsWith(area.toLowerCase()));
    if (areaFiles.length > 0) {
      const areaSlug = area.toLowerCase();
      const destArea = path.join(areasDestDir, areaSlug);
      ensureDir(destArea);
      const selected = preferWebp(areaFiles);
      for (const file of selected) {
        if (copyFile(path.join(rootImages, file), path.join(destArea, file))) {
          totalCopied++;
        }
      }
      console.log(`  ${area}: ${selected.length} images`);
    }
  }
}

// 7. Copy misc images (reason icons, social icons)
console.log('\n=== Copying misc images ===');
const miscDir = path.join(NEW_PUBLIC, 'misc');
ensureDir(miscDir);
if (fs.existsSync(rootImages)) {
  const allRootFiles = fs.readdirSync(rootImages).filter(isImage);
  const miscFiles = allRootFiles.filter(f =>
    f.startsWith('reason-') || f.startsWith('social-')
  );
  const selected = preferWebp(miscFiles);
  for (const file of selected) {
    if (copyFile(path.join(rootImages, file), path.join(miscDir, file))) {
      totalCopied++;
    }
  }
  console.log(`  Misc images: ${selected.length}`);
}

// 8. Generate image manifest
console.log('\n=== Generating image manifest ===');
const manifest = {};
const galleryOut = path.join(NEW_PUBLIC, 'gallery');
if (fs.existsSync(galleryOut)) {
  const vehicles = fs.readdirSync(galleryOut);
  for (const vehicle of vehicles) {
    const vehicleDir = path.join(galleryOut, vehicle);
    if (!fs.statSync(vehicleDir).isDirectory()) continue;
    manifest[vehicle] = { interior: [], exterior: [] };
    for (const type of ['interior', 'exterior']) {
      const typeDir = path.join(vehicleDir, type);
      if (fs.existsSync(typeDir)) {
        const images = fs.readdirSync(typeDir).filter(isImage).sort();
        manifest[vehicle][type] = images.map(f => `/images/gallery/${vehicle}/${type}/${f}`);
      }
    }
  }
}

fs.writeFileSync(
  path.join(NEW_PUBLIC, 'image-manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log(`\n=== DONE === ${totalCopied} total files copied`);
console.log(`Manifest written with ${Object.keys(manifest).length} vehicles`);
