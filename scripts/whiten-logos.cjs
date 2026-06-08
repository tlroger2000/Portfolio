const sharp = require("sharp");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const VI = path.join(ROOT, "components", "visual_Identity");
const APP = path.join(ROOT, "app");

// Pure-black artwork on transparency → negate flips RGB to white while keeping
// the alpha channel (so anti-aliased edges become clean white edges).
async function whiten(input, output) {
  await sharp(input)
    .ensureAlpha()
    .negate({ alpha: false })
    .trim() // drop the surrounding transparent padding
    .png()
    .toFile(output);
  const m = await sharp(output).metadata();
  console.log(`${path.basename(output)} -> ${m.width}x${m.height}`);
}

async function favicon() {
  const mark = await sharp(path.join(VI, "isologo.png"))
    .ensureAlpha()
    .negate({ alpha: false })
    .trim()
    .resize({ width: 360, height: 360, fit: "inside" })
    .toBuffer();

  const size = 512;
  const bg = { r: 12, g: 12, b: 18, alpha: 1 }; // dark brand background
  await sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(path.join(APP, "icon.png"));
  console.log("app/icon.png -> 512x512 (white mark on dark)");

  await sharp(path.join(APP, "icon.png"))
    .resize(180, 180)
    .png()
    .toFile(path.join(APP, "apple-icon.png"));
  console.log("app/apple-icon.png -> 180x180");
}

(async () => {
  await whiten(path.join(VI, "logo.png"), path.join(VI, "logo-white.png"));
  await whiten(path.join(VI, "isologo.png"), path.join(VI, "isologo-white.png"));
  await favicon();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
