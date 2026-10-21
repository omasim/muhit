import { readFile, writeFile } from "node:fs/promises";
const root = new URL("../", import.meta.url),
  f = JSON.parse(
    await readFile(new URL("schemas/foundations.json", root), "utf8"),
  );
const body = JSON.stringify(f, null, 2);
await writeFile(
  new URL("src/foundations.js", root),
  '// Generated from schemas/foundations.json.\n(function(global){"use strict";const data=' +
    body +
    ';Object.values(data).forEach(v=>{if(v&&typeof v==="object")Object.freeze(v)});global.MuhitFoundations=Object.freeze(data);})(typeof window !== "undefined" ? window : globalThis);\n',
);
let css = "/* Generated from schemas/foundations.json. */\n.mh-scope {\n";
for (const group of ["space", "layer", "duration", "size", "breakpoint"])
  for (const [key, val] of Object.entries(f[group]))
    css += `  --mh-${group}-${key}: ${val}${group === "layer" ? "" : group === "duration" ? "ms" : "px"};\n`;
css +=
  '}\n@media(prefers-reduced-motion:reduce){.mh-scope{--mh-duration-fast:0ms;--mh-duration-normal:0ms;--mh-duration-slow:0ms}}\n[data-mh-motion="reduced"],[data-mh-motion="reduced"] .mh-scope{--mh-duration-fast:0ms;--mh-duration-normal:0ms;--mh-duration-slow:0ms}\n';
await writeFile(new URL("styles/foundations.css", root), css);
