import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import "../src/theme.js";
import "../src/agent.js";

const Agent = globalThis.MuhitAgent;
const example = JSON.parse(
  fs.readFileSync(
    new URL("../examples/agent-view.json", import.meta.url),
    "utf8",
  ),
);
const copy = (value) => JSON.parse(JSON.stringify(value));
const view = (components) => ({ schemaVersion: "1.0.0", components });
const card = (id = "a") => ({
  type: "card",
  id,
  title: "Birlikte düşünmek",
  action: { id: "review", label: "İncele" },
});
const chart = (data) => ({
  type: "chart",
  id: "chart",
  title: "Örnek sayımlar",
  data,
});
const row = { sources: 3, actions: 2, connections: 1 };
function invalid(spec, path) {
  const result = Agent.validate(spec);
  assert.equal(result.valid, false);
  assert(result.errors.length > 0);
  assert(
    result.errors.every(
      (error) =>
        typeof error.path === "string" && typeof error.message === "string",
    ),
  );
  if (path)
    assert(
      result.errors.some((error) => error.path === path),
      JSON.stringify(result.errors),
    );
}

test("classic import touches no DOM and validation works in a clean Node context", () => {
  let reads = 0;
  const context = vm.createContext({});
  Object.defineProperty(context, "document", {
    get() {
      reads++;
      throw new Error("DOM must not be read");
    },
  });
  vm.runInContext(
    fs.readFileSync(new URL("../src/agent.js", import.meta.url), "utf8"),
    context,
  );
  assert.equal(reads, 0);
  assert.deepEqual(Object.keys(context.MuhitAgent), ["validate", "render"]);
  assert.equal(context.MuhitAgent.validate(view([])).valid, true);
  assert.equal(
    context.MuhitAgent.validate({ ...view([]), theme: { mode: "dark" } })
      .valid,
    true,
  );
  assert.equal(reads, 0);
});

test("all five kinds and the published fictional example validate without mutation", () => {
  const before = JSON.stringify(example);
  assert.equal(Agent.validate(example).valid, true);
  assert.equal(new Set(example.components.map((item) => item.type)).size, 5);
  assert.equal(JSON.stringify(example), before);
  assert.match(example.components[0].message, /kurgusaldır/);
  assert.equal(
    example.components.find((item) => item.type === "chart").data.isExample,
    true,
  );
});

test("root, version, kinds and all nested unknown keys are strict", () => {
  invalid(null, "$");
  invalid([], "$");
  invalid({ components: [] }, "$.schemaVersion");
  invalid({ ...view([]), schemaVersion: 1 }, "$.schemaVersion");
  invalid({ ...view([]), html: "<script>bad()</script>" }, "$.html");
  invalid(
    view([{ type: "iframe", id: "frame", src: "https://example.com" }]),
    "$.components[0].type",
  );
  invalid(
    view([{ ...card(), onclick: "execute()" }]),
    "$.components[0].onclick",
  );
  invalid(
    view([
      {
        ...card(),
        action: { id: "go", label: "Go", href: "https://example.com" },
      },
    ]),
    "$.components[0].action.href",
  );
  invalid(
    view([
      {
        type: "table",
        id: "t",
        title: "T",
        rows: [{ id: "r", title: "R", status: "active", html: "x" }],
      },
    ]),
    "$.components[0].rows[0].html",
  );
  invalid(
    view([chart({ rows: [{ ...row, surprise: 1 }] })]),
    "$.components[0].data.rows[0].surprise",
  );
  invalid(
    view([
      chart({ rows: [row], categories: [{ name: "A", value: 2, url: "x" }] }),
    ]),
    "$.components[0].data.categories[0].url",
  );
  invalid(
    view([
      chart({
        rows: [row],
        totals: { sources: 3, actions: 2, connections: 1 },
      }),
    ]),
    "$.components[0].data.totals",
  );
});

