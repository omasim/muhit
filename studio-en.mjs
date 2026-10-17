import "./studio-model.js";
import {
  MuhitTheme as Theme,
  MuhitDataGrid as Grid,
  MuhitForm as Form,
  MuhitWidgets as Widgets,
  MuhitPlot as Plot,
  MuhitAgent as Agent,
  MuhitI18n as I18n,
} from "./src/index.mjs";
import de from "./locales/de.mjs";
import ar from "./locales/ar.mjs";
I18n.register("de", de);
I18n.register("ar", ar);
const $ = (id) => document.getElementById(id);
let config = Theme.normalizeConfig({}),
  undo = [],
  redo = [],
  children = [],
  agent,
  grid,
  form;
const schema = globalThis.MuhitStudioModel;
const labels = {
  preset: "Palette",
  mode: "Appearance",
  accent: "Custom accent",
  font: "Typography",
  density: "Content density",
  radius: "Corners",
  scale: "Text scale",
  motion: "Motion",
  border: "Border contrast",
  elevation: "Surface depth",
  buttonStyle: "Button style",
  controlSize: "Control size",
  headingScale: "Heading scale",
  lineHeight: "Line height",
  contentWidth: "Content width",
  borderWidth: "Border width",
  iconWeight: "Icon stroke",
  accentIntensity: "Accent intensity",
  chartPalette: "Chart palette",
  cardSurface: "Card surface",
  layoutGap: "Component spacing",
  tableRows: "Table row style",
  tableHeader: "Table header position",
};
function download(name, text, type) {
  const a = document.createElement("a"),
    url = URL.createObjectURL(new Blob([text], { type }));
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
function apply(next, record = true) {
  const checked = Theme.normalizeConfig(next);
  if (record) {
    undo.push(config);
    redo = [];
  }
  config = checked;
  Theme.apply(config);
  document.querySelector("header img").src =
    "assets/brand/" +
    (config.mode === "dark" ? "muhit-logo-dark.svg" : "muhit-logo.svg");
  for (const [key, control] of inputs)
    control.value = config[key] === null ? "" : String(config[key]);
  $("undo").disabled = !undo.length;
  $("redo").disabled = !redo.length;
  $("tokens").textContent = Theme.toCSS(config);
  const checks = Theme.audit(config);
  $("audit").replaceChildren(
    ...checks.map((c, i) => {
      const p = document.createElement("p");
      p.textContent = `Pair ${i + 1}: ${c.ratio?.toFixed(2) ?? ""}:1 · ${c.pass ? "Pass" : "Review"}`;
      return p;
    }),
  );
  $("theme-status").textContent = "Theme applied. Appearance stays local.";
}
const inputs = new Map();
for (const [key, rule] of Object.entries(schema.properties)) {
  if (key === "version") continue;
  const field = document.createElement("div");
  field.className = "mh-field";
  const label = document.createElement("label");
  label.htmlFor = "theme-" + key;
  label.textContent = labels[key] || key;
  let input;
  if (key === "accent") {
    input = document.createElement("input");
    input.type = "text";
    input.placeholder = "#356752 or empty";
  } else {
    input = document.createElement("select");
    for (const value of rule.enum ?? [false, true]) {
      const o = document.createElement("option");
      o.value = String(value);
      o.textContent =
        typeof value === "boolean"
          ? value
            ? "Enabled"
            : "Disabled"
          : String(value).replaceAll("-", " ");
      input.append(o);
    }
  }
  input.id = label.htmlFor;
  input.className = "mh-input";
  input.addEventListener("change", () => {
    try {
      const value = globalThis.MuhitStudioModel.parse(key, input.value);
      apply({ ...config, [key]: value });
    } catch {
      $("theme-status").textContent =
        "Invalid theme value. Previous theme preserved.";
      input.value = config[key] ?? "";
    }
  });
  field.append(label, input);
  $("controls").append(field);
  inputs.set(key, input);
}
$("undo").onclick = () => {
  if (undo.length) {
    redo.push(config);
    apply(undo.pop(), false);
  }
};
$("redo").onclick = () => {
  if (redo.length) {
    undo.push(config);
    apply(redo.pop(), false);
  }
};
$("reset").onclick = () => apply({});
$("json").onclick = () =>
  download("muhit-theme.json", Theme.toJSON(config), "application/json");
$("css").onclick = () =>
  download("muhit-theme.css", Theme.toCSS(config), "text/css");
$("import").onchange = async (e) => {
  try {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 100000) throw Error();
    apply(Theme.fromJSON(await f.text()));
  } catch {
    $("theme-status").textContent =
      "Import failed. Use a valid Muhit theme JSON file.";
  } finally {
    e.target.value = "";
  }
};
const widgetSpecs = await fetch("./examples/widgets.en.json").then((r) =>
  r.json(),
);
let records = [
  { id: "r1", name: "Human-centered research", score: 42 },
  { id: "r2", name: "Shared knowledge", score: 64 },
];
const emit = (e) =>
  ($("events").textContent = "Local event: " + JSON.stringify(e));
