// Scans components/images/ and generates typed media manifests.
//   - Images are statically imported (next/image optimises them, gives blur+dims).
//   - Videos are copied to public/media/ and a poster frame is extracted (ffmpeg).
//
//   node scripts/gen-galleries.cjs
//
// Re-run after adding/removing media. Wired to predev/prebuild.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const sharp = require("sharp");
const ffmpegPath = require("ffmpeg-static");

const ROOT = path.resolve(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "components", "images");
const PUBLIC_MEDIA = path.join(ROOT, "public", "media");

const IMG_RE = /\.(jpe?g|png|webp|avif)$/i;
const VIDEO_RE = /\.(mp4|mov|webm|m4v)$/i;

// Map a top-level folder name to a discipline slug (lib/content.ts). Anything
// not listed falls back to its lowercased folder name.
const FOLDER_TO_SLUG = {
  fotos: "foto",
  graphic_design: "disseny",
  web: "web",
  "3d": "3d",
  video: "video",
};

const importAlias = (abs) =>
  "@/" + path.relative(ROOT, abs).split(path.sep).join("/");
const baseName = (file) => path.basename(file).replace(/\.[^.]+$/, "");
const ensureDir = (d) => fs.mkdirSync(d, { recursive: true });

// URL/file-safe name (strip accents and odd characters, keep the extension).
const slugFile = (file) => {
  const ext = path.extname(file).toLowerCase();
  const base = path
    .basename(file, path.extname(file))
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9._-]+/g, "_");
  return base + ext;
};

const dirsIn = (dir) =>
  fs.readdirSync(dir).filter((f) => fs.statSync(path.join(dir, f)).isDirectory()).sort();

// Media files directly in a folder, as { kind, abs } sorted by name.
const mediaIn = (dir) =>
  fs
    .readdirSync(dir)
    .filter((f) => {
      const full = path.join(dir, f);
      return fs.statSync(full).isFile() && (IMG_RE.test(f) || VIDEO_RE.test(f));
    })
    .sort()
    .map((f) => ({ kind: IMG_RE.test(f) ? "image" : "video", abs: path.join(dir, f) }));

// Copy a video to public/media and extract a poster frame. Returns public URLs.
function publishVideo(abs) {
  const rel = path.relative(IMAGES_DIR, abs);
  const relDir = path.dirname(rel);
  const slug = slugFile(path.basename(rel));
  const destDir = path.join(PUBLIC_MEDIA, relDir);
  ensureDir(destDir);

  const dest = path.join(destDir, slug);
  if (!fs.existsSync(dest) || fs.statSync(dest).size !== fs.statSync(abs).size) {
    fs.copyFileSync(abs, dest);
  }

  const urlDir = relDir.split(path.sep).join("/");
  const prefix = "/media/" + (urlDir === "." ? "" : urlDir + "/");
  const url = prefix + slug;

  const posterName = slug.replace(/\.[^.]+$/, "") + ".poster.jpg";
  const posterDest = path.join(destDir, posterName);
  if (!fs.existsSync(posterDest)) {
    const tryExtract = (args) => {
      try {
        execFileSync(ffmpegPath, args, { stdio: "ignore" });
        return fs.existsSync(posterDest);
      } catch {
        return false;
      }
    };
    // Grab a frame ~1s in, scaled to 1280 wide; fall back to the very first frame.
    tryExtract(["-y", "-ss", "1", "-i", abs, "-frames:v", "1", "-vf", "scale=1280:-2", "-q:v", "4", posterDest]) ||
      tryExtract(["-y", "-i", abs, "-frames:v", "1", "-q:v", "4", posterDest]);
  }
  const posterUrl = fs.existsSync(posterDest) ? prefix + posterName : undefined;
  return { url, posterUrl };
}

// Depth-first collection of subfolders that directly contain media.
function collectGroups(dir, segments) {
  const groups = [];
  for (const sub of dirsIn(dir)) {
    const subDir = path.join(dir, sub);
    const segs = [...segments, sub];
    const items = mediaIn(subDir);
    if (items.length) groups.push({ name: sub, path: segs, items });
    groups.push(...collectGroups(subDir, segs));
  }
  return groups;
}

