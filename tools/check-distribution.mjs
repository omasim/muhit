import {provenance} from './provenance.mjs';
import { readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
const root = fileURLToPath(new URL("../", import.meta.url));
async function scan(entry, files = new Map()) {
  const full = path.resolve(root, entry);
  if (files.has(full)) return files;
  const text = await readFile(full, "utf8");
  files.set(full, text);
  for (const m of text.matchAll(/@import\s+url\(["'](.+?)["']\)/g))
    await scan(
      path.relative(root, path.resolve(path.dirname(full), m[1])),
      files,
    );
  return files;
}
const report = {};
for (const entry of [
  "base.css",
  "form-entry.css",
  "data-grid-entry.css",
  "plot-entry.css",
  "interactive-entry.css",
  "index.css",
  "pages.css",
]) {
  const files = await scan("styles/" + entry);
  const fonts = new Set();
  for (const [f, t] of files)
    for (const m of t.matchAll(/url\(["']([^"']+\.woff2)["']\)/g))
      fonts.add(path.resolve(path.dirname(f), m[1]));
  const css = [...files.values()].join("\n");
  const fontBytes = (
    await Promise.all([...fonts].map(async (f) => (await stat(f)).size))
  ).reduce((a, b) => a + b, 0);
  const record = {
    cssBytes: Buffer.byteLength(css),
    cssGzipBytes: gzipSync(css).length,
    fontBytes,
    requests: files.size + fonts.size,
    totalBytes: Buffer.byteLength(css) + fontBytes,
  };
  if (
    record.cssBytes > 85000 ||
    record.cssGzipBytes > 16000 ||
    record.fontBytes > 500000 ||
    record.requests > 14
  )
    throw Error("Distribution budget exceeded: " + entry);
  if (entry !== "index.css" && fonts.size)
    throw Error("Optional entry must not load fonts");
  report[entry] = record;
}
await writeFile(
  path.join(root, "tests/distribution-verification.json"),
  JSON.stringify({...report,provenance:await provenance()}, null, 2) + "\n",
);
console.log("PASS CSS/font/request budgets", report);
