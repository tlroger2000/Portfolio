// One-shot (manual) media optimiser. Shrinks the SOURCE files in
// components/images IN PLACE so the project stays small:
//   - JPGs  -> max 2560px wide, quality 80 (mozjpeg)
//   - PNGs  -> max 2560px wide, lossless re-compress
//   - videos-> H.264 CRF 23, max 1920px wide, +faststart (replaces original)
//   - *.psd -> deleted (not used on the web)
//
//   npm run optimize:media   (then `npm run gen:galleries` re-copies videos)
//
// Idempotent via scripts/.media-cache.json, so re-runs skip already-done files.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const sharp = require("sharp");
const ffmpegPath = require("ffmpeg-static");

const ROOT = path.resolve(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "components", "images");
const CACHE_FILE = path.join(__dirname, ".media-cache.json");

const MAX_IMG = 2560;
const MAX_VID = 1920;
const SKIP_NAMES = new Set(["silueta.png", "silueta.webp"]);

const IMG_JPG = /\.(jpe?g)$/i;
const IMG_PNG = /\.png$/i;
const VIDEO_RE = /\.(mp4|mov|webm|m4v)$/i;

const cache = fs.existsSync(CACHE_FILE) ? JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")) : {};
const saveCache = () => fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
const mb = (b) => (b / 1048576).toFixed(1) + "MB";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

let savedTotal = 0;

(async () => {
  const files = walk(IMAGES_DIR);

  for (const abs of files) {
    const name = path.basename(abs);
    const rel = path.relative(ROOT, abs);
    if (SKIP_NAMES.has(name)) continue;

    // Delete unused source-only formats.
    if (/\.psd$/i.test(name)) {
      const sz = fs.statSync(abs).size;
      fs.unlinkSync(abs);
      savedTotal += sz;
      console.log(`deleted  ${rel}  (-${mb(sz)})`);
      continue;
    }

    const before = fs.statSync(abs).size;
    if (cache[rel] === before) continue; // already optimised

    const isJpg = IMG_JPG.test(name);
    const isPng = IMG_PNG.test(name);
    const isVid = VIDEO_RE.test(name);
    if (!isJpg && !isPng && !isVid) continue; // pdf / other: leave as-is

    let lastErr = null;
    // Retry: Windows briefly locks files (antivirus / indexer) during the
    // rapid read-write sequence, surfacing as transient "UNKNOWN open" errors.
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        if (isJpg || isPng) {
          const img = sharp(abs, { failOn: "none" });
          const meta = await img.metadata();
          const resized = img.resize({
            width: Math.min(meta.width || MAX_IMG, MAX_IMG),
            withoutEnlargement: true,
          });
          const buf = await (isJpg
            ? resized.jpeg({ quality: 80, mozjpeg: true })
            : resized.png({ compressionLevel: 9, effort: 10 })
          ).toBuffer();
          if (buf.length < before) fs.writeFileSync(abs, buf);
        } else {
          const tmp = abs + ".opt.mp4";
          execFileSync(
            ffmpegPath,
            [
              "-y", "-i", abs,
              "-vf", `scale='min(${MAX_VID},iw)':-2`,
              "-c:v", "libx264", "-crf", "23", "-preset", "medium", "-pix_fmt", "yuv420p",
              "-c:a", "aac", "-b:a", "128k",
              "-movflags", "+faststart",
              tmp,
            ],
            { stdio: "ignore" }
          );
          const optSize = fs.existsSync(tmp) ? fs.statSync(tmp).size : Infinity;
          if (optSize > 0 && optSize < before) fs.renameSync(tmp, abs);
          else if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
        }

        const after = fs.statSync(abs).size;
        cache[rel] = after;
        savedTotal += Math.max(before - after, 0);
        console.log(`${after < before ? "optimised" : "kept     "} ${rel}  ${mb(before)} -> ${mb(after)}`);
        saveCache();
        lastErr = null;
        break;
      } catch (e) {
        lastErr = e;
        await sleep(600 * attempt);
      }
    }
    if (lastErr) console.warn(`SKIP ${rel}: ${lastErr.message}`);
  }

  saveCache();
  console.log(`\nDone. Reclaimed ~${mb(savedTotal)}.`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
