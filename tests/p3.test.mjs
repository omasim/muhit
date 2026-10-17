import test from "node:test";
import assert from "node:assert/strict";
import { MuhitDataGrid as G, MuhitI18n as I } from "../src/index.mjs";
import de from "../locales/de.mjs";
import ar from "../locales/ar.mjs";
test("extra catalogs preserve placeholders and regional overrides", () => {
  assert.deepEqual(Object.keys(de).sort(), Object.keys(ar).sort());
  for (const [locale, catalog] of [
    ["de", de],
    ["ar", ar],
  ]) {
    for (const [key, value] of Object.entries(catalog)) {
      assert.deepEqual(
        (value.match(/\{\w+\}/g) || []).sort(),
        (key.match(/\{\w+\}/g) || []).sort(),
        key,
      );
      assert.ok(value.trim());
    }
    I.register(locale, catalog);
  }
  assert.equal(I.create({ locale: "de-DE" }).text("Kaydet"), "Speichern");
  assert.equal(I.create({ locale: "ar-EG" }).dir, "rtl");
  assert.equal(
    I.create({ locale: "ar", messages: { Kaydet: "OK" } }).text("Kaydet"),
    "OK",
  );
});
test("optimized queries preserve locale matching, null-last ordering, filters and stable ties", () => {
  const cols = G.validateColumns([
    { key: "name", label: "Name" },
    { key: "n", label: "Number", type: "number" },
  ]);
  const rows = G.validateRows(
    [
      { id: "a", name: "İstanbul", n: 2 },
      { id: "b", name: "Isparta", n: 2 },
      { id: "c", name: "izmir", n: null },
      { id: "d", name: "Ankara", n: 1 },
    ],
    cols,
  );
  const state = {
    query: "",
    sort: "n",
    direction: "desc",
    page: 1,
    pageSize: 10,
    locale: "tr",
  };
  assert.deepEqual(
    G.query(rows, cols, state).rows.map((r) => r.id),
    ["a", "b", "d", "c"],
  );
  assert.deepEqual(
    G.query(rows, cols, {
      ...state,
      query: "i",
      filters: { name: "İ" },
    }).rows.map((r) => r.id),
    ["a", "c"],
  );
  assert.equal(
    G.query(rows, cols, { ...state, sort: null, pageSize: 2, page: 2 }).rows[0]
      .id,
    "c",
  );
  assert.deepEqual(
    rows.map((r) => r.id),
    ["a", "b", "c", "d"],
  );
});
