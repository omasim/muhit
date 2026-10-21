import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { MuhitTokens, MuhitPages, MuhitSystem } from "../src/index.mjs";
const load = async (name) =>
  JSON.parse(
    await readFile(
      new URL("../schemas/" + name + ".json", import.meta.url),
      "utf8",
    ),
  );
const manifest = await load("components"),
  contracts = await load("component-contracts"),
  pages = await load("pages");
for (const kind of manifest.adapter.renderKinds) {
  const c = contracts.contracts.find((c) => c.id === kind);
  assert.ok(c, kind);
  for (const field of [
    "purpose",
    "anatomy",
    "api",
    "states",
    "behavior",
    "stateOwner",
    "responsive",
    "lifecycle",
    "accessibility",
    "acceptance",
    "owner",
    "status",
  ])
    assert.ok(c[field], kind + ": " + field);
  await access(new URL("../docs/" + c.docs, import.meta.url));
}
assert.equal(
  new Set(contracts.contracts.map((c) => c.id)).size,
  contracts.contracts.length,
);
for (const recipe of pages.recipes) {
  assert.ok(
    MuhitPages.validate({
      version: "1.0.0",
      recipe: recipe.id,
      title: recipe.label,
    }).valid,
  );
  await access(
    new URL("../" + recipe.example.replace("../", ""), import.meta.url),
  );
}
const modes = JSON.parse(
  await readFile(new URL("../tokens/manifest.json", import.meta.url), "utf8"),
);
for (const mode of modes.modes) {
  const doc = JSON.parse(
    await readFile(new URL("../tokens/" + mode.file, import.meta.url), "utf8"),
  );
  assert.ok(MuhitTokens.validate(doc).valid);
  assert.deepEqual(
    doc,
    MuhitTokens.document({ preset: mode.preset, mode: mode.mode }),
    "Stale generated tokens",
  );
}
assert.equal(
  contracts.packageVersion,
  JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  ).version,
);
assert.ok(MuhitSystem.patterns.length >= 8);
console.log(
  "PASS system contracts:",
  contracts.contracts.length,
  "components,",
  pages.recipes.length,
  "recipes,",
  modes.modes.length,
  "token modes",
);
