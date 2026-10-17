import test from "node:test";
import assert from "node:assert/strict";
import { MuhitForm as form, MuhitPreferences as prefs } from "../src/index.mjs";
const fields = [
  { name: "email", label: "E-posta", type: "email", required: true },
  { name: "count", label: "Adet", type: "number", min: 0, max: 10 },
  { name: "yes", label: "Onay", type: "checkbox", required: true },
  { name: "date", label: "Tarih", type: "date" },
];
test("forms: required, bounds, email, dates and zero values", () => {
  assert.equal(
    form.validate(fields, {
      email: "a@b.co",
      count: 0,
      yes: true,
      date: "2024-02-29",
    }).valid,
    true,
  );
  const r = form.validate(fields, {
    email: "bad",
    count: 11,
    yes: false,
    date: "2025-02-29",
  });
  assert.deepEqual(Object.keys(r.errors), ["email", "count", "yes", "date"]);
  assert.equal(form.validate(fields, { email: " ", yes: true }).valid, false);
});
test("forms: strict schema and independent snapshots", () => {
  assert.throws(() =>
    form.normalizeFields([{ name: "a", label: "A", type: "html" }]),
  );
  assert.throws(() =>
    form.normalizeFields([
      { name: "a", label: "A" },
      { name: "a", label: "B" },
    ]),
  );
  assert.throws(() =>
    form.normalizeFields([{ name: "a", label: "A", min: 1 }]),
  );
  assert.throws(() =>
    form.normalizeFields([
      {
        name: "a",
        label: "A",
        type: "select",
        options: [
          { value: "x", label: "X" },
          { value: "x", label: "Y" },
        ],
      },
    ]),
  );
  assert.throws(() => form.validate(fields, { unknown: "no" }));
  assert.throws(() => form.validate(fields, { count: "2" }));
  let executed = false;
  const unsafe = {
    get name() {
      executed = true;
      return "x";
    },
  };
  assert.throws(() => form.normalizeFields([unsafe]));
  assert.equal(executed, false);
  const normalized = form.normalizeFields(fields);
  normalized[0].label = "Changed";
  assert.equal(fields[0].label, "E-posta");
});
test("forms: selection and length errors use plain text", () => {
  const fs = [
    {
      name: "choice",
      label: "Seçim",
      type: "select",
      options: [{ value: "yes", label: "Evet" }],
    },
    { name: "text", label: "Metin", maxLength: 3 },
  ];
  assert.equal(form.validate(fs, { choice: "bad", text: "1234" }).valid, false);
  assert.equal(
    form.validate([{ name: "text", label: "Metin" }], {
      text: "<script>alert(1)</script>",
    }).values.text,
    "<script>alert(1)</script>",
  );
});
test("preferences: opt-in persistence, corruption, version, clear and quota failures", () => {
  const map = new Map(),
    storage = {
      getItem: (k) => map.get(k) ?? null,
      setItem: (k, v) => map.set(k, v),
      removeItem: (k) => map.delete(k),
    };
  const p = prefs.create({ key: "test", storage });
  assert.equal(p.load().source, "default");
  assert.equal(p.save({ mode: "dark" }).saved, true);
  assert.equal(p.load().config.mode, "dark");
  map.set("test", "bad");
  assert.ok(p.load().error);
  map.set("test", JSON.stringify({ version: 7, config: {} }));
  assert.ok(p.load().error);
  p.clear();
  assert.equal(p.load().source, "default");
  assert.throws(() => p.save({ mode: "invalid" }));
  const blocked = prefs.create({
    storage: {
      getItem() {
        throw Error("blocked");
      },
      setItem() {
        throw Error("quota");
      },
      removeItem() {
        throw Error("blocked");
      },
    },
  });
  assert.ok(blocked.load().error);
  assert.equal(blocked.save({}).saved, false);
  assert.equal(blocked.clear().cleared, false);
});

test('preferences: malformed envelope and reserved field identifiers are rejected', () => {
  const p = prefs.create({storage:{getItem:()=>'{"version":1}',setItem(){},removeItem(){}}});
  assert.ok(p.load().error);
  assert.throws(()=>prefs.create({key:''}));
  assert.throws(()=>form.normalizeFields([{name:'constructor',label:'Bad'}]));
});