test("non-JSON values, hidden properties, getters, cycles and nonfinite numbers are rejected", () => {
  for (const value of [
    undefined,
    () => {},
    Symbol("x"),
    1n,
    new Date(),
    new Map(),
    NaN,
    Infinity,
    -Infinity,
  ])
    invalid({ ...view([]), theme: value });
  const withGetter = view([]);
  let calls = 0;
  Object.defineProperty(withGetter, "theme", {
    enumerable: true,
    get() {
      calls++;
      return {};
    },
  });
  invalid(withGetter, "$.theme");
  assert.equal(calls, 0);
  const hidden = view([]);
  Object.defineProperty(hidden, "unknown", { value: 1 });
  invalid(hidden, "$.unknown");
  const cycle = view([]);
  cycle.theme = cycle;
  invalid(cycle, "$.theme");
  const sparse = view(new Array(1));
  invalid(sparse, "$.components[0]");
  const special = view([]);
  special.components.extra = 1;
  invalid(special, "$.components[extra]");
  const symbolic = view([]);
  symbolic[Symbol("x")] = 1;
  invalid(symbolic, "$");
  invalid(
    JSON.parse(
      '{"schemaVersion":"1.0.0","components":[],"__proto__":{"polluted":true}}',
    ),
    "$.__proto__",
  );
  assert.equal({}.polluted, undefined);
});

test("component IDs are unique; action IDs are scoped by their component", () => {
  invalid(view([card("same"), card("same")]), "$.components[1].id");
  for (const id of ["", "1bad", "two words", 'bad"id', "üye", "a".repeat(65)])
    invalid(view([card(id)]), "$.components[0].id");
  invalid(
    view([{ ...card(), action: { id: "../path", label: "Go" } }]),
    "$.components[0].action.id",
  );
  assert.equal(
    Agent.validate(view([card("first"), card("second")])).valid,
    true,
  );
  assert.equal(
    Agent.validate(view(Array.from({ length: 50 }, (_, i) => card("id" + i))))
      .valid,
    true,
  );
  invalid(
    view(Array.from({ length: 51 }, (_, i) => card("id" + i))),
    "$.components",
  );
});

test("text has explicit types and limits; Unicode limits count code points", () => {
  invalid(view([{ ...card(), title: "   " }]), "$.components[0].title");
  invalid(
    view([{ type: "metric", id: "m", label: "Ölçüm", value: 12 }]),
    "$.components[0].value",
  );
  invalid(
    view([
      { type: "notice", id: "n", title: "Bilgi", message: "", tone: "info" },
    ]),
    "$.components[0].message",
  );
  invalid(
    view([
      {
        type: "notice",
        id: "n",
        title: "Bilgi",
        message: "Not",
        tone: "urgent",
      },
    ]),
    "$.components[0].tone",
  );
  invalid(
    view([{ ...card(), description: "a".repeat(4001) }]),
    "$.components[0].description",
  );
  assert.equal(
    Agent.validate(view([{ ...card(), title: "🌱".repeat(240) }])).valid,
    true,
  );
  invalid(
    view([{ ...card(), title: "🌱".repeat(241) }]),
    "$.components[0].title",
  );
});

test("theme contract mirrors the strict normalizer and fills defaults only when rendering", () => {
  const spec = {
    ...view([]),
    theme: { mode: "dark", scale: 1.125, accent: "#AABBCC" },
  };
  assert.equal(Agent.validate(spec).valid, true);
  assert.equal(spec.theme.preset, undefined);
  for (const theme of [
    { version: "1" },
    { accent: "#abc" },
    { scale: 1.1 },
    { font: "https://font.test" },
    { density: true },
    { mode: "auto" },
    { extra: 1 },
    null,
    [],
  ])
    invalid({ ...view([]), theme });
  const schema = JSON.parse(
    fs.readFileSync(
      new URL("../schemas/theme.schema.json", import.meta.url),
      "utf8",
    ),
  );
  for (const [key, property] of Object.entries(schema.properties)) {
    if (property.enum)
      for (const value of property.enum)
        assert.equal(
          Agent.validate({ ...view([]), theme: { [key]: value } }).valid,
          true,
          key,
        );
  }
});

