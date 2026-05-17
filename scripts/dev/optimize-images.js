/**
 * Optional dev utility — run from repo root: npm run optimize:images
 * Converts JPG/PNG under Assets/images to WebP in Assets/webp/
 */
const imagemin = require("imagemin");
const imageminWebp = require("imagemin-webp");
const path = require("path");

const root = path.resolve(__dirname, "../..");

async function convertToWebP() {
  const files = await imagemin(["Assets/images/**/*.{jpg,png}"], {
    cwd: root,
    destination: path.join(root, "Assets/webp"),
    plugins: [imageminWebp({ quality: 75 })],
  });

  console.log(`Optimized ${files.length} image(s) to Assets/webp/`);
  files.forEach((file) => console.log(" ", file.destinationPath));
}

convertToWebP().catch((err) => {
  console.error(err);
  process.exit(1);
});
