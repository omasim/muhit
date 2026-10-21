import { mkdir, writeFile } from "node:fs/promises";
import { MuhitTheme, MuhitTokens } from "../src/index.mjs";
const root = new URL("../", import.meta.url);
await mkdir(new URL("tokens/", root), { recursive: true });
const modes = [];
for (const preset of MuhitTheme.presets.map((p) => p.id))
  for (const mode of ["light", "dark"]) {
    const input = { preset, mode },
      doc = MuhitTokens.document(input),
      result = MuhitTokens.validate(doc);
    if (!result.valid) throw Error(result.errors.join("; "));
    const name = preset + "-" + mode + ".tokens.json";
    await writeFile(
      new URL("tokens/" + name, root),
      JSON.stringify(doc, null, 2) + "\n",
    );
    modes.push({ preset, mode, file: name, count: result.count });
  }
await writeFile(
  new URL("tokens/manifest.json", root),
  JSON.stringify(
    {
      version: "1.0.0",
      format: "DTCG typed portable subset",
      source: "src/theme.js + schemas/foundations.json",
      modes,
      figma:
        "Import with a DTCG-capable tool; font families and compound CSS may require explicit mapping. Native Figma parity has not been certified.",
    },
    null,
    2,
  ) + "\n",
);
console.log("Built", modes.length, "token modes");