test("table rows enforce dates, row IDs, status and size limits", () => {
  const table = (rows) =>
    view([{ type: "table", id: "table", title: "Kayıtlar", rows }]);
  const record = {
    id: "r",
    title: "Kayıt",
    status: "planned",
    updated: "2024-02-29",
  };
  assert.equal(Agent.validate(table([record])).valid, true);
  assert.equal(Agent.validate(table([{ ...record, updated: "" }])).valid, true);
  invalid(
    table([{ ...record, updated: "2026-02-29" }]),
    "$.components[0].rows[0].updated",
  );
  invalid(
    table([{ ...record, updated: "2026-13-01" }]),
    "$.components[0].rows[0].updated",
  );
  invalid(
    table([{ ...record, status: "done" }]),
    "$.components[0].rows[0].status",
  );
  invalid(table([record, record]), "$.components[0].rows[1].id");
  invalid(
    table(Array.from({ length: 501 }, (_, i) => ({ ...record, id: "r" + i }))),
    "$.components[0].rows",
  );
});

test("chart counts never coerce strings, permit zero, and constrain aggregate magnitude", () => {
  for (const value of [
    -1,
    "3",
    null,
    NaN,
    Infinity,
    Number.MAX_SAFE_INTEGER + 1,
  ])
    invalid(view([chart({ rows: [{ ...row, sources: value }] })]));
  assert.equal(
    Agent.validate(
      view([chart({ rows: [{ sources: 0, actions: 0, connections: 0 }] })]),
    ).valid,
    true,
  );
  assert.equal(Agent.validate(view([chart({ rows: [] })])).valid, true);
  invalid(
    view([chart({ rows: [row], period: "6" })]),
    "$.components[0].data.period",
  );
  invalid(
    view([chart({ rows: [row], year: 2026 })]),
    "$.components[0].data.year",
  );
  invalid(
    view([chart({ rows: [row], isExample: "true" })]),
    "$.components[0].data.isExample",
  );
  invalid(
    view([chart({ rows: Array.from({ length: 25 }, () => row) })]),
    "$.components[0].data.rows",
  );
  invalid(
    view([
      chart({ rows: [{ ...row, sources: Number.MAX_SAFE_INTEGER }, row] }),
    ]),
    "$.components[0].data.rows",
  );
});

test("chart distributions match their rows, accept float roundoff, and bound categories/types", () => {
  assert.equal(
    Agent.validate(
      view([
        chart({
          rows: [row],
          categories: [{ name: "A", value: 2 }],
          types: [{ name: "T", value: 3 }],
        }),
      ]),
    ).valid,
    true,
  );
  invalid(
    view([chart({ rows: [row], categories: [{ name: "A", value: 1 }] })]),
    "$.components[0].data.categories",
  );
  invalid(
    view([chart({ rows: [row], types: [{ name: "T", value: 4 }] })]),
    "$.components[0].data.types",
  );
  invalid(
    view([chart({ rows: [{ ...row, categories: [1] }] })]),
    "$.components[0].data.rows[0].categories",
  );
  invalid(
    view([chart({ rows: [{ ...row, types: [4] }] })]),
    "$.components[0].data.rows[0].types",
  );
  invalid(
    view([
      chart({
        rows: [row],
        categories: Array.from({ length: 13 }, () => ({ name: "A", value: 0 })),
      }),
    ]),
    "$.components[0].data.categories",
  );
  invalid(
    view([
      chart({
        rows: [row],
        types: Array.from({ length: 9 }, () => ({ name: "A", value: 0 })),
      }),
    ]),
    "$.components[0].data.types",
  );
  assert.equal(
    Agent.validate(
      view([
        chart({
          rows: [
            {
              sources: 0.3,
              actions: 0.3,
              connections: 0,
              categories: [0.1, 0.2],
            },
          ],
          types: [
            { name: "A", value: 0.1 },
            { name: "B", value: 0.2 },
          ],
        }),
      ]),
    ).valid,
    true,
  );
});

