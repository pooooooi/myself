const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "www");
const alwaysCopy = [
  "styles.css",
  "app.js",
  "manifest.json",
  "service-worker.js",
  "icon.svg",
  "site-nav.js",
];
const files = fs
  .readdirSync(root)
  .filter((file) => file.endsWith(".html"))
  .concat(alwaysCopy)
  .filter((file) => fs.existsSync(path.join(root, file)));

const adsensePattern =
  /\s*<script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-4351321635460934"\s+crossorigin="anonymous"><\/script>/g;

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const file of files) {
  const source = path.join(root, file);
  const destination = path.join(outDir, file);
  if (file.endsWith(".html")) {
    const html = fs
      .readFileSync(source, "utf8")
      .replace(adsensePattern, "")
      .replaceAll(' target="_blank" rel="noopener"', "");
    fs.writeFileSync(destination, html);
    continue;
  }
  fs.copyFileSync(source, destination);
}

console.log(`Copied ${files.length} web assets to ${path.relative(root, outDir)}`);
