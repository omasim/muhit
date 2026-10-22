import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
import de from "../locales/de.mjs";
import ar from "../locales/ar.mjs";
import { evaluatePerformance } from "../tools/performance-policy.mjs";
import {
  formatLocalDateTime,
  localDateTimeToUTC,
  createRecurringEvents,
} from "../src/planning-advanced.mjs";
import { calendarCandidate } from "../src/calendar-state.mjs";
test("millisecond conversion and recurrence retain exact instants", () => {
  for (const zone of ["UTC", "Europe/Berlin", "Asia/Kathmandu"]) {
    const value = "2026-10-22T09:00:30.123Z";
    assert.equal(
      localDateTimeToUTC(formatLocalDateTime(value, zone), zone),
      value,
    );
  }
  assert.equal(
    localDateTimeToUTC("2026-10-22T09:00:30.1", "UTC"),
    "2026-10-22T09:00:30.100Z",
  );
  assert.throws(() => localDateTimeToUTC("2026-02-30T09:00:30.123", "UTC"));
  const base = {
    id: "a",
    title: "a",
    start: "2026-10-22T09:00:30.123Z",
    end: "2026-10-22T10:00:30.456Z",
  };
  const next = createRecurringEvents(base, {
    frequency: "weekly",
    count: 2,
    timeZone: "UTC",
  });
  assert.equal(next[1].start, "2026-10-29T09:00:30.123Z");
  assert.equal(next[1].end, "2026-10-29T10:00:30.456Z");
});
test("title-only editing preserves the selected DST fold instant", () => {
  const base = {
    id: "fold",
    title: "a",
    start: "2026-10-25T01:15:00.123Z",
    end: "2026-10-25T01:45:00.456Z",
  };
  const next = calendarCandidate(
    base,
    {
      id: "fold",
      title: "b",
      start: formatLocalDateTime(base.start, "Europe/Berlin"),
      end: formatLocalDateTime(base.end, "Europe/Berlin"),
      resource: "",
    },
    "Europe/Berlin",
  );
  assert.equal(next.start, base.start);
  assert.equal(next.end, base.end);
});
test("planning message keys including dynamic block labels are covered in German and Arabic", async () => {
  const source = await readFile(
      new URL("../src/planning.mjs", import.meta.url),
      "utf8",
    ),
    file = ts.createSourceFile(
      "planning.mjs",
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.JS,
    ),
    keys = new Set();
  function extract(arg) {
    if (!arg) return;
    if (ts.isStringLiteral(arg)) keys.add(arg.text);
    else if (
      ts.isElementAccessExpression(arg) &&
      ts.isObjectLiteralExpression(arg.expression)
    ) {
      for (const prop of arg.expression.properties)
        if (
          ts.isPropertyAssignment(prop) &&
          ts.isStringLiteral(prop.initializer)
        )
          keys.add(prop.initializer.text);
    } else
      throw Error(
        "Unrecognized planning translation key: " + arg.getText(file),
      );
  }
  function visit(node) {
    if (ts.isCallExpression(node)) {
      if (node.expression.getText(file) === "tr") extract(node.arguments[1]);
      else if (
        ts.isPropertyAccessExpression(node.expression) &&
        node.expression.name.text === "text" &&
        node.expression.getText(file) !== "p.cfg.text"
      )
        extract(node.arguments[0]);
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  assert.ok(keys.size > 80);
  for (const [locale, catalog] of [
    ["de", de],
    ["ar", ar],
  ])
    for (const key of keys)
      assert.ok(
        typeof catalog[key] === "string" && catalog[key].trim(),
        locale + ": " + key,
      );
});
test("product failure cannot pass under the looser regression budget", async () => {
  const budgets = JSON.parse(
    await readFile(
      new URL("../schemas/performance-budgets.json", import.meta.url),
      "utf8",
    ),
  );
  const result = evaluatePerformance(
    { local: { p95Ms: 120 }, remote: { p95Ms: 2000 } },
    budgets,
  );
  assert.equal(result.regression.local, true);
  assert.equal(result.regression.remote, true);
  assert.equal(result.passed, false);
  assert.equal(
    evaluatePerformance(
      { local: { p95Ms: 20 }, remote: { p95Ms: 500 } },
      budgets,
    ).passed,
    true,
  );
  assert.equal(
    evaluatePerformance(
      { local: { p95Ms: NaN }, remote: { p95Ms: 0 } },
      budgets,
    ).passed,
    false,
  );
});
