import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
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
  await p.goto(url + "/examples/scale.html");
  await p
    .getByRole("button", { name: "Move Research card", exact: true })
    .waitFor();
  const handle = p.getByRole("button", {
    name: "Move Research card",
    exact: true,
  });
  await handle.focus();
  await p.keyboard.press("Space");
  await p.keyboard.press("ArrowRight");
  await p.keyboard.press("Enter");
  assert.equal(
    await p.evaluate(() => lastMove.value.find((x) => x.id === "one").column),
    "doing",
  );
  await handle.focus();
  await p.keyboard.press("Space");
  await p.keyboard.press("ArrowRight");
  await p.keyboard.press("Escape");
  assert.equal(
    await p.evaluate(() => lastMove.value.find((x) => x.id === "one").column),
    "doing",
  );
  const a = await handle.boundingBox(),
    b = await p.locator('[data-lane="done"]').boundingBox();
  await p.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await p.mouse.down();
  await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 12 });
  await p.mouse.up();
  assert.equal(
    await p.evaluate(() => lastMove.value.find((x) => x.id === "one").column),
    "done",
  );
  await p.locator('select[id$="-one"]').selectOption("ideas");
  assert.equal(
    await p.evaluate(() => lastMove.value.find((x) => x.id === "one").column),
    "ideas",
  );
  // Pointer events cover the same touch handler in all engines; physical-device acceptance remains separate.
  const touch = await p.evaluate(() => {
    const h = document.querySelector(".mh-kanban-handle"),
      lane = document.querySelector('[data-lane="done"]');
    const r = lane.getBoundingClientRect();
    // Native capture requires an active pointer; use a real touch session below for Chromium.
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  if (engine === "chromium") {
    const session = await context.newCDPSession(p);
    const box = await handle.boundingBox();
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: box.x + 20, y: box.y + 20 }],
    });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [touch],
    });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    assert.equal(
      await p.evaluate(() => lastMove.value.find((x) => x.id === "one").column),
      "done",
    );
    await session.detach();
  }
  const performanceReport = await p.evaluate(async () => {
    const { MuhitDataGrid: G } = await import("/src/index.mjs");
    const columns = Array.from({ length: 20 }, (_, i) => ({
      key: "c" + i,
      label: "Column " + i,
      type: "text",
    }));
    const rows = Array.from({ length: 20000 }, (_, i) =>
      Object.fromEntries([
        ["id", "r" + i],
        ...columns.map((c, j) => [
          c.key,
          "Research " +
            ((20000 - i) % 101) +
            " " +
            "long context ".repeat(10) +
            j,
        ]),
      ]),
    );
    const result = {};
    for (const [name, extra] of [
      ["page", {}],
      ["search", { query: "missing" }],
      ["sort", { sort: "c0" }],
      ["filter", { filters: { c2: "Research 50 " } }],
    ]) {
      const start = performance.now();
      const output = G.query(rows, columns, {
        query: "",
        direction: "asc",
        page: 1,
        pageSize: 20,
        ...extra,
      });
      result[name] = { ms: performance.now() - start, total: output.total };
    }
    const h = document.createElement("div");
    document.querySelector("main").append(h);
    const start = performance.now();
    const grid = G.mount(h, { columns, rows, locale: "en" });
    await grid.refresh();
    result.mount = {
      ms: performance.now() - start,
      domRows: h.querySelectorAll("tbody tr").length,
    };
    grid.setState({ query: "Research 50 " });
    await grid.refresh();
    result.filteredRows = h.querySelectorAll("tbody tr").length;
    grid.destroy();
    h.remove();
    return result;
  });
  for (const key of ["page", "search", "sort", "filter"])
    assert.ok(performanceReport[key].ms < 5000, key + " budget");
  assert.ok(performanceReport.mount.ms < 10000, "wide grid mount budget");
  assert.equal(performanceReport.search.total, 0);
  assert.equal(performanceReport.filter.total, 198);
  assert.equal(performanceReport.mount.domRows, 10);
  assert.equal(performanceReport.filteredRows, 10);
  await p.setViewportSize({ width: 390, height: 844 });
  assert.ok(
    await p.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  );
  await p.goto(url + "/studio-en.html");
  await p.waitForFunction(() => window.studioReady === true);
  assert.equal(await p.locator("#controls select").count(), 22);
  await p.locator("#theme-mode").selectOption("dark");
  assert.equal(await p.locator("html").getAttribute("data-mh-mode"), "dark");
  await p.getByRole("button", { name: "Undo", exact: true }).click();
  assert.equal(await p.locator("#theme-mode").inputValue(), "light");
  await p.getByRole("button", { name: "Redo", exact: true }).click();
  assert.equal(await p.locator("#theme-mode").inputValue(), "dark");
  await p.locator("#import").setInputFiles({name:"bad.json",mimeType:"application/json",buffer:Buffer.from("{")});
  await p.waitForFunction(()=>document.getElementById("theme-status").textContent.startsWith("Import failed"));
  assert.equal(await p.locator("#theme-mode").inputValue(),"dark");
  await p.locator("#import").setInputFiles({name:"theme.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify({preset:"tide",mode:"light"}))});
  await p.waitForFunction(()=>document.getElementById("theme-preset").value==="tide");
  await p.locator("#locale").selectOption("de");
  await p
    .locator("#form")
    .getByRole("button", { name: "Speichern", exact: true })
    .click();
  assert.ok(
    (await p.locator("#form").innerText()).includes(
      "Bitte die folgenden Felder prüfen.",
    ),
  );
  await p.locator("#locale").selectOption("ar");
  assert.equal(await p.locator("#grid>section").getAttribute("dir"), "rtl");
  assert.ok(
    await p
      .locator("#form")
      .getByRole("button", { name: "حفظ", exact: true })
      .isVisible(),
  );
  await p.locator("#locale").selectOption("en");
  await p.locator("#theme-mode").selectOption("light");
  await p.locator("#spec").fill('{"schemaVersion":"oops"}');
  await p.locator("#render").click();
  assert.ok(
    (await p.locator("#agent-status").innerText()).startsWith(
      "Definition rejected",
    ),
  );
  assert.ok(
    await p
      .locator("#agent-view")
      .getByText("Ideas in context", { exact: true })
      .isVisible(),
  );
  const downloads = p.waitForEvent("download");
  await p.locator("#json").click();
  assert.equal((await downloads).suggestedFilename(), "muhit-theme.json");
  await p.addScriptTag({
    path: path.join(root, "node_modules/axe-core/axe.min.js"),
  });
  const axe = await p.evaluate(async () => await axe.run(document));
  if (axe.violations.length)
    console.log(
      JSON.stringify(
        axe.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ),
    );
  assert.deepEqual(
    axe.violations.map((v) => v.id),
    [],
  );
  assert.ok(
    await p.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    "English studio mobile overflow",
  );
  assert.deepEqual(errors, []);
  await writeFile(
    path.join(root, "tests/scale-verification-" + engine + ".json"),
    JSON.stringify(
      {
        engine,
        performance: performanceReport,
        keyboard: true,
        pointer: true,
        touchEmulated: engine === "chromium",
      },
      null,
      2,
    ) + "\n",
  );
  console.log("PASS P3 scale and Kanban", engine, performanceReport);
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
