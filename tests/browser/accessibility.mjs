import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const engines = await import(
  process.env.MUHIT_PLAYWRIGHT_MODULE || "playwright"
);
const root = path.resolve(fileURLToPath(new URL("../../", import.meta.url)));
const server = createServer(async (req, res) => {
  try {
    const f = path.resolve(
      root,
      "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname),
    );
    if (f !== root && !f.startsWith(root + path.sep)) throw Error();
    const name = f === root ? path.join(f, "index.html") : f;
    const ext = path.extname(name);
    res.setHeader(
      "Content-Type",
      {
        ".js": "text/javascript",
        ".mjs": "text/javascript",
        ".css": "text/css",
        ".html": "text/html",
        ".svg": "image/svg+xml",
        ".json": "application/json",
        ".ttf": "font/ttf",
        ".woff2": "font/woff2",
      }[ext] || "application/octet-stream",
    );
    res.end(await readFile(name));
  } catch {
    res.statusCode = 404;
    res.end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const url = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  const engine = process.env.MUHIT_BROWSER || "chromium";
  browser = await engines[engine].launch({
    headless: true,
    ...(engine === "chromium" && process.env.MUHIT_CHROME
      ? { executablePath: process.env.MUHIT_CHROME }
      : {}),
  });
  const context = await browser.newContext();
  const p = await context.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(url + "/examples/settings.html");
  await p.evaluate(async () => {
    document.documentElement.lang = "en";
    document.body.innerHTML =
      '<main><h1>Accessibility fixture</h1><div id="grid"></div><div id="form"></div><div id="tabs"></div><div id="chart"></div></main>';
    const m = await import("/src/index.mjs");
    window.m = m;
    window.grid = m.MuhitDataGrid.mount("#grid", {
      locale: "en-US",
      selectable: true,
      columns: [
        { key: "name", label: "Name", editable: true },
        { key: "score", label: "Score", type: "number" },
      ],
      rows: [
        { id: "one", name: "Ada", score: 12 },
        { id: "two", name: "Deniz", score: 20 },
      ],
    });
    window.form = m.MuhitForm.mount("#form", {
      locale: "en-US",
      fields: [
        { name: "email", label: "Email", type: "email", required: true },
      ],
      onSubmit: async () => {},
    });
    window.tabs = m.MuhitWidgets.mount(
      "#tabs",
      {
        id: "tabs",
        type: "tabs",
        title: "Views",
        items: [
          { id: "one", label: "One", content: "First" },
          { id: "two", label: "Two", content: "Second" },
        ],
      },
      { locale: "en", dir: "rtl" },
    );
    window.chart = m.MuhitPlot.mount("#chart", {
      title: "Scores",
      unit: "points",
      locale: "en",
      labels: ["One", "Two"],
      series: [{ id: "a", label: "Team A", values: [10, null] }],
    });
  });
  await p
    .getByRole("checkbox", { name: "Select record: one", exact: true })
    .focus();
  await p.keyboard.press("Space");
  assert.equal(
    await p.evaluate(() => document.activeElement.getAttribute("aria-label")),
    "Select record: one",
  );
  assert.deepEqual(await p.evaluate(() => grid.getSelected()), ["one"]);
  const resize = p.getByRole("separator").first();
  await resize.focus();
  await p.keyboard.press("ArrowRight");
  assert.equal(await p.evaluate(() => grid.getColumnLayout()[0].width), 210);
  assert.equal(
    await resize.evaluate((n) => n === document.activeElement),
    true,
  );
  const box = await resize.boundingBox();
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await p.mouse.down();
  await p.mouse.move(box.x + box.width / 2 + 40, box.y + box.height / 2);
  await p.mouse.up();
  assert.equal(await p.evaluate(() => grid.getColumnLayout()[0].width), 250);
  await p.getByText("Columns", { exact: true }).click();
  await p
    .getByRole("button", { name: "Name: Move later", exact: true })
    .click();
  assert.deepEqual(
    await p.evaluate(() => grid.getColumnLayout().map((c) => c.key)),
    ["score", "name"],
  );
  await p
    .getByRole("combobox", { name: "Name: Pin", exact: true })
    .selectOption("start");
  assert.equal(
    await p
      .locator("#grid thead th[data-column]")
      .first()
      .getAttribute("data-column"),
    "name",
  );
  assert.match(await p.evaluate(() => grid.toCSV()), /^﻿"Name","Score"/);
  assert.equal(
    await p
      .locator("#grid th[data-column=name]")
      .evaluate((n) => getComputedStyle(n).position),
    "sticky",
  );
  const before = await p.evaluate(() => grid.getColumnLayout());
  assert.equal(
    await p.evaluate(() => {
      try {
        grid.setColumnLayout([{ key: "name", width: 0, pin: null }]);
        return false;
      } catch {
        return true;
      }
    }),
    true,
  );
  assert.deepEqual(await p.evaluate(() => grid.getColumnLayout()), before);
  await p.getByText("Columns", { exact: true }).click();
  await p
    .getByRole("button", {
      name: "Score: Move column; open order options",
      exact: true,
    })
    .dragTo(p.locator("#grid th[data-column=name]"));
  assert.deepEqual(
    await p.evaluate(() =>
      grid
        .getColumnLayout()
        .filter((c) => c.pin === "start")
        .map((c) => c.key),
    ),
    ["score", "name"],
  );
  await p.evaluate((value) => grid.setColumnLayout(value), before);
  await p.getByRole("textbox", { name: "Name · one", exact: true }).focus();
  await p
    .getByRole("textbox", { name: "Name · one", exact: true })
    .fill("Ada revised");
  await p
    .getByRole("textbox", { name: "Name · one", exact: true })
    .dispatchEvent("change");
  assert.equal(
    await p.evaluate(() => document.activeElement.getAttribute("aria-label")),
    "Name · one",
  );
  await p.getByRole("button", { name: "Save", exact: true }).click();
  assert.equal(await p.locator("#form [aria-invalid=true]").count(), 1);
  assert.ok(
    (await p.evaluate(() => document.activeElement.textContent)).includes(
      "Complete Email.",
    ),
  );
  await p.getByRole("tab", { name: "One", exact: true }).focus();
  await p.keyboard.press("ArrowLeft");
  assert.equal(
    await p.evaluate(() => document.activeElement.textContent),
    "Two",
  );
  await p.addScriptTag({
    path: path.join(root, "node_modules/axe-core/axe.min.js"),
  });
  for (const mode of ["light", "dark"]) {
    await p.evaluate(
      (mode) => m.MuhitTheme.apply({ mode }, document.documentElement),
      mode,
    );
    await p.emulateMedia({ reducedMotion: "reduce" });
    await p.waitForTimeout(300);
    const audit = await p.evaluate(
      async () =>
        await axe.run(document.querySelector("main"), {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
          },
        }),
    );
    assert.deepEqual(
      audit.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
      [],
      mode + " axe violations",
    );
  }
  await p.setViewportSize({ width: 390, height: 844 });
  await p.evaluate(() => (document.documentElement.dir = "rtl"));
  assert.ok(
    await p.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    "page must not overflow",
  );
  await p.setViewportSize({ width: 1280, height: 900 });
  await p.evaluate(async () => {
    document.documentElement.dir = "ltr";
    document.querySelector("main").replaceChildren();
    const specs = await (await fetch("/examples/widgets.json")).json();
    for (const spec of specs) {
      const host = document.createElement("div");
      document.querySelector("main").append(host);
      m.MuhitWidgets.mount(host, spec, { locale: "en" });
    }
  });
  const widgetsAudit = await p.evaluate(
    async () =>
      await axe.run(document.querySelector("main"), {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
        },
      }),
  );
  assert.deepEqual(
    widgetsAudit.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
    [],
    "all widget accessibility",
  );
  const open = p.getByRole("button", { name: "Search commands ⌕" });
  await open.click();
  await p.keyboard.press("Escape");
  assert.equal(await open.evaluate((n) => n === document.activeElement), true);
  await p.evaluate(() => {
    const main = document.querySelector("main");
    main.replaceChildren();
    const table = document.createElement("div"),
      chart = document.createElement("div");
    main.append(table, chart);
    m.MuhitTable.mount(table, { locale: "en", rows: [], demo: false });
    m.MuhitCharts.mount(chart, { locale: "en", periodControl: false });
  });
  await p.getByRole("searchbox", { name: "Search projects" }).waitFor();
  await p.getByRole("button", { name: "Download CSV", exact: true }).waitFor();
  const legacyAudit = await p.evaluate(
    async () =>
      await axe.run(document.querySelector("main"), {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
        },
      }),
  );
  assert.deepEqual(
    legacyAudit.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
    [],
    "table/chart accessibility",
  );
  await p.goto(url + "/examples/international.html");
  await p.getByLabel("Başlık *", { exact: true }).fill("Preserved draft");
  await p.locator("#language").selectOption("en-US");
  assert.equal(
    await p.getByLabel("Title *", { exact: true }).inputValue(),
    "Preserved draft",
  );
  await p.locator("#direction").selectOption("rtl");
  assert.equal(await p.locator("#records section").getAttribute("dir"), "rtl");
  assert.deepEqual(errors, []);
  console.log(
    "PASS " +
      engine +
      ": column keyboard/pointer resize, order/pin/CSV, atomic layout validation, selection/edit focus, translated form errors, RTL tabs, axe light/dark, mobile.",
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
