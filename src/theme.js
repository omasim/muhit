/* Muhit UI 0.3.1 · MIT · Buildless, dependency-free theme engine. */
(function (global) {
  "use strict";
  const VERSION = "0.9.0";
  const DEFAULTS = Object.freeze({
    version: 1,
    preset: "grove",
    mode: "light",
    accent: null,
    font: "editorial",
    density: "comfortable",
    radius: "soft",
    scale: 1,
    motion: "system",
    border: "subtle",
    elevation: "flat",
    buttonStyle: "solid",
    controlSize: "md",
    headingScale: 1,
    lineHeight: 1.65,
    contentWidth: "balanced",
    borderWidth: 1,
    iconWeight: 1.5,
    accentIntensity: "balanced",
    chartPalette: "natural",
    cardSurface: "plain",
    layoutGap: "balanced",
    tableRows: "plain",
    tableHeader: "static",
  });
  const OPTIONS = Object.freeze({
    cardSurface: ["plain", "tinted", "outline"],
    layoutGap: ["compact", "balanced", "airy"],
    tableRows: ["plain", "striped"],
    tableHeader: ["static", "sticky"],
    preset: [
      "grove",
      "clay",
      "tide",
      "atelier",
      "sand",
      "moss",
      "plum",
      "slate",
    ],
    mode: ["light", "dark"],
    font: ["editorial", "humanist", "system", "book"],
    density: ["comfortable", "compact", "spacious"],
    radius: ["soft", "round", "square", "organic"],
    scale: [1, 1.125, 1.25],
    motion: ["system", "reduced"],
    border: ["subtle", "strong"],
    elevation: ["flat", "soft", "raised"],
    buttonStyle: ["solid", "soft", "outline"],
    controlSize: ["sm", "md", "lg"],
    headingScale: [0.9, 1, 1.15],
    lineHeight: [1.45, 1.65, 1.85],
    contentWidth: ["focused", "balanced", "wide"],
    borderWidth: [1, 2],
    iconWeight: [1.25, 1.5, 2],
    accentIntensity: ["soft", "balanced", "vivid"],
    chartPalette: ["natural", "contrast", "mono"],
  });
  const PALETTES = {
    grove: {
      name: "Koru",
      description: "Yaprak yeşili, açık taş ve sakin ortak alanlar.",
      light: [
        "#F5F4EF",
        "#FFFFFF",
        "#E9EFE8",
        "#202A25",
        "#58625A",
        "#D6DED4",
        "#737F73",
        "#356752",
      ],
      dark: [
        "#171F1B",
        "#202B24",
        "#2A372F",
        "#EDF2E9",
        "#B7C3B7",
        "#3D4E42",
        "#8E9F8D",
        "#A9CEAA",
      ],
      charts: ["#537E63", "#77769D", "#A47932", "#AB6650"],
      darkCharts: ["#A0C7A8", "#B9B3DC", "#E6BE78", "#E2A28C"],
    },
    clay: {
      name: "Toprak",
      description: "Kil, sıcak kâğıt ve insan elinin bıraktığı iz.",
      light: [
        "#FAF3ED",
        "#FFFFFF",
        "#F1E6DC",
        "#352A24",
        "#716055",
        "#E3D2C6",
        "#9E7B63",
        "#9E533A",
      ],
      dark: [
        "#261E1A",
        "#302721",
        "#3E3129",
        "#F6EDE3",
        "#CBBBAC",
        "#584438",
        "#BA9A82",
        "#E6AD8C",
      ],
      charts: ["#9B6046", "#667F65", "#88749B", "#A57E34"],
      darkCharts: ["#E3A182", "#A8C4A1", "#C5B0DE", "#E4C382"],
    },
    tide: {
      name: "Kıyı",
      description: "Suyun ritmi, serin yüzeyler ve açık düşünce.",
      light: [
        "#F0F5F5",
        "#FFFFFF",
        "#E1ECEC",
        "#203338",
        "#526A70",
        "#CBDDDE",
        "#729097",
        "#266976",
      ],
      dark: [
        "#142328",
        "#1C2E34",
        "#293D44",
        "#E7F2F1",
        "#B0C8CA",
        "#38555E",
        "#8CABB1",
        "#93CED0",
      ],
      charts: ["#367888", "#7B749D", "#A17E3C", "#A66652"],
      darkCharts: ["#92C8D3", "#B9B2DE", "#E2C180", "#DEA48F"],
    },
    atelier: {
      name: "Atölye",
      description: "Pigment, düşünce ve birlikte üretmek için alan.",
      light: [
        "#F5F2F8",
        "#FFFFFF",
        "#EAE5F1",
        "#312B3C",
        "#696176",
        "#DCD4E5",
        "#8E7F9E",
        "#715486",
      ],
      dark: [
        "#201D28",
        "#2B2636",
        "#382F44",
        "#F0EBF6",
        "#C5BACF",
        "#53465F",
        "#AA96BC",
        "#C7ACE2",
      ],
      charts: ["#7C6099", "#587E76", "#A07838", "#A86A65"],
      darkCharts: ["#C5ADDF", "#A1C9BA", "#E0BB7C", "#E1AAA4"],
    },
  };
  PALETTES.sand = {
    name: "Kum",
    description: "Işık, keten ve sıcak nötrler.",
    light: [
      "#F7F3EA",
      "#FFFEFA",
      "#EEE7DA",
      "#332E22",
      "#696250",
      "#DDD2BD",
      "#91836A",
      "#826327",
    ],
    dark: [
      "#24221C",
      "#302D23",
      "#3C372A",
      "#F7F0DC",
      "#CDC4AA",
      "#514B3B",
      "#B5A88A",
      "#DCC48B",
    ],
    charts: ["#92722D", "#6C8168", "#8C7091", "#B36543"],
    darkCharts: ["#DDC18B", "#B1C7A4", "#CBB2DB", "#E5AA8B"],
  };
  PALETTES.moss = {
    name: "Yosun",
    description: "Yağmur sonrası derin yeşiller.",
    light: [
      "#EFF4F0",
      "#FAFDFA",
      "#DEEAE2",
      "#20362B",
      "#506959",
      "#CADCCF",
      "#728E7C",
      "#28664F",
    ],
    dark: [
      "#12251C",
      "#1C3226",
      "#2C4235",
      "#E8F5E9",
      "#B1CCB9",
      "#3E5B48",
      "#88AA91",
      "#9AD4AE",
    ],
    charts: ["#347E57", "#57868A", "#857F39", "#93729B"],
    darkCharts: ["#93CFAB", "#9CC8CB", "#D6CD89", "#C9AED8"],
  };
  PALETTES.plum = {
    name: "Erguvan",
    description: "Bitkisel mor, sanat ve sıcak kâğıt.",
    light: [
      "#F7F1F4",
      "#FFFFFF",
      "#F0E3EB",
      "#3A2533",
      "#745568",
      "#E2CEDA",
      "#A07790",
      "#915174",
    ],
    dark: [
      "#291B24",
      "#382530",
      "#49303D",
      "#FAEBF2",
      "#D6B9CB",
      "#614254",
      "#B38BA3",
      "#E4ACCF",
    ],
    charts: ["#975175", "#638272", "#A47B39", "#737B9F"],
    darkCharts: ["#DEAACB", "#B0CDBD", "#E3C183", "#B8C0E0"],
  };
  PALETTES.slate = {
    name: "Arduvaz",
    description: "Mimari nötrler, düzenli çalışma.",
    light: [
      "#F1F3F5",
      "#FFFFFF",
      "#E5E9ED",
      "#24303A",
      "#5C6872",
      "#D0D8DE",
      "#7A8D9B",
      "#485F72",
    ],
    dark: [
      "#1A2128",
      "#252F38",
      "#333F4A",
      "#EEF3F7",
      "#B9C7D1",
      "#475A69",
      "#93AAB9",
      "#B2CDDE",
    ],
    charts: ["#547D96", "#7C759A", "#748154", "#A36D54"],
    darkCharts: ["#A6C8DE", "#C0B5DF", "#C1D098", "#E0B299"],
  };
  const FONTS = Object.freeze({
    sans: '"Manrope", Arial, sans-serif',
    serif: '"Source Serif 4", Georgia, serif',
    system:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  });
  const SEMANTIC = {
    light: {
      success: ["#306647", "#E6F0E6"],
      warning: ["#7A4D10", "#FAEFD5"],
      danger: ["#A03F32", "#F9E8E1"],
      info: ["#3F5B82", "#E5ECF7"],
    },
    dark: {
      success: ["#A4CEAF", "#213D2B"],
      warning: ["#E7C07E", "#403321"],
      danger: ["#F2B0A1", "#482C29"],
      info: ["#ACC8EE", "#26384C"],
    },
  };
  function hex(value) {
    if (typeof value !== "string" || !/^#[0-9a-f]{6}$/i.test(value))
      throw new TypeError("Renk #RRGGBB biçiminde olmalıdır.");
    return value.toUpperCase();
  }
  function normalizeConfig(input) {
    if (input === undefined) input = {};
    if (!input || typeof input !== "object" || Array.isArray(input))
      throw new TypeError("Tema yapılandırması bir nesne olmalıdır.");
    const prototype = Object.getPrototypeOf(input);
    if (
      prototype !== null &&
      (Object.getPrototypeOf(prototype) !== null ||
        !Object.prototype.hasOwnProperty.call(prototype, "constructor") ||
        prototype.constructor.name !== "Object")
    )
      throw new TypeError("Tema yapılandırması sade bir nesne olmalıdır.");
    const result = { ...DEFAULTS };
    Reflect.ownKeys(input).forEach((key) => {
      if (
        typeof key !== "string" ||
        !Object.prototype.hasOwnProperty.call(DEFAULTS, key)
      )
        throw new TypeError("Bilinmeyen tema alanı: " + String(key));
      const descriptor = Object.getOwnPropertyDescriptor(input, key);
      if (!Object.prototype.hasOwnProperty.call(descriptor, "value"))
        throw new TypeError("Tema alanları doğrudan değer taşımalıdır.");
      const value = descriptor.value;
      if (key === "version") {
        if (value !== 1)
          throw new RangeError("Tema yapılandırması version: 1 kullanmalıdır.");
      } else if (key === "accent") {
        result.accent = value === null ? null : hex(value);
        return;
      } else if (!OPTIONS[key].includes(value)) {
        throw new RangeError(
          key + " için izin verilen değerler: " + OPTIONS[key].join(", ") + ".",
        );
      }
      result[key] = value;
    });
    return Object.freeze(result);
  }
  function channels(value) {
    const color = hex(value);
    return [1, 3, 5].map((index) =>
      parseInt(color.slice(index, index + 2), 16),
    );
  }
  function luminance(value) {
    const channel = channels(value).map((n) => {
      const s = n / 255;
      return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * channel[0] + 0.7152 * channel[1] + 0.0722 * channel[2];
  }
  function contrast(first, second) {
    const a = luminance(first),
      b = luminance(second);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  }
  function mix(first, second, amount) {
    const a = channels(first),
      b = channels(second);
    return (
      "#" +
      a
        .map((value, index) =>
          Math.round(value + (b[index] - value) * amount)
            .toString(16)
            .padStart(2, "0"),
        )
        .join("")
        .toUpperCase()
    );
  }
  function worst(color, backgrounds) {
    return Math.min(
      ...backgrounds.map((background) => contrast(color, background)),
    );
  }
  function readable(color, backgrounds, minimum) {
    if (worst(color, backgrounds) >= minimum) return hex(color);
    const endpoint =
      worst("#000000", backgrounds) >= worst("#FFFFFF", backgrounds)
        ? "#000000"
        : "#FFFFFF";
    // Check quantized output colors, rather than trusting a rounded theoretical ratio.
    for (let step = 1; step <= 255; step++) {
      const candidate = mix(color, endpoint, step / 255);
      if (worst(candidate, backgrounds) >= minimum) return candidate;
    }
    throw new RangeError("Bu yüzeylerde istenen kontrast sağlanamıyor.");
  }
  function onColor(color) {
    return contrast("#000000", color) >= contrast("#FFFFFF", color)
      ? "#000000"
      : "#FFFFFF";
  }
  function resolve(input) {
    const config = normalizeConfig(input),
      palette = PALETTES[config.preset],
      base = palette[config.mode],
      dark = config.mode === "dark";
    const [bg, surface, surface2, text, muted, border, strong, defaultAccent] =
      base;
    const accent = config.accent || defaultAccent,
      soft = mix(
        surface,
        accent,
        { soft: 0.05, balanced: dark ? 0.14 : 0.1, vivid: dark ? 0.23 : 0.18 }[
          config.accentIntensity
        ],
      );
    const backgrounds = [bg, surface, surface2],
      semantic = SEMANTIC[config.mode];
    const allSurfaces = backgrounds.concat(
      soft,
      Object.values(semantic).map((pair) => pair[1]),
    );
    const strongBorder = readable(strong, backgrounds, 3);
    const tokens = {
      "--mh-bg": bg,
      "--mh-surface": surface,
      "--mh-surface-2": surface2,
      "--mh-text": readable(text, allSurfaces, 4.5),
      "--mh-muted": readable(muted, allSurfaces, 4.5),
      "--mh-border": config.border === "strong" ? strongBorder : border,
      "--mh-border-strong": strongBorder,
      "--mh-accent": accent,
      "--mh-on-accent": onColor(accent),
      "--mh-accent-soft": soft,
      "--mh-link": readable(accent, backgrounds.concat(soft), 4.5),
      "--mh-focus": readable(accent, backgrounds.concat(soft), 3),
    };
    Object.keys(semantic).forEach((name) => {
      tokens["--mh-" + name] = readable(
        semantic[name][0],
        backgrounds.concat(semantic[name][1]),
        4.5,
      );
      tokens["--mh-" + name + "-bg"] = semantic[name][1];
    });
    (config.chartPalette === "contrast"
      ? dark
        ? ["#98D4D6", "#E8B6D8", "#E9CF84", "#BAC0EE"]
        : ["#166C76", "#984675", "#8D6416", "#575C99"]
      : config.chartPalette === "mono"
        ? [0, 0.16, 0.32, 0.48].map((t) =>
            mix(accent, dark ? "#FFFFFF" : "#000000", t),
          )
        : dark
          ? palette.darkCharts
          : palette.charts
    ).forEach((color, index) => {
      const resolved = readable(color, backgrounds, 3);
      tokens["--mh-chart-" + (index + 1)] = resolved;
      tokens["--mh-on-chart-" + (index + 1)] = onColor(resolved);
    });
    const radii = {
      soft: ["6px", "10px", "16px"],
      round: ["10px", "18px", "24px"],
      square: ["0px", "0px", "0px"],
      organic: ["14px", "24px", "36px"],
    }[config.radius];
    const ui =
      config.font === "system"
        ? FONTS.system
        : config.font === "book"
          ? FONTS.serif
          : FONTS.sans;
    const display = config.font === "editorial" ? FONTS.serif : ui;
    Object.assign(tokens, {
      "--mh-font-sans": FONTS.sans,
      "--mh-font-serif": FONTS.serif,
      "--mh-font-ui": ui,
      "--mh-font-display": display,
      "--mh-font-body": ui,
      "--mh-font-heading": display,
      "--mh-radius-sm": radii[0],
      "--mh-radius-md": radii[1],
      "--mh-radius-lg": radii[2],
      "--mh-space-card":
        config.density === "compact"
          ? "16px"
          : config.density === "spacious"
            ? "32px"
            : "24px",
      "--mh-cell-y":
        config.density === "compact"
          ? "10px"
          : config.density === "spacious"
            ? "22px"
            : "16px",
      "--mh-card-surface": config.cardSurface === "tinted" ? soft : config.cardSurface === "outline" ? "transparent" : tokens["--mh-surface"],
      "--mh-layout-gap": {compact:"12px", balanced:"24px", airy:"36px"}[config.layoutGap],
      "--mh-table-stripe": config.tableRows === "striped" ? tokens["--mh-surface-2"] : "transparent",
      "--mh-table-header-position": config.tableHeader === "sticky" ? "sticky" : "static",
      "--mh-text-scale": String(config.scale),
      "--mh-motion": config.motion === "reduced" ? "0ms" : "160ms ease",
      "--mh-elevation":
        config.elevation === "flat"
          ? "none"
          : config.elevation === "soft"
            ? "0 4px 18px rgba(15,25,21,.06)"
            : "0 10px 32px rgba(15,25,21,.14)",
      "--mh-button-bg":
        config.buttonStyle === "solid"
          ? accent
          : config.buttonStyle === "soft"
            ? soft
            : "transparent",
      "--mh-button-fg":
        config.buttonStyle === "solid"
          ? tokens["--mh-on-accent"]
          : tokens["--mh-link"],
      "--mh-button-border":
        config.buttonStyle === "outline" ? tokens["--mh-link"] : accent,
      "--mh-control-height": config.controlSize === "lg" ? "52px" : "44px",
      "--mh-control-x":
        config.controlSize === "sm"
          ? "12px"
          : config.controlSize === "lg"
            ? "22px"
            : "17px",
      "--mh-heading-scale": String(config.headingScale),
      "--mh-line-height": String(config.lineHeight),
      "--mh-content-width": {
        focused: "960px",
        balanced: "1240px",
        wide: "1600px",
      }[config.contentWidth],
      "--mh-border-width": config.borderWidth + "px",
      "--mh-icon-weight": String(config.iconWeight),
      "--mh-backdrop": dark ? "rgba(0, 0, 0, 0.68)" : "rgba(18, 28, 25, 0.52)",
      "--mh-shadow-overlay": dark
        ? "0 16px 48px rgba(0, 0, 0, 0.4)"
        : "0 16px 48px rgba(15, 25, 21, 0.18)",
      // Compatibility names are semantic aliases, not a separate brand palette.
      "--mh-sand": bg,
      "--mh-ink": tokens["--mh-text"],
      "--mh-line": tokens["--mh-border"],
      "--mh-line-strong": strongBorder,
      "--mh-logo-ink": accent,
      "--mh-logo-sage": tokens["--mh-chart-1"],
      "--mh-sage": soft,
      "--mh-sky": tokens["--mh-info-bg"],
      "--mh-terra": tokens["--mh-chart-4"],
      "--mh-ochre": tokens["--mh-chart-3"],
    });
    return Object.freeze({ config, tokens: Object.freeze(tokens) });
  }
  function apply(input, root) {
    const result = resolve(input);
    if (root === undefined)
      root = typeof document !== "undefined" ? document.documentElement : null;
    if (
      !root ||
      !root.style ||
      typeof root.style.setProperty !== "function" ||
      typeof root.setAttribute !== "function"
    )
      throw new TypeError(
        "apply için CSS stilini destekleyen bir kök öğe gereklidir.",
      );
    Object.keys(result.tokens).forEach((key) =>
      root.style.setProperty(key, result.tokens[key]),
    );
    root.setAttribute("data-mh-root", "");
    root.setAttribute("data-mh-mode", result.config.mode);
    root.setAttribute("data-mh-density", result.config.density);
    root.setAttribute("data-mh-motion", result.config.motion);
    return result;
  }
  function audit(input) {
    const tokens = resolve(input).tokens;
    const surfaces = ["--mh-bg", "--mh-surface", "--mh-surface-2"].map(
      (key) => tokens[key],
    );
    const allSurfaces = surfaces.concat(
      tokens["--mh-accent-soft"],
      ["success", "warning", "danger", "info"].map(
        (name) => tokens["--mh-" + name + "-bg"],
      ),
    );
    const rows = [];
    function add(id, label, color, backgrounds, minimum) {
      const ratio = worst(color, backgrounds);
      rows.push(
        Object.freeze({ id, label, ratio, minimum, pass: ratio >= minimum }),
      );
    }
    add(
      "text",
      "Gövde metni / içerik yüzeyleri",
      tokens["--mh-text"],
      allSurfaces,
      4.5,
    );
    add(
      "muted",
      "İkincil metin / içerik yüzeyleri",
      tokens["--mh-muted"],
      allSurfaces,
      4.5,
    );
    add(
      "link",
      "Bağlantı / temel yüzeyler",
      tokens["--mh-link"],
      surfaces.concat(tokens["--mh-accent-soft"]),
      4.5,
    );
    add(
      "focus",
      "Odak halkası / temel yüzeyler",
      tokens["--mh-focus"],
      surfaces.concat(tokens["--mh-accent-soft"]),
      3,
    );
    add(
      "on-accent",
      "Vurgu üzerindeki metin",
      tokens["--mh-on-accent"],
      [tokens["--mh-accent"]],
      4.5,
    );
    add(
      "border",
      "Güçlü sınır / temel yüzeyler",
      tokens["--mh-border-strong"],
      surfaces,
      3,
    );
    ["success", "warning", "danger", "info"].forEach((name, index) =>
      add(
        name,
        ["Başarı", "Uyarı", "Hata", "Bilgi"][index] +
          " metni / durum ve temel yüzeyler",
        tokens["--mh-" + name],
        surfaces.concat(tokens["--mh-" + name + "-bg"]),
        4.5,
      ),
    );
    [1, 2, 3, 4].forEach((index) => {
      add(
        "chart-" + index,
        "Grafik rengi " + index + " / temel yüzeyler",
        tokens["--mh-chart-" + index],
        surfaces,
        3,
      );
      add(
        "on-chart-" + index,
        "Grafik rengi " + index + " üzerindeki metin",
        tokens["--mh-on-chart-" + index],
        [tokens["--mh-chart-" + index]],
        4.5,
      );
    });
    return Object.freeze(rows);
  }
  function toCSS(input) {
    const { config, tokens } = resolve(input);
    const scopedMotion =
      ":where(.mh-scope, [data-mh-root]) { --mh-motion: 0ms !important; }\n" +
      ":where(.mh-scope, [data-mh-root]), :where(.mh-scope, [data-mh-root]) *, :where(.mh-scope, [data-mh-root]) *::before, :where(.mh-scope, [data-mh-root]) *::after {\n" +
      "  animation: none !important;\n  transition: none !important;\n  scroll-behavior: auto !important;\n}\n";
    const variables =
      ":root {\n" +
      Object.keys(tokens)
        .map((key) => "  " + key + ": " + tokens[key] + ";")
        .join("\n") +
      "\n  color-scheme: " +
      config.mode +
      ";\n}\n";
    return (
      variables +
      (config.motion === "reduced" ? "\n" + scopedMotion : "") +
      "\n@media (prefers-reduced-motion: reduce) {\n" +
      scopedMotion
        .trimEnd()
        .split("\n")
        .map((line) => "  " + line)
        .join("\n") +
      "\n}\n"
    );
  }
  function toJSON(input) {
    return JSON.stringify(normalizeConfig(input), null, 2) + "\n";
  }
  function fromJSON(value) {
    if (typeof value !== "string")
      throw new TypeError("Tema JSON girdisi metin olmalıdır.");
    return normalizeConfig(JSON.parse(value));
  }
  const presets = Object.freeze(
    Object.keys(PALETTES).map((id) => {
      const item = PALETTES[id];
      return Object.freeze({
        id,
        name: item.name,
        description: item.description,
        colors: Object.freeze({
          accent: item.light[7],
          background: item.light[0],
          surface: item.light[1],
          text: item.light[3],
          secondary: item.charts[1],
          tertiary: item.charts[3],
        }),
      });
    }),
  );
  global.MuhitTheme = Object.freeze({
    version: VERSION,
    presets,
    defaults: DEFAULTS,
    normalizeConfig,
    resolve,
    apply,
    contrast,
    audit,
    toCSS,
    toJSON,
    fromJSON,
  });
})(globalThis);