// Small DOM double isolates adapter ownership/lifecycle. Parent package also runs real browser tests.
class Element {
  constructor(tag, doc) {
    this.tagName = tag.toUpperCase();
    this.nodeType = 1;
    this.ownerDocument = doc;
    this.children = [];
    this.attributes = {};
    this.listeners = {};
    this.parentNode = null;
    this._text = "";
    const values = new Map();
    this.style = {
      setProperty(k, v) {
        values.set(k, v);
      },
      getPropertyValue(k) {
        return values.get(k) || "";
      },
    };
  }
  set textContent(value) {
    this._text = String(value);
    this.replaceChildren();
  }
  get textContent() {
    return (
      this._text + this.children.map((child) => child.textContent).join("")
    );
  }
  set innerHTML(_) {
    throw new Error("Agent must never use innerHTML");
  }
  setAttribute(key, value) {
    this.attributes[key] = String(value);
  }
  getAttribute(key) {
    return this.attributes[key] ?? null;
  }
  append(...nodes) {
    for (const node of nodes) {
      node.remove();
      node.parentNode = this;
      this.children.push(node);
    }
  }
  replaceChildren(...nodes) {
    for (const child of this.children) child.parentNode = null;
    this.children = [];
    this.append(...nodes);
  }
  remove() {
    if (this.parentNode) {
      this.parentNode.children = this.parentNode.children.filter(
        (child) => child !== this,
      );
      this.parentNode = null;
    }
  }
  addEventListener(type, handler) {
    (this.listeners[type] ||= new Set()).add(handler);
  }
  removeEventListener(type, handler) {
    this.listeners[type]?.delete(handler);
  }
  click() {
    if (!this.disabled)
      for (const handler of this.listeners.click || [])
        handler({ type: "click", target: this });
  }
}
const doc = {
  createElement(tag) {
    return new Element(tag, doc);
  },
};
function find(root, test) {
  if (test(root)) return root;
  for (const child of root.children) {
    const result = find(child, test);
    if (result) return result;
  }
}
function setup() {
  const host = doc.createElement("main");
  host.style.setProperty("--host-owned", "kept");
  const old = doc.createElement("p");
  old.textContent = "Existing content";
  host.append(old);
  return host;
}

test("render uses literal text, native actions and only the scoped inner root for theme", () => {
  const host = setup();
  const actions = [];
  const spec = {
    ...view([
      {
        ...card(),
        title: "<img src=x onerror=bad()>",
        description: "<script>bad()</script>",
      },
    ]),
    theme: { mode: "dark" },
  };
  const api = Agent.render(host, spec, {
    onAction: (action) => actions.push(action),
  });
  assert.match(host.textContent, /<img src=x onerror=bad\(\)>/);
  assert.equal(
    find(host, (n) => n.tagName === "IMG"),
    undefined,
  );
  assert.equal(actions.length, 0);
  assert.equal(host.style.getPropertyValue("--mh-bg"), "");
  assert.notEqual(host.children[0].style.getPropertyValue("--mh-bg"), "");
  const button = find(host, (n) => n.tagName === "BUTTON");
  assert.equal(button.type, "button");
  button.click();
  assert.deepEqual(actions, [{ id: "review", componentId: "a" }]);
  spec.components[0].action.id = "mutated";
  button.click();
  assert.equal(actions[1].id, "review");
  api.destroy();
  button.click();
  assert.equal(actions.length, 2);
  assert.equal(host.style.getPropertyValue("--host-owned"), "kept");
  assert.equal(host.children.length, 0);
  api.destroy();
  assert.throws(() => api.update(view([])), /Kaldırılmış/);
});

test("omitted theme inherits host tokens, including after an explicit theme update", () => {
  const host = setup();
  host.style.setProperty("--mh-bg", "#112233");
  const api = Agent.render(host, view([card()]));
  assert.equal(host.children[0].style.getPropertyValue("--mh-bg"), "");
  assert.equal(host.children[0].getAttribute("data-mh-root"), null);
  api.update({ ...view([card()]), theme: { mode: "dark" } });
  assert.notEqual(host.children[0].style.getPropertyValue("--mh-bg"), "");
  api.update(view([card()]));
  assert.equal(host.children[0].style.getPropertyValue("--mh-bg"), "");
  assert.equal(host.style.getPropertyValue("--mh-bg"), "#112233");
  api.destroy();
});