// Build the section list from the top-level folders.
const sections = [];
for (const top of dirsIn(IMAGES_DIR)) {
  const dir = path.join(IMAGES_DIR, top);
  const rootItems = mediaIn(dir);
  const groups = collectGroups(dir, []);
  if (rootItems.length || groups.length) {
    const slug = FOLDER_TO_SLUG[top] || FOLDER_TO_SLUG[top.toLowerCase()] || top.toLowerCase();
    sections.push({ slug, folder: top, rootItems, groups });
  }
}

// ---- Emit ------------------------------------------------------------------
const imports = [];
const varOf = new Map();
let nImg = 0;
let nVid = 0;
const reg = (abs) => {
  if (!varOf.has(abs)) {
    const v = "g" + nImg++;
    varOf.set(abs, v);
    imports.push(`import ${v} from "${importAlias(abs)}";`);
  }
  return varOf.get(abs);
};
const itemLit = (item) => {
  const name = JSON.stringify(baseName(item.abs));
  if (item.kind === "image") {
    return `{ kind: "image", src: ${reg(item.abs)}, name: ${name} }`;
  }
  const { url, posterUrl } = publishVideo(item.abs);
  nVid++;
  const poster = posterUrl ? `, poster: ${JSON.stringify(posterUrl)}` : "";
  return `{ kind: "video", src: ${JSON.stringify(url)}${poster}, name: ${name} }`;
};

let body = "export const galleries: Record<string, SectionGallery> = {\n";
for (const sec of sections) {
  body += `  ${JSON.stringify(sec.slug)}: {\n`;
  body += `    folder: ${JSON.stringify(sec.folder)},\n`;
  body += `    rootItems: [${sec.rootItems.map(itemLit).join(", ")}],\n`;
  body += `    groups: [\n`;
  for (const g of sec.groups) {
    body += `      { name: ${JSON.stringify(g.name)}, path: ${JSON.stringify(
      g.path
    )}, items: [${g.items.map(itemLit).join(", ")}] },\n`;
  }
  body += `    ],\n  },\n`;
}
body += "};\n";

const header =
  `/* eslint-disable */\n` +
  `// AUTO-GENERATED by scripts/gen-galleries.cjs — DO NOT EDIT BY HAND.\n` +
  `// Run \`node scripts/gen-galleries.cjs\` after changing media.\n` +
  `import type { StaticImageData } from "next/image";\n` +
  imports.join("\n") +
  `\n\n` +
  `export interface GalleryImage { kind: "image"; src: StaticImageData; name: string; }\n` +
  `export interface GalleryVideo { kind: "video"; src: string; poster?: string; name: string; }\n` +
  `export type GalleryMedia = GalleryImage | GalleryVideo;\n` +
  `export interface GalleryGroup { name: string; path: string[]; items: GalleryMedia[]; }\n` +
  `export interface SectionGallery { folder: string; rootItems: GalleryMedia[]; groups: GalleryGroup[]; }\n\n`;

fs.writeFileSync(path.join(ROOT, "lib", "galleries.generated.ts"), header + body);
console.log(`lib/galleries.generated.ts -> ${nImg} images, ${nVid} videos, ${sections.length} sections`);

// ---- Visual selection: landscape loose photos of the "foto" section --------
(async () => {
  const foto = sections.find((s) => s.slug === "foto");
  const vsImports = [];
  const vsItems = [];
  let m = 0;
  if (foto) {
    for (const item of foto.rootItems) {
      if (item.kind !== "image") continue;
      const meta = await sharp(item.abs).metadata();
      if ((meta.width || 0) > (meta.height || 0)) {
        const v = "v" + m++;
        vsImports.push(`import ${v} from "${importAlias(item.abs)}";`);
        vsItems.push(`  { src: ${v}, name: ${JSON.stringify(baseName(item.abs))} }`);
      }
    }
  }
  const vs =
    `/* eslint-disable */\n` +
    `// AUTO-GENERATED by scripts/gen-galleries.cjs — DO NOT EDIT BY HAND.\n` +
    `// Landscape loose photos from components/images/fotos for the home "visual selection".\n` +
    `import type { StaticImageData } from "next/image";\n` +
    vsImports.join("\n") +
    `\n\n` +
    `export interface VisualSelectionImage { src: StaticImageData; name: string; }\n` +
    `export const visualSelection: VisualSelectionImage[] = [\n${vsItems.join(",\n")}\n];\n`;
  fs.writeFileSync(path.join(ROOT, "lib", "visual-selection.generated.ts"), vs);
  console.log(`lib/visual-selection.generated.ts -> ${m} landscape photos`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
