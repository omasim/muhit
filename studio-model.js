/* Shared theme control contract, generated from schemas/theme.schema.json. */
globalThis.MuhitStudioModel = Object.freeze({
  properties: Object.freeze({
  "version": {
    "type": "integer",
    "const": 1,
    "default": 1
  },
  "preset": {
    "type": "string",
    "enum": [
      "grove",
      "clay",
      "tide",
      "atelier",
      "sand",
      "moss",
      "plum",
      "slate"
    ],
    "default": "grove"
  },
  "mode": {
    "type": "string",
    "enum": [
      "light",
      "dark"
    ],
    "default": "light"
  },
  "accent": {
    "description": "Özel vurgu rengi; null seçili paletin varsayılanını kullanır. Normalize edilmiş renkler büyük harfle yazılır.",
    "anyOf": [
      {
        "type": "null"
      },
      {
        "type": "string",
        "pattern": "^#[0-9A-Fa-f]{6}$"
      }
    ],
    "default": null
  },
  "font": {
    "type": "string",
    "enum": [
      "editorial",
      "humanist",
      "system",
      "book"
    ],
    "default": "editorial"
  },
  "density": {
    "type": "string",
    "enum": [
      "comfortable",
      "compact",
      "spacious"
    ],
    "default": "comfortable"
  },
  "radius": {
    "type": "string",
    "enum": [
      "soft",
      "round",
      "square",
      "organic"
    ],
    "default": "soft"
  },
  "scale": {
    "type": "number",
    "enum": [
      1,
      1.125,
      1.25
    ],
    "default": 1
  },
  "motion": {
    "type": "string",
    "enum": [
      "system",
      "reduced"
    ],
    "default": "system"
  },
  "border": {
    "type": "string",
    "enum": [
      "subtle",
      "strong"
    ],
    "default": "subtle"
  },
  "elevation": {
    "type": "string",
    "enum": [
      "flat",
      "soft",
      "raised"
    ],
    "default": "flat"
  },
  "buttonStyle": {
    "type": "string",
    "enum": [
      "solid",
      "soft",
      "outline"
    ],
    "default": "solid"
  },
  "controlSize": {
    "type": "string",
    "enum": [
      "sm",
      "md",
      "lg"
    ],
    "default": "md"
  },
  "headingScale": {
    "type": "number",
    "enum": [
      0.9,
      1,
      1.15
    ],
    "default": 1
  },
  "lineHeight": {
    "type": "number",
    "enum": [
      1.45,
      1.65,
      1.85
    ],
    "default": 1.65
  },
  "contentWidth": {
    "type": "string",
    "enum": [
      "focused",
      "balanced",
      "wide"
    ],
    "default": "balanced"
  },
  "borderWidth": {
    "type": "number",
    "enum": [
      1,
      2
    ],
    "default": 1
  },
  "iconWeight": {
    "type": "number",
    "enum": [
      1.25,
      1.5,
      2
    ],
    "default": 1.5
  },
  "accentIntensity": {
    "type": "string",
    "enum": [
      "soft",
      "balanced",
      "vivid"
    ],
    "default": "balanced"
  },
  "chartPalette": {
    "type": "string",
    "enum": [
      "natural",
      "contrast",
      "mono"
    ],
    "default": "natural"
  },
  "cardSurface": {
    "type": "string",
    "enum": [
      "plain",
      "tinted",
      "outline"
    ],
    "default": "plain"
  },
  "layoutGap": {
    "type": "string",
    "enum": [
      "balanced",
      "compact",
      "airy"
    ],
    "default": "balanced"
  },
  "tableRows": {
    "type": "string",
    "enum": [
      "plain",
      "striped"
    ],
    "default": "plain"
  },
  "tableHeader": {
    "type": "string",
    "enum": [
      "static",
      "sticky"
    ],
    "default": "static"
  }
}),
  parse(key, raw) {
    const rule=this.properties[key];
    if (!rule || key==='version') throw new TypeError('Unknown theme control');
    if (key==='accent') return raw || null;
    if (rule.type==='number') return Number(raw);
    if (rule.type==='boolean') return raw==='true';
    return raw;
  }
});