test("invalid render/update and missing dependency leave existing DOM untouched", () => {
  const host = setup();
  const old = host.children[0];
  assert.throws(
    () => Agent.render(host, view([card("bad id")])),
    (error) =>
      error instanceof TypeError && error.errors[0].path.includes(".id"),
  );
  assert.equal(host.children[0], old);
  const api = Agent.render(host, view([card()]));
  const rendered = host.children[0];
  const button = find(host, (n) => n.tagName === "BUTTON");
  assert.equal(button.disabled, true);
  assert.throws(() => api.update(view([card(), card()])));
  assert.equal(host.children[0], rendered);
  const previousTable = globalThis.MuhitTable;
  delete globalThis.MuhitTable;
  try {
    assert.throws(
      () =>
        api.update(view([{ type: "table", id: "t", title: "T", rows: [] }])),
      /MuhitTable/,
    );
    assert.equal(host.children[0], rendered);
  } finally {
    if (previousTable) globalThis.MuhitTable = previousTable;
  }
  api.destroy();
});

test("chart/table lifecycle is cleaned on update, failure, remount and destroy; provider returns copies", () => {
  const oldTable = globalThis.MuhitTable,
    oldCharts = globalThis.MuhitCharts;
  const mounts = [];
  let shouldFail = false;
  globalThis.MuhitTable = {
    mount(host, options) {
      const item = {
        kind: "table",
        host,
        options,
        destroyed: 0,
        destroy() {
          this.destroyed++;
        },
      };
      mounts.push(item);
      return item;
    },
  };
  globalThis.MuhitCharts = {
    mount(host, options) {
      if (shouldFail) throw new Error("Fixture mount failure");
      const item = {
        kind: "chart",
        host,
        options,
        destroyed: 0,
        destroy() {
          this.destroyed++;
        },
      };
      mounts.push(item);
      return item;
    },
  };
  try {
    const host = setup();
    const api = Agent.render(host, example);
    assert.equal(mounts.length, 2);
    assert.equal(mounts[0].options.demo, false);
    const data = mounts[1].options.getData();
    data.rows[0].sources = 999;
    assert.equal(mounts[1].options.getData().rows[0].sources, 8);
    assert.equal(mounts[1].options.initialPeriod, 6);
    assert.equal(mounts[1].options.periodControl, false);
    const first = host.children[0];
    shouldFail = true;
    assert.throws(() => api.update(example), /Fixture mount failure/);
    assert.equal(host.children[0], first);
    assert.equal(mounts[0].destroyed, 0);
    assert.equal(mounts[2].destroyed, 1);
    shouldFail = false;
    assert.equal(api.update(view([card()])), api);
    assert.equal(mounts[0].destroyed, 1);
    assert.equal(mounts[1].destroyed, 1);
    const oldRoot = host.children[0];
    const replacement = Agent.render(host, view([]));
    assert.notEqual(host.children[0], oldRoot);
    assert.throws(() => api.update(view([])), /Kaldırılmış/);
    replacement.destroy();
    replacement.destroy();
    assert.equal(host.children.length, 0);
  } finally {
    if (oldTable) globalThis.MuhitTable = oldTable;
    else delete globalThis.MuhitTable;
    if (oldCharts) globalThis.MuhitCharts = oldCharts;
    else delete globalThis.MuhitCharts;
  }
});

test("published schema and manifest expose exactly the supported adapter kinds", () => {
  const schema = JSON.parse(
    fs.readFileSync(
      new URL("../schemas/ui.schema.json", import.meta.url),
      "utf8",
    ),
  );
  const manifest = JSON.parse(
    fs.readFileSync(
      new URL("../schemas/components.json", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(schema.properties.theme.$ref, "./theme.schema.json");
  assert.equal(schema.properties.components.maxItems, 50);
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(manifest.adapter.renderKinds, [
    "card",
    "metric",
    "notice",
    "table",
    "chart", "tabs", "accordion", "timeline", "kanban", "choices", "command", "drawer", "stepper", "filepicker", "pagination", "form", "datagrid", "plot",
  ]);
  const widgets=JSON.parse(fs.readFileSync(new URL("../schemas/widgets.schema.json",import.meta.url),"utf8"));
  for (const kind of manifest.adapter.renderKinds) {
    const definition=schema.$defs[kind]||widgets.$defs[kind];
    assert.equal(definition.additionalProperties, false);
    assert.equal(definition.properties.type.const, kind);
  }
});