function components() {
  const view = grid?.getView(),
    draft = form?.getValues();
  children.forEach((c) => c.destroy());
  const locale = $("locale").value;
  grid = Grid.mount("#grid", {
    locale,
    title: "Research library",
    selectable: true,
    columns: [
      { key: "name", label: "Work", editable: true },
      { key: "score", label: "Score", type: "number" },
    ],
    rows: records,
    onRowsChange: (next) => {
      records = next;
      emit(next);
    },
  });
  if (view) grid.restoreView(view);
  form = Form.mount("#form", {
    locale,
    title: "Project brief",
    values: draft,
    fields: [
      { name: "name", label: "Project name", required: true },
      { name: "email", label: "Email", type: "email", required: true },
    ],
    onSubmit: async (values) => {
      emit(values);
    },
  });
  children = [
    grid,
    form,
    Plot.mount("#plot", {
      title: "Participation · sample data",
      unit: "people",
      kind: "bar",
      locale,
      labels: ["Research", "Design"],
      series: [{ id: "people", label: "People", values: [12, 24] }],
    }),
    Widgets.mount(
      "#board",
      {
        id: "board",
        type: "kanban",
        title: "Shared work",
        columns: [
          { id: "ideas", title: "Ideas" },
          { id: "doing", title: "In progress" },
          { id: "done", title: "Complete" },
        ],
        items: [
          { id: "research", title: "Listen to people", column: "ideas" },
          { id: "design", title: "Explore possibilities", column: "doing" },
        ],
      },
      { locale, onAction: emit },
    ),
  ];
  $("widgets").replaceChildren();
  for (const spec of widgetSpecs.filter((s) => s.type !== "kanban")) {
    const host = document.createElement("div");
    $("widgets").append(host);
    children.push(Widgets.mount(host, spec, { locale, onAction: emit }));
  }
}
$("locale").onchange = components;
$("spec").value = JSON.stringify(
  {
    schemaVersion: "1.1.0",
    page: { title: "A shared workspace", layout: "stack" },
    components: [
      {
        type: "card",
        id: "research",
        title: "Ideas in context",
        description: "Sample content. The application owns the next action.",
        action: { id: "explore", label: "Explore" },
      },
      {
        type: "form",
        id: "brief",
        title: "Agent project brief",
        fields: [{ name: "name", label: "Name", required: true }],
      },
    ],
  },
  null,
  2,
);
function render() {
  try {
    const spec = JSON.parse($("spec").value),
      check = Agent.validate(spec);
    if (!check.valid)
      throw Error(
        check.errors.map((e) => e.path + ": " + e.message).join("\n"),
      );
    if (agent) agent.update(spec);
    else
      agent = Agent.render("#agent-view", spec, {
        locale: "en",
        onAction: emit,
      });
    $("agent-status").textContent = "Valid definition. Preview updated.";
  } catch (e) {
    $("agent-status").textContent =
      "Definition rejected. Previous preview preserved. " + e.message;
  }
}
$("render").onclick = render;
$("agent-theme").onclick = () => {
  try {
    const spec = JSON.parse($("spec").value);
    spec.theme = config;
    $("spec").value = JSON.stringify(spec, null, 2);
    render();
  } catch {
    $("agent-status").textContent = "Invalid JSON.";
  }
};
$("agent-download").onclick = () => {
  try {
    const spec = JSON.parse($("spec").value);
    if (!Agent.validate(spec).valid) throw Error();
    download(
      "muhit-view.json",
      JSON.stringify(spec, null, 2),
      "application/json",
    );
  } catch {
    $("agent-status").textContent =
      "Correct the definition before downloading.";
  }
};
apply(config, false);
components();
render();
window.studioReady = true;
