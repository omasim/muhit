import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
import "../src/theme.js";

const theme = globalThis.MuhitTheme;
const source = readFileSync(
  new URL("../src/theme.js", import.meta.url),
  "utf8",
);
const css = readFileSync(
  new URL("../styles/tokens.css", import.meta.url),
  "utf8",
);
const schema = JSON.parse(
  readFileSync(
    new URL("../schemas/theme.schema.json", import.meta.url),
    "utf8",
  ),
);
const required = [
  "bg",
  "surface",
  "surface-2",
  "text",
  "muted",
  "border",
  "border-strong",
  "accent",
  "on-accent",
  "accent-soft",
  "link",
  "focus",
  "success",
  "success-bg",
  "warning",
  "warning-bg",
  "danger",
  "danger-bg",
  "info",
  "info-bg",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "on-chart-1",
  "on-chart-2",
  "on-chart-3",
  "on-chart-4",
  "sand",
  "ink",
  "line",
  "line-strong",
  "logo-ink",
  "logo-sage",
  "sage",
  "sky",
  "terra",
  "ochre",
  "font-sans",
  "font-serif",
  "font-ui",
  "font-display",
  "font-body",
  "font-heading",
  "radius-sm",
  "radius-md",
  "radius-lg",
  "space-card",
  "cell-y",
  "text-scale",
  "motion",
  "backdrop",
  "shadow-overlay",
].map((name) => "--mh-" + name);
function fakeRoot() {
  const properties = new Map([["--unrelated", "keep"]]);
  const attributes = new Map([["lang", "tr"]]);
  return {
    properties,
    attributes,
    style: {
      setProperty(key, value) {
        properties.set(key, value);
      },
    },
    setAttribute(key, value) {
      attributes.set(key, value);
    },
  };
}
function validatesInvalid(input) {
  assert.throws(
    () => theme.normalizeConfig(input),
    (error) => ["TypeError", "RangeError"].includes(error.name),
  );
}

test("Node-safe IIFE publishes only its frozen API without reading DOM or storage", () => {
  const context = vm.createContext({});
  vm.runInContext(
    'Object.defineProperty(globalThis,"document",{get(){throw new Error("DOM accessed")}});Object.defineProperty(globalThis,"localStorage",{get(){throw new Error("storage accessed")}});',
    context,
  );
  vm.runInContext(source, context);
  assert.equal(context.MuhitTheme.version, "0.10.0");
  assert.equal(context.MuhitTheme.resolve({}).config.preset, "grove");
  assert.equal(theme.version, "0.10.0");
  assert.ok(Object.isFrozen(theme));
  assert.deepEqual(Object.keys(theme), [
    "version",
    "presets",
    "defaults",
    "normalizeConfig",
    "resolve",
    "apply",
    "contrast",
    "audit",
    "toCSS",
    "toJSON",
    "fromJSON",
  ]);
});

test("Partial configuration fills immutable defaults without retaining the input object", () => {
  const input = { mode: "dark", accent: "#a1b2c3" };
  const config = theme.normalizeConfig(input);
  input.mode = "light";
  assert.equal(config.mode, "dark");
  assert.equal(config.accent, "#A1B2C3");
  assert.equal(config.version, 1);
  assert.deepEqual(theme.normalizeConfig(), theme.defaults);
  assert.notEqual(theme.normalizeConfig(), theme.defaults);
  assert.ok(Object.isFrozen(config));
  assert.ok(Object.isFrozen(theme.defaults));
  assert.throws(() => {
    config.mode = "light";
  }, TypeError);
  assert.deepEqual(theme.normalizeConfig(Object.create(null)), theme.defaults);
});

