import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  MuhitForm as F,
  MuhitPlot as P,
  MuhitAgent as A,
  MuhitDataGrid as G,
} from "../src/index.mjs";
const fields = [
  {
    name: "choice",
    label: "Choice",
    type: "select",
    options: [{ value: "a", label: "A" }],
  },
  { name: "date", label: "Date", type: "date" },
];
const plot = {
  title: "Temperature",
  unit: "°C",
  labels: ["A", "B", "C"],
  series: [{ id: "temp", label: "Reading", values: [-2, null, 3] }],
};
test("form rejects unrepresentable values before DOM; hidden fields do not weaken value safety", () => {
  assert.throws(() => F.normalizeValues(fields, { choice: "missing" }));
  assert.throws(() => F.normalizeValues(fields, { date: "2025-02-29" }));
  assert.throws(() =>
    F.normalizeValues(
      [{ name: "x", label: "X", disabled: true, type: "date" }],
      { x: "bad" },
    ),
  );
  assert.throws(() =>
    F.normalizeFields([
      {
        name: "x",
        label: "X",
        visibleWhen: { field: "missing", equals: true },
      },
    ]),
  );
  assert.equal(
    F.validate(
      [
        { name: "enabled", label: "Enabled", type: "checkbox" },
        {
          name: "x",
          label: "X",
          required: true,
          visibleWhen: { field: "enabled", equals: true },
        },
      ],
      { enabled: false },
    ).valid,
    true,
  );
  assert.equal(
    F.validate(
      [
        { name: "enabled", label: "Enabled", type: "checkbox" },
        {
          name: "x",
          label: "X",
          required: true,
          visibleWhen: { field: "enabled", equals: true },
        },
      ],
      { enabled: true },
    ).valid,
    false,
  );
});
test("generic plots preserve missing/negative values, reject inconsistent series and escape CSV", () => {
  assert.deepEqual(P.normalize(plot).series[0].values, [-2, null, 3]);
  assert.throws(() =>
    P.normalize({ ...plot, series: [{ id: "a", label: "A", values: [1] }] }),
  );
  const data = P.normalize(plot);
  data.labels[0] = "=cmd";
  assert.match(P.toCSV(data), /'=cmd/);
  const before = plot.series[0].values[0];
  data.series[0].values[0] = 10;
  assert.equal(plot.series[0].values[0], before);
  assert.throws(() => P.normalize({ ...plot, html: "bad" }));
});
test("agent schema 1.1 validates new adapters and protects legacy 1.0", () => {
  const spec = {
    schemaVersion: "1.1.0",
    components: [
      { type: "form", id: "f", title: "Form", fields },
      {
        type: "datagrid",
        id: "g",
        title: "Grid",
        columns: [{ key: "name", label: "Name" }],
        rows: [{ id: "a", name: "A" }],
      },
      { type: "plot", id: "p", title: "Plot", data: plot },
    ],
  };
  assert.equal(A.validate(spec).valid, true);
  assert.equal(A.validate({ ...spec, schemaVersion: "1.0.0" }).valid, false);
  spec.components[0].values = { date: "bad" };
  assert.equal(A.validate(spec).valid, false);
});
test("column filter and locale search operate before pagination", () => {
  const columns = G.validateColumns([
    { key: "name", label: "Name" },
    { key: "group", label: "Group" },
  ]);
  const rows = G.validateRows(
    [
      { id: "a", name: "Ada", group: "one" },
      { id: "b", name: "Ada", group: "two" },
    ],
    columns,
  );
  assert.equal(
    G.query(rows, columns, {
      query: "ada",
      sort: "",
      direction: "asc",
      page: 1,
      pageSize: 5,
      filters: { group: "two" },
      locale: "en-US",
    }).rows[0].id,
    "b",
  );
});
test("isolated ESM does not publish globals and supports DOM-free import", () => {
  const output = execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `Object.defineProperty(globalThis,'document',{get(){throw Error('DOM accessed')}});await import(${JSON.stringify(new URL("../esm/forms.mjs", import.meta.url).href)});if(globalThis.MuhitForm)throw Error('Global polluted');console.log('ok')`,
    ],
    { encoding: "utf8" },
  );
  assert.match(output, /ok/);
});
