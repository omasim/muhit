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
  const result = await p.evaluate(async () => {
    const {
      MuhitForm: F,
      MuhitDataGrid: G,
      MuhitPlot: P,
      MuhitAgent: A,
    } = await import("/src/index.mjs");
    const h = document.createElement("div");
    document.body.append(h);
    const fields = [
      {
        name: "choice",
        label: "Choice",
        type: "select",
        options: [{ value: "a", label: "A" }],
      },
      { name: "date", label: "Date", type: "date" },
    ];
    const f = F.mount(h, {
      fields,
      values: { choice: "a", date: "2026-10-17" },
    });
    let rejected = 0;
    for (const v of [{ choice: "missing" }, { date: "2025-02-29" }])
      try {
        f.setValues(v);
      } catch {
        rejected++;
      }
    const preserved = f.getValues();
    f.destroy();
    const f2 = F.mount(h, {
      fields: [
        { name: "a", label: "A" },
        { name: "b", label: "B" },
      ],
      onSubmit: () => ({ errors: { a: "Already used" } }),
    });
    h.querySelector("form").requestSubmit();
    await Promise.resolve();
    await Promise.resolve();
    const b = h.querySelector("[name=b]");
    b.value = "other";
    b.dispatchEvent(new Event("input", { bubbles: true }));
    const retained = h.querySelector("[name=a]").getAttribute("aria-invalid");
    f2.destroy();
    const outer = document.createElement("form");
    document.body.append(outer);
    const gh = document.createElement("div");
    outer.append(gh);
    let submitted = 0;
    outer.addEventListener("submit", (e) => {
      e.preventDefault();
      submitted++;
    });
    const g = G.mount(gh, {
      selectable: true,
      columns: [
        { key: "name", label: "Name", editable: true },
        { key: "n", label: "Number", type: "number", editable: true },
      ],
      rows: [
        { id: "a", name: "=danger", n: 1 },
        { id: "b", name: "Second", n: 2 },
      ],
    });
    gh.querySelector("th button").click();
    gh.querySelector("tbody input[type=checkbox]").click();
    const selection = g.getSelected();
    g.updateCell("b", "n", 5);
    g.setVisibleColumns(["name"]);
    const csv = g.toCSV();
    g.setState({ filters: { name: "Second" } });
    const filtered = gh.querySelectorAll("tbody tr").length;
    g.destroy();
    outer.remove();
    const plot = {
      title: "Temperature",
      unit: "°C",
      labels: ["A", "B", "C"],
      series: [{ id: "t", label: "Reading", values: [-2, null, 3] }],
    };
    const chart = P.mount(h, plot);
    const gaps = h.querySelectorAll("polyline").length;
    const table = h.querySelector("table").textContent;
    chart.destroy();
    const view = A.render(
      h,
      {
        schemaVersion: "1.1.0",
        components: [
          {
            type: "form",
            id: "f",
            title: "Form",
            fields: [{ name: "name", label: "Name", required: true }],
          },
          {
            type: "datagrid",
            id: "d",
            title: "Data",
            columns: [{ key: "name", label: "Name" }],
            rows: [{ id: "a", name: "A" }],
          },
          { type: "plot", id: "p", title: "Plot", data: plot },
        ],
      },
      {
        onAction: async (event) => {
          if (event.id === "submit") window.__submitted = event.value;
        },
      },
    );
    const input = h.querySelector("[name=name]");
    input.value = "Ada";
    h.querySelector("form").requestSubmit();
    await Promise.resolve();
    await Promise.resolve();
    const count = h.querySelectorAll("[data-component]").length;
    let invalid = false;
    try {
      view.update({
        schemaVersion: "1.1.0",
        components: [{ type: "form", id: "x", title: "Bad", fields: [] }],
      });
    } catch {
      invalid = true;
    }
    const remaining = h.querySelectorAll("[data-component]").length;
    view.destroy();
    h.remove();
    return {
      rejected,
      preserved,
      retained,
      submitted,
      selection,
      csv,
      filtered,
      gaps,
      table,
      count,
      invalid,
      remaining,
      agentSubmitted: window.__submitted,
    };
  });
  assert.equal(result.rejected, 2);
  assert.deepEqual(result.preserved, { choice: "a", date: "2026-10-17" });
  assert.equal(result.retained, "true");
  assert.equal(result.submitted, 0);
  assert.equal(result.selection.length, 1);
  assert.match(result.csv, /'=danger/);
  assert.ok(!result.csv.includes("Number"));
  assert.equal(result.filtered, 1);
  assert.equal(result.gaps, 2);
  assert.ok(result.table.includes("—"));
  assert.equal(result.count, 3);
  assert.equal(result.remaining, 3);
  assert.equal(result.invalid, true);
  assert.equal(result.agentSubmitted.name, "Ada");
  // Real cross-tab storage events and unsubscribe, in a shared browser context.
  await p.evaluate(async () => {
    const { MuhitPreferences } = await import("/src/index.mjs");
    window.__events = [];
    window.__unsubscribe = MuhitPreferences.create({
      key: "sync-test",
    }).subscribe((r) => window.__events.push(r.config.mode));
  });
  const other = await context.newPage();
  await other.goto(url + "/examples/settings.html");
  await other.evaluate(async () => {
    const { MuhitPreferences } = await import("/src/index.mjs");
    MuhitPreferences.create({ key: "sync-test" }).save({ mode: "dark" });
  });
  await p.waitForFunction(() => window.__events.length === 1);
  assert.deepEqual(await p.evaluate(() => window.__events), ["dark"]);
  await other.evaluate(async () => {
    const { MuhitPreferences } = await import("/src/index.mjs");
    MuhitPreferences.create({ key: "sync-test" }).clear();
  });
  await p.waitForFunction(() => window.__events.length === 2);
  assert.equal(await p.evaluate(() => window.__events[1]), "light");
  await p.evaluate(() => window.__unsubscribe());
  await other.evaluate(async () => {
    const { MuhitPreferences } = await import("/src/index.mjs");
    MuhitPreferences.create({ key: "sync-test" }).save({ mode: "dark" });
  });
  await p.waitForTimeout(100);
  assert.equal(await p.evaluate(() => window.__events.length), 2);
  await other.close();
  for (const direction of ["ltr", "rtl"]) {
    await p.evaluate((dir) => (document.documentElement.dir = dir), direction);
    await p.setViewportSize({ width: 390, height: 844 });
    assert.ok(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
  }
  await p.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await p.getByLabel("İletişim e-postası *").focus();
  assert.ok(
    await p
      .getByLabel("İletişim e-postası *")
      .evaluate((el) => el === document.activeElement),
  );
  await p.emulateMedia({forcedColors:"none",reducedMotion:"reduce"});
  await p.goto(url + "/examples/workspace.html");
  await p.getByRole("button", { name: "Yeni çalışma", exact: true }).click();
  await p.getByLabel("Çalışma adı *").fill("Yeni araştırma");
  await p.getByLabel("Kaynak sayısı *").fill("6");
  await p.getByRole("button", { name: "Kaydet", exact: true }).click();
  await p
    .getByText("Örnek kayıt bellekte güncellendi.", { exact: true })
    .waitFor();
  assert.ok(
    (await p.locator("#records input").evaluateAll(nodes=>nodes.map(n=>n.value))).includes("Yeni araştırma"),
  );
  await p.getByRole("button", { name: "Agent örneğini aç" }).click();
  await p.locator("#agent [data-component=form]").waitFor();
  assert.equal(await p.locator("#agent [data-component]").count(), 3);
  await p.getByRole("button", { name: "Agent örneğini kapat" }).click();
  await p.locator("#scenario").selectOption("forbidden");
  assert.equal(await p.locator(".work-grid").isVisible(), false);
  await p.locator("#scenario").selectOption("ready");
  assert.equal(await p.locator(".work-grid").isVisible(), true);
  console.log("LAYOUT",await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,wide:[...document.querySelectorAll("body *")].filter(n=>n.getBoundingClientRect().right>innerWidth+1&&!n.closest(".mh-data-grid__scroll")).map(n=>({tag:n.tagName,cls:n.className,width:n.getBoundingClientRect().width,right:n.getBoundingClientRect().right})).slice(0,15)})));
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await p.setViewportSize({ width: 1440, height: 1000 });
  await p.screenshot({
    path: path.join(root, "tests", "workspace-" + engine + ".png"),
    fullPage: true,
  });
  const performance = await p.evaluate(async () => {
    const { MuhitDataGrid } = await import("/src/index.mjs");
    const h = document.createElement("div");
    document.body.append(h);
    const start = globalThis.performance.now();
    const g = MuhitDataGrid.mount(h, {
      columns: [{ key: "name", label: "Name" }],
      rows: Array.from({ length: 10000 }, (_, i) => ({
        id: String(i),
        name: "Record " + i,
      })),
    });
    const duration = globalThis.performance.now() - start;
    const count = h.querySelectorAll("tbody tr").length;
    g.destroy();
    h.remove();
    return { duration, count };
  });
  assert.equal(performance.count, 10);
  assert.ok(
    performance.duration < 3000,
    "10k-row mount exceeds 3s reference budget",
  );
  console.log("PERFORMANCE " + engine + " " + JSON.stringify(performance));
  assert.deepEqual(errors, []);
  console.log(
    "PASS " +
      engine +
      ": 3 audit regressions, grid selection/filter/edit/CSV, plot gaps/table, agent 1.1 transactions, cross-tab sync/unsubscribe, RTL/mobile/forced-colors.",
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