test("Presets have stable IDs, Turkish names, frozen metadata and valid six-digit color values", () => {
  assert.deepEqual(
    theme.presets.map((item) => item.id),
    ["grove", "clay", "tide", "atelier", "sand", "moss", "plum", "slate"],
  );
  assert.deepEqual(
    theme.presets.map((item) => item.name),
    ["Koru", "Toprak", "Kıyı", "Atölye", "Kum", "Yosun", "Erguvan", "Arduvaz"],
  );
  assert.ok(Object.isFrozen(theme.presets));
  for (const preset of theme.presets) {
    assert.ok(Object.isFrozen(preset));
    assert.ok(Object.isFrozen(preset.colors));
    assert.ok(preset.description.length > 10);
    assert.deepEqual(Object.keys(preset.colors), [
      "accent",
      "background",
      "surface",
      "text",
      "secondary",
      "tertiary",
    ]);
    Object.values(preset.colors).forEach((color) =>
      assert.match(color, /^#[0-9A-F]{6}$/),
    );
  }
  assert.throws(() => theme.presets.push({}), TypeError);
  assert.throws(() => {
    theme.presets[0].colors.accent = "#000000";
  }, TypeError);
});

test("Unknown fields, types, unsafe records, inherited settings and accessors are rejected", () => {
  [
    null,
    false,
    "grove",
    1,
    [],
    new Date(),
    new (class Config {})(),
    Object.create({ mode: "dark" }),
    { unknown: 1 },
    { version: 2 },
    { version: "1" },
    { preset: "forest" },
    { mode: "auto" },
    { mode: undefined },
    { font: "Arial" },
    { density: "dense" },
    { radius: 12 },
    { scale: "1" },
    { scale: 1.2 },
    { scale: NaN },
    { scale: Infinity },
    { motion: false },
    { border: true },
    { accent: undefined },
    { accent: "#fff" },
    { accent: "red" },
    { accent: "#12345678" },
    { accent: " #123456" },
    { accent: "#123456; color:red" },
    { accent: 123456 },
    JSON.parse('{"__proto__":{"polluted":true}}'),
    { constructor: {} },
    { prototype: {} },
  ].forEach(validatesInvalid);
  const symbol = { [Symbol("mode")]: "dark" };
  validatesInvalid(symbol);
  const hidden = {};
  Object.defineProperty(hidden, "unknown", { value: true });
  validatesInvalid(hidden);
  let accessed = false;
  const accessor = {};
  Object.defineProperty(accessor, "mode", {
    get() {
      accessed = true;
      return "dark";
    },
  });
  validatesInvalid(accessor);
  assert.equal(accessed, false);
  assert.equal({}.polluted, undefined);
});

test("Every permitted typography, density, shape, scale, motion and border option resolves", () => {
  for (const font of ["editorial", "humanist", "system"])
    for (const density of ["comfortable", "compact"])
      for (const radius of ["soft", "round", "square"])
        for (const scale of [1, 1.125, 1.25])
          for (const motion of ["system", "reduced"])
            for (const border of ["subtle", "strong"]) {
              const { config, tokens } = theme.resolve({
                font,
                density,
                radius,
                scale,
                motion,
                border,
              });
              assert.equal(config.font, font);
              assert.equal(tokens["--mh-text-scale"], String(scale));
              assert.equal(
                tokens["--mh-space-card"],
                density === "compact" ? "16px" : "24px",
              );
              assert.equal(
                tokens["--mh-cell-y"],
                density === "compact" ? "10px" : "16px",
              );
              assert.equal(
                tokens["--mh-motion"],
                motion === "reduced" ? "0ms" : "160ms ease",
              );
              assert.equal(tokens["--mh-font-body"], tokens["--mh-font-ui"]);
              assert.equal(
                tokens["--mh-font-heading"],
                tokens["--mh-font-display"],
              );
              if (font === "editorial")
                assert.match(tokens["--mh-font-display"], /Source Serif 4/);
              if (font === "humanist")
                assert.match(tokens["--mh-font-display"], /Manrope/);
              if (font === "system")
                assert.match(tokens["--mh-font-ui"], /^system-ui/);
              if (radius === "square")
                assert.equal(tokens["--mh-radius-lg"], "0px");
              if (border === "strong")
                assert.equal(
                  tokens["--mh-border"],
                  tokens["--mh-border-strong"],
                );
            }
});

for (const preset of ["grove", "clay", "tide", "atelier"])
  for (const mode of ["light", "dark"]) {
    test(`${preset}/${mode}: all normal text, focus, semantic and chart checks pass including extreme custom accents`, () => {
      for (const accent of [
        null,
        "#FFFFFF",
        "#000000",
        "#FFFFEE",
        "#010101",
        "#808080",
        "#FF0000",
        "#00FF00",
        "#0000FF",
        "#FF00FF",
        "#ABCDEF",
      ]) {
        const result = theme.resolve({ preset, mode, accent });
        const { tokens } = result;
        assert.ok(Object.isFrozen(result));
        assert.ok(Object.isFrozen(result.config));
        assert.ok(Object.isFrozen(tokens));
        required.forEach((key) =>
          assert.equal(typeof tokens[key], "string", key),
        );
        if (accent) assert.equal(tokens["--mh-accent"], accent);
        const report = theme.audit({ preset, mode, accent });
        assert.equal(report.length, 18);
        assert.ok(Object.isFrozen(report));
        assert.equal(new Set(report.map((row) => row.id)).size, report.length);
        report.forEach((row) => {
          assert.deepEqual(Object.keys(row), [
            "id",
            "label",
            "ratio",
            "minimum",
            "pass",
          ]);
          assert.ok(Number.isFinite(row.ratio));
          assert.ok(row.ratio >= 1 && row.ratio <= 21);
          assert.equal(row.pass, row.ratio >= row.minimum);
          assert.equal(
            row.pass,
            true,
            JSON.stringify({ preset, mode, accent, row }),
          );
        });
        assert.equal(tokens["--mh-sand"], tokens["--mh-bg"]);
        assert.equal(tokens["--mh-ink"], tokens["--mh-text"]);
        assert.equal(tokens["--mh-line"], tokens["--mh-border"]);
        assert.equal(tokens["--mh-line-strong"], tokens["--mh-border-strong"]);
        assert.equal(tokens["--mh-logo-ink"], tokens["--mh-accent"]);
        assert.equal(tokens["--mh-sage"], tokens["--mh-accent-soft"]);
      }
    });
  }

test("WCAG relative luminance contrast is symmetric, exact for black/white, and never rounded", () => {
  assert.equal(theme.contrast("#000000", "#FFFFFF"), 21);
  assert.equal(theme.contrast("#FFFFFF", "#000000"), 21);
  assert.equal(theme.contrast("#456789", "#456789"), 1);
  assert.equal(
    theme.contrast("#abcdef", "#123456"),
    theme.contrast("#123456", "#ABCDEF"),
  );
  const below = theme.contrast("#777777", "#FFFFFF");
  assert.ok(below < 4.5 && below > 4.47);
  assert.notEqual(below, Number(below.toFixed(2)));
  assert.ok(theme.contrast("#767676", "#FFFFFF") >= 4.5);
  ["red", "#fff", "#12345678", null, 42].forEach((color) =>
    assert.throws(() => theme.contrast(color, "#FFFFFF"), TypeError),
  );
});

test("Audit computes actual minimum contrast over used surfaces, not display-rounded values", () => {
  const config = { preset: "tide", mode: "dark", accent: "#123456" };
  const { tokens } = theme.resolve(config);
  const report = theme.audit(config);
  const all = [
    "--mh-bg",
    "--mh-surface",
    "--mh-surface-2",
    "--mh-accent-soft",
    "--mh-success-bg",
    "--mh-warning-bg",
    "--mh-danger-bg",
    "--mh-info-bg",
  ];
  for (const id of ["text", "muted"])
    assert.equal(
      report.find((row) => row.id === id).ratio,
      Math.min(
        ...all.map((key) => theme.contrast(tokens["--mh-" + id], tokens[key])),
      ),
    );
  assert.equal(
    report.find((row) => row.id === "on-accent").ratio,
    theme.contrast(tokens["--mh-on-accent"], tokens["--mh-accent"]),
  );
});

test("apply changes only its CSS variables and four theme attributes and returns the resolved frozen object", () => {
  const root = fakeRoot();
  const result = theme.apply(
    { preset: "clay", mode: "dark", density: "compact", motion: "reduced" },
    root,
  );
  assert.deepEqual(
    [...root.attributes.keys()],
    [
      "lang",
      "data-mh-root",
      "data-mh-mode",
      "data-mh-density",
      "data-mh-motion",
    ],
  );
  assert.equal(root.attributes.get("data-mh-root"), "");
  assert.equal(root.attributes.get("data-mh-mode"), "dark");
  assert.equal(root.attributes.get("data-mh-density"), "compact");
  assert.equal(root.attributes.get("data-mh-motion"), "reduced");
  assert.equal(root.properties.get("--unrelated"), "keep");
  assert.equal(root.attributes.get("lang"), "tr");
  for (const [key, value] of Object.entries(result.tokens))
    assert.equal(root.properties.get(key), value);
  assert.ok(Object.isFrozen(result));
  assert.deepEqual(result, theme.resolve(result.config));
});

test("apply uses the browser document root when omitted; Node omission is a clear error", () => {
  const root = fakeRoot();
  const context = vm.createContext({ document: { documentElement: root } });
  vm.runInContext(source, context);
  context.MuhitTheme.apply({ mode: "dark" });
  assert.equal(root.attributes.get("data-mh-mode"), "dark");
  assert.throws(() => theme.apply(), TypeError);
  assert.throws(() => theme.apply({}, null), TypeError);
  assert.throws(() => theme.apply({}, {}), TypeError);
});

test("Invalid apply input is rejected before any root mutation", () => {
  const root = fakeRoot();
  assert.throws(() => theme.apply({ accent: "url(evil)" }, root), TypeError);
  assert.deepEqual([...root.properties], [["--unrelated", "keep"]]);
  assert.deepEqual([...root.attributes], [["lang", "tr"]]);
});

test("JSON export contains normalized configuration only and round-trips every palette/mode", () => {
  for (const preset of ["grove", "clay", "tide", "atelier"])
    for (const mode of ["light", "dark"]) {
      const config = {
        preset,
        mode,
        accent: "#abcDEF",
        font: "humanist",
        density: "compact",
        radius: "round",
        scale: 1.25,
        motion: "reduced",
        border: "strong",
      };
      const output = theme.toJSON(config);
      const parsed = JSON.parse(output);
      assert.deepEqual(Object.keys(parsed), Object.keys(theme.defaults));
      assert.equal(parsed.version, 1);
      assert.equal("tokens" in parsed, false);
      assert.deepEqual(theme.fromJSON(output), theme.normalizeConfig(config));
      assert.ok(Object.isFrozen(theme.fromJSON(output)));
      assert.equal(theme.toJSON(theme.fromJSON(output)), output);
    }
  assert.deepEqual(theme.fromJSON("{}"), theme.defaults);
  assert.throws(() => theme.fromJSON("{"), SyntaxError);
  assert.throws(() => theme.fromJSON({}), TypeError);
  ["null", "[]", '{"version":2}', '{"tokens":{}}', '{"__proto__":{}}'].forEach(
    (value) => assert.throws(() => theme.fromJSON(value)),
  );
});

test("CSS export has all resolved values, deterministic output and no configuration-derived injection path", () => {
  const config = { preset: "atelier", mode: "dark", accent: "#ffccdd" };
  const { tokens } = theme.resolve(config);
  const exported = theme.toCSS(config);
  assert.match(exported, /^:root \{\n/);
  assert.ok(exported.endsWith("\n}\n"));
  Object.entries(tokens).forEach(([key, value]) =>
    assert.ok(exported.includes(`  ${key}: ${value};\n`)),
  );
  assert.equal(exported, theme.toCSS(theme.normalizeConfig(config)));
  assert.throws(() => theme.toCSS({ font: '"; color:red' }));
});

test("Fallback CSS matches default resolved tokens and provides local font and reduced-motion support", () => {
  Object.entries(theme.resolve().tokens).forEach(([key, value]) =>
    assert.ok(css.includes(`  ${key}: ${value};`), key),
  );
  assert.doesNotMatch(css, /@font-face/);
  assert.match(readFileSync(new URL("../styles/font-sans.css", import.meta.url), "utf8"), /Manrope-Variable\.woff2/);
  assert.match(readFileSync(new URL("../styles/font-serif.css", import.meta.url), "utf8"), /SourceSerif4-Variable\.woff2/);
  assert.ok(
    existsSync(
      new URL("../assets/fonts/Manrope-Variable.ttf", import.meta.url),
    ),
  );
  assert.ok(
    existsSync(
      new URL("../assets/fonts/SourceSerif4-Variable.ttf", import.meta.url),
    ),
  );
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /data-mh-motion="reduced"/);
  assert.match(css, /data-mh-mode="dark".*color-scheme:dark/);
  assert.match(css, /\.mh-scope\{color-scheme:inherit\}/);
  assert.doesNotMatch(css, /:root\s*\*/);
  assert.doesNotMatch(css, /:root[^{}]*\{[^}]*color-scheme:/);
  assert.doesNotMatch(css, /https?:\/\/|@import/);
});

test("CSS-only export preserves native color scheme, scoped reduced motion and system motion preference", () => {
  for (const mode of ["light", "dark"])
    for (const motion of ["system", "reduced"]) {
      const exported = theme.toCSS({ mode, motion });
      assert.match(exported, new RegExp("color-scheme: " + mode + ";"));
      assert.match(exported, /@media \(prefers-reduced-motion: reduce\)/);
      assert.match(exported, /:where\(\.mh-scope, \[data-mh-root\]\)/);
      assert.doesNotMatch(exported, /:root\s*\*/);
      const unconditional = exported.split("@media")[0];
      assert.equal(
        unconditional.includes("animation: none !important"),
        motion === "reduced",
      );
      assert.equal(
        unconditional.includes("transition: none !important"),
        motion === "reduced",
      );
    }
});

test("Schema documents exactly the accepted fields, enums, defaults and six-digit accent syntax", () => {
  assert.equal(schema.type, "object");
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(Object.keys(schema.properties), Object.keys(theme.defaults));
  for (const [key, value] of Object.entries(theme.defaults))
    assert.deepEqual(schema.properties[key].default, value);
  for (const key of [
    "preset",
    "mode",
    "font",
    "density",
    "radius",
    "scale",
    "motion",
    "border",
  ])
    for (const value of schema.properties[key].enum)
      assert.equal(theme.normalizeConfig({ [key]: value })[key], value);
  const pattern = new RegExp(schema.properties.accent.anyOf[1].pattern);
  assert.ok(pattern.test("#abcdef"));
  assert.ok(pattern.test("#ABCDEF"));
  assert.equal(pattern.test("#fff"), false);
});

test('layout preferences survive export and are accepted by the agent contract', () => {
  const config={cardSurface:'tinted',layoutGap:'airy',tableRows:'striped',tableHeader:'sticky'};
  const resolved=theme.resolve(config);
  assert.equal(resolved.tokens['--mh-layout-gap'],'36px');
  assert.equal(resolved.tokens['--mh-table-header-position'],'sticky');
  assert.equal(resolved.tokens['--mh-table-stripe'],resolved.tokens['--mh-surface-2']);
  assert.deepEqual(theme.fromJSON(theme.toJSON(config)),resolved.config);
  for(const key of Object.keys(config))assert.throws(()=>theme.normalizeConfig({[key]:'url(javascript:bad)'}));
});
