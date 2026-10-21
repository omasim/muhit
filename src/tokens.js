/* Muhit token graph: existing theme values remain canonical. */
(function (global) {
  "use strict";
  const { json, object } = global.MuhitContracts;
  const aliases = {
    "color.text.primary": "text",
    "color.text.secondary": "muted",
    "color.surface.canvas": "bg",
    "color.surface.primary": "surface",
    "color.surface.secondary": "surface-2",
    "color.action.primary": "accent",
    "color.action.onPrimary": "on-accent",
    "color.action.link": "link",
    "color.border.default": "border",
    "color.border.strong": "border-strong",
    "color.focus.ring": "focus",
    "space.component": "space-card",
    "size.control": "control-height",
    "radius.control": "radius-sm",
    "radius.surface": "radius-lg",
    "typography.body.family": "font-body",
    "typography.heading.family": "font-heading",
    "typography.body.scale": "text-scale",
    "typography.body.lineHeight": "line-height",
  };
  const componentAliases = {
    "button.primary.background": "color.action.primary",
    "button.primary.foreground": "color.action.onPrimary",
    "button.height": "size.control",
    "input.border": "color.border.strong",
    "input.radius": "radius.control",
    "card.padding": "space.component",
    "card.background": "color.surface.primary",
    "card.radius": "radius.surface",
    "dialog.background": "color.surface.primary",
    "table.foreground": "color.text.primary",
    "chart.label": "color.text.primary",
  };
  const foundation = global.MuhitFoundations;
  function compose(layers = [], options = {}) {
    object(options, ["systemMode"]);
    if (!Array.isArray(layers) || layers.length > 8)
      throw TypeError("At most eight theme layers");
    if (
      options.systemMode !== undefined &&
      !["light", "dark"].includes(options.systemMode)
    )
      throw TypeError("Invalid system mode");
    let config = {};
    for (const layer of layers) {
      const clean = json(layer);
      object(clean, Object.keys(global.MuhitTheme.defaults));
      if (clean.mode === "system") clean.mode = options.systemMode || "light";
      global.MuhitTheme.normalizeConfig(clean);
      Object.assign(config, clean);
    }
    return global.MuhitTheme.normalizeConfig(config);
  }
  function typed(value) {
    if (/^#[\da-f]{6}$/i.test(value)) {
      return {
        $type: "color",
        $value: {
          colorSpace: "srgb",
          components: [1, 3, 5].map(
            (i) => parseInt(value.slice(i, i + 2), 16) / 255,
          ),
          alpha: 1,
        },
      };
    }
    if (/^\d+(\.\d+)?px$/.test(value))
      return {
        $type: "dimension",
        $value: { value: parseFloat(value), unit: "px" },
      };
    if (/^\d+(\.\d+)?$/.test(value))
      return { $type: "number", $value: Number(value) };
    if (value.includes(",") && !value.includes("("))
      return {
        $type: "fontFamily",
        $value: value
          .split(",")
          .map((s) => s.trim().replace(/^['\"]|['\"]$/g, "")),
      };
    if (value === "transparent")
      return {
        $type: "color",
        $value: { colorSpace: "srgb", components: [0, 0, 0], alpha: 0 },
      };
    return null;
  }
  function put(root, path, token) {
    const parts = path.split(".");
    let node = root;
    for (const key of parts.slice(0, -1)) node = node[key] || (node[key] = {});
    node[parts.at(-1)] = token;
  }
  function document(input = {}) {
    const { config, tokens } = global.MuhitTheme.resolve(input),
      out = {
        $description:
          "Muhit resolved token graph; values derived from the canonical theme engine.",
        $extensions: {
          "org.muhit": {
            version: "1.0.0",
            theme: config,
            scope:
              "Typed portable subset; non-token CSS values in cssValues. Theme modes exported separately",
            cssValues: {},
          },
        },
      };
    for (const [css, value] of Object.entries(tokens)) {
      const key = css.slice(5);
      if (!typed(value)) {
        out.$extensions["org.muhit"].cssValues[css] = value;
        continue;
      }
      put(out, "primitive.theme." + key, {
        ...typed(value),
        $description: "Canonical " + css,
        $extensions: { "org.muhit": { css } },
      });
      put(out, "semantic.legacy." + key, {
        $type: typed(value).$type,
        $value: "{primitive.theme." + key + "}",
        $description: "Compatibility role " + css,
      });
    }
    for (const group of ["space", "layer", "duration", "size", "breakpoint"])
      for (const [key, val] of Object.entries(foundation[group]))
        put(out, "primitive." + group + "." + key, {
          $type:
            group === "layer"
              ? "number"
              : group === "duration"
                ? "duration"
                : "dimension",
          $value:
            group === "layer"
              ? val
              : { value: val, unit: group === "duration" ? "ms" : "px" },
          $description: group + " scale " + key,
        });
    for (const [path, key] of Object.entries(aliases))
      put(out, "semantic." + path, {
        $type: typed(tokens["--mh-" + key]).$type,
        $value: "{primitive.theme." + key + "}",
        $description: "Semantic role " + path,
      });
    for (const [path, ref] of Object.entries(componentAliases)) {
      const key = aliases[ref];
      put(out, "component." + path, {
        $type: typed(tokens["--mh-" + key]).$type,
        $value: "{semantic." + ref + "}",
        $description: "Component role " + path,
      });
    }
    return out;
  }
  function validate(input) {
    const errors = [],
      map = new Map();
    let data;
    try {
      data = json(input);
    } catch (e) {
      return { valid: false, errors: [e.message], count: 0 };
    }
    function walk(node, path = "") {
      if (!node || typeof node !== "object" || Array.isArray(node)) return;
      if ("$value" in node) {
        map.set(path, node);
        if (
          !["color", "dimension", "duration", "number", "fontFamily"].includes(
            node.$type,
          )
        )
          errors.push(path + ": unsupported type");
        if (!node.$description) errors.push(path + ": description required");
        return;
      }
      for (const [k, v] of Object.entries(node))
        if (!k.startsWith("$")) walk(v, path ? path + "." + k : k);
    }
    walk(data);
    function resolve(key, stack = []) {
      if (stack.includes(key)) throw Error(key + ": reference cycle");
      const token = map.get(key);
      if (!token) throw Error(key + ": missing reference");
      if (typeof token.$value === "string" && /^\{.*\}$/.test(token.$value)) {
        const ref = token.$value.slice(1, -1),
          target = map.get(ref);
        if (target && target.$type !== token.$type)
          throw Error(key + ": reference type mismatch");
        return resolve(ref, [...stack, key]);
      }
      const v = token.$value;
      let valid = false;
      switch (token.$type) {
        case "number":
          valid = typeof v === "number" && Number.isFinite(v);
          break;
        case "fontFamily":
          valid =
            typeof v === "string" ||
            (Array.isArray(v) &&
              v.length > 0 &&
              v.every((s) => typeof s === "string" && s.length > 0));
          break;
        case "dimension":
        case "duration":
          valid =
            v &&
            typeof v.value === "number" &&
            Number.isFinite(v.value) &&
            v.value >= 0 &&
            (token.$type === "duration" ? ["ms", "s"] : ["px", "rem"]).includes(
              v.unit,
            );
          break;
        case "color":
          valid =
            v &&
            v.colorSpace === "srgb" &&
            Array.isArray(v.components) &&
            v.components.length === 3 &&
            v.components.every(
              (n) => typeof n === "number" && n >= 0 && n <= 1,
            ) &&
            typeof v.alpha === "number" &&
            v.alpha >= 0 &&
            v.alpha <= 1;
      }
      if (!valid) throw Error(key + ": invalid value");
      return v;
    }
    for (const key of map.keys())
      try {
        resolve(key);
      } catch (e) {
        errors.push(e.message);
      }
    if (!map.size) errors.push("No tokens");
    return { valid: errors.length === 0, errors, count: map.size };
  }
  function exportJSON(input) {
    return JSON.stringify(document(input), null, 2);
  }
  global.MuhitTokens = Object.freeze({
    version: "1.0.0",
    compose,
    document,
    validate,
    exportJSON,
  });
})(typeof window !== "undefined" ? window : globalThis);
