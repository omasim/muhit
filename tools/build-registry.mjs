import { readFile, writeFile } from "node:fs/promises";
const root = new URL("../", import.meta.url),
  data = {};
for (const [key, file] of Object.entries({
  components: "component-contracts",
  pages: "pages",
  patterns: "patterns",
}))
  data[key] = JSON.parse(
    await readFile(new URL("schemas/" + file + ".json", root), "utf8"),
  );
await writeFile(
  new URL("src/registry.js", root),
  "// Generated from schemas; do not edit.\n(function(global){const data=" +
    JSON.stringify(data) +
    ';function freeze(x){if(x&&typeof x==="object"){Object.values(x).forEach(freeze);Object.freeze(x)}return x}global.MuhitRegistry=freeze(data);})(typeof window !== "undefined" ? window : globalThis);\n',
);
