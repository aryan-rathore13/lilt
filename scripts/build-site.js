#!/usr/bin/env node
// Static landing build. Keep the served installer identical to the release source.
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "site/dist");
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
for (const file of [
  "index.html",
  "style.css",
  "app.js",
  "mark.svg",
  "_headers",
]) {
  cpSync(resolve(root, "site", file), resolve(output, file));
}
cpSync(resolve(root, "install.sh"), resolve(output, "install.sh"));
writeFileSync(resolve(output, "robots.txt"), "User-agent: *\nAllow: /\n");
// Explicit opt-in after a published release; keep unreleased install status honest.
if (process.env.LILT_RELEASE_READY === "1") {
  const indexPath = resolve(output, "index.html");
  const html = readFileSync(indexPath, "utf8").replace(
    /<p class="release-note">[\s\S]*?<\/p>/,
    '<p class="release-note">The installer verifies release checksums before installing. macOS, Linux, and BSD builds available.</p>',
  );
  writeFileSync(indexPath, html);
}
if (!existsSync(resolve(output, "install.sh")))
  throw new Error("Installer is missing");
console.log(
  "Built site/dist: landing page, assets, and synchronized installer.",
);
