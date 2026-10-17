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
  await p.goto(url + "/examples/international.html");
  const result = await p.evaluate(async () => {
    const { MuhitDataGrid: G } = await import("/src/index.mjs");
    const h = document.createElement("div");
    document.body.append(h);
    const columns = [
      { key: "name", label: "Name" },
      { key: "score", label: "Score", type: "number" },
    ];
    let g = G.mount(h, {
      locale: "tr-TR",
      messages: { "{count} kayıt seçili": "Selected {count}" },
      selectable: true,
      columns,
      rows: [{ id: "a", name: " =1+1", score: 1234.5 }],
    });
    let rejected = false;
    try {
      g.setState({ locale: "en-US" });
    } catch {
      rejected = true;
    }
    g.setVisibleColumns(["name"]);
    g.setSelected(["a"]);
    const translatedCount = h.textContent.includes("Selected 1");
    const view = g.getView();
    const csv = g.toCSV();
    g.destroy();
    g = G.mount(h, {
      locale: "en-US",
      selectable: true,
      columns,
      rows: [{ id: "a", name: "A", score: 1234.5 }],
    });
    g.restoreView(view);
    const restored = {
      visible: g.getVisibleColumns(),
      selected: g.getSelected(),
      locale: g.getState().locale,
    };
    const size = h
      .querySelector("tbody .mh-grid-check")
      .getBoundingClientRect();
    g.destroy();
    let request;
    g = G.mount(h, {
      columns,
      load: async () => ({
        rows: [{ id: "a", name: "A", score: 1 }],
        total: 20,
      }),
      exportRows: async (q, signal) => {
        request = q;
        return [{ id: "b", name: "B", score: 2 }];
      },
    });
    await g.refresh();
    g.setSelected(["b"]);
    let remoteRejected = false;
    try {
      g.toCSV({ selectedOnly: true });
    } catch {
      remoteRejected = true;
    }
    const remote = await g.exportCSV({ scope: "selected" });
    g.destroy();
    h.remove();
    return {
      rejected,
      translatedCount,
      restored,
      csv,
      width: size.width,
      height: size.height,
      remoteRejected,
      remote,
      request,
    };
  });
  assert.equal(result.rejected, true);
  assert.equal(result.translatedCount, true);
  assert.deepEqual(result.restored, {
    visible: ["name"],
    selected: ["a"],
    locale: "en-US",
  });
  assert.ok(result.csv.includes("'=1+1") || result.csv.includes("' =1+1"));
  assert.ok(result.width >= 44 && result.height >= 44);
  assert.equal(result.remoteRejected, true);
  assert.ok(result.remote.includes('"B"'));
  assert.deepEqual(result.request.selected, ["b"]);
  await p.goto(url + "/examples/advanced.html");
  await p.getByRole("combobox", { name: "Find a team" }).fill("Res");
  await p.getByRole("option", { name: "Research" }).waitFor();
  await p.getByRole("combobox").press("ArrowDown");
  await p.getByRole("combobox").press("Enter");
  assert.equal(
    await p.locator("#selected").textContent(),
    "Selected: Research",
  );
  await p.getByRole("button", { name: "Add group", exact: true }).click();
  assert.equal(await p.locator("#members form").count(), 2);
  await p.locator("#members input[name=name]").nth(1).fill("Deniz");
  await p
    .locator("#members input[name=email]")
    .nth(1)
    .fill("deniz@example.com");
  await p
    .locator("#members")
    .getByRole("button", { name: "Save", exact: true })
    .click();
  await p
    .getByText("2 members saved in this example.", { exact: true })
    .waitFor();
  await p.locator("#profile input").fill("used@example.com");
  await p
    .getByText("This address is already in use.", { exact: true })
    .first()
    .waitFor();
  await p.locator("#profile input").fill("fresh@example.com");
  await p
    .locator("#profile")
    .getByRole("button", { name: "Save", exact: true })
    .click();
  await p
    .getByText("Profile saved in this example: fresh@example.com", {
      exact: true,
    })
    .waitFor();
  await p.addScriptTag({
    path: path.join(root, "node_modules/axe-core/axe.min.js"),
  });
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
      targets: v.nodes.map((n) => n.target),
    })),
    [],
  );
  await p.evaluate(async () => {
    const {
      MuhitForm: F,
      MuhitFields: X,
      MuhitAgent: A,
    } = await import("/src/index.mjs");
    const h = document.createElement("div");
    h.id = "race";
    document.querySelector("main").append(h);
    window.pending = [];
    window.race = F.mount(h, {
      locale: "en",
      fields: [{ name: "code", label: "Code" }],
      validationDelay: 0,
      validateAsync: (v, signal) =>
        new Promise((resolve) => pending.push({ v, signal, resolve })),
      onSubmit: async () => {},
    });
  });
  await p.getByLabel("Code", { exact: true }).fill("slow");
  await p.waitForFunction(() => pending.length === 1);
  await p.getByLabel("Code", { exact: true }).fill("fast");
  await p.waitForFunction(() => pending.length === 2);
  assert.equal(await p.evaluate(() => pending[0].signal.aborted), true);
  await p.evaluate(() => {
    pending[1].resolve({ code: "Latest validation" });
    pending[0].resolve({ code: "Obsolete validation" });
  });
  await p.getByText("Latest validation", { exact: true }).first().waitFor();
  assert.equal(
    await p.getByText("Obsolete validation", { exact: true }).count(),
    0,
  );
  await p.evaluate(() => {
    race.destroy();
    document.querySelector("#race").remove();
  });
  const events = await p.evaluate(async () => {
    const { MuhitAgent: A } = await import("/src/index.mjs");
    const h = document.createElement("div");
    document.body.append(h);
    const events = [];
    const view = A.render(
      h,
      {
        schemaVersion: "1.1.0",
        components: [
          {
            id: "g",
            type: "datagrid",
            title: "Grid",
            selectable: true,
            columns: [{ key: "name", label: "Name", editable: true }],
            rows: [{ id: "one", name: "Ada" }],
          },
          {
            id: "f",
            type: "form",
            title: "Profile",
            fields: [{ name: "name", label: "Name" }],
          },
        ],
      },
      { onAction: (e) => events.push(e.id) },
    );
    const cell = h.querySelector("tbody input[type=text]");
    cell.value = "Deniz";
    cell.dispatchEvent(new Event("change"));
    h.querySelector("[role=separator]").dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    h.querySelector("thead button").click();
    h.querySelector("tbody input[type=checkbox]").click();
    const field = h.querySelector("form input");
    field.value = "Ada";
    field.dispatchEvent(new Event("input", { bubbles: true }));
    view.destroy();
    h.remove();
    return events;
  });
  assert.ok(
    ["edit", "column-layout", "state", "selection", "form-change"].every((id) =>
      events.includes(id),
    ),
  );
  const atomicForm = await p.evaluate(async () => {
    const { MuhitForm } = await import("/src/index.mjs");
    const host = document.createElement("div");
    document.body.append(host);
    const form = MuhitForm.mount(host, {
      fields: [{ name: "name", label: "Name", type: "text" }],
      values: { name: "Preserved" },
    });
    let rejected = false;
    try {
      MuhitForm.mount(host, {
        fields: [{ name: "name", label: "Name", type: "text" }],
        validationDelay: -1,
      });
    } catch {
      rejected = true;
    }
    const preserved = host.querySelector("input")?.value;
    form.destroy();
    host.remove();
    return { rejected, preserved };
  });
  assert.deepEqual(atomicForm, { rejected: true, preserved: "Preserved" });
  const comboRace = await p.evaluate(async () => {
    const { MuhitFields } = await import("/src/index.mjs");
    const h = document.createElement("div");
    document.body.append(h);
    const pending = [];
    const combo = MuhitFields.combobox(h, {
      delay: 0,
      load: (query, signal) =>
        new Promise((resolve) => pending.push({ query, signal, resolve })),
    });
    const input = h.querySelector("input");
    input.focus();
    const tick = () => new Promise((resolve) => setTimeout(resolve, 30));
    input.value = "old";
    input.dispatchEvent(new Event("input"));
    await tick();
    input.value = "new";
    input.dispatchEvent(new Event("input"));
    await tick();
    pending[1].resolve([
      { id: "a", label: "First" },
      { id: "b", label: "Last" },
    ]);
    await tick();
    pending[0].resolve([{ id: "old", label: "Old" }]);
    await tick();
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }),
    );
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    const selected = combo.getValue();
    const aborted = pending[0].signal.aborted;
    input.value = "late";
    input.dispatchEvent(new Event("input"));
    await tick();
    combo.destroy();
    pending[2].resolve([{ id: "late", label: "Late" }]);
    await tick();
    const empty = h.childElementCount === 0;
    h.remove();
    return { selected, aborted, empty };
  });
  assert.deepEqual(comboRace, {
    selected: { id: "b", label: "Last" },
    aborted: true,
    empty: true,
  });
  assert.deepEqual(errors, []);
  console.log(
    "PASS " +
      engine +
      ": P1 locale contract, view restore, selection, CSV scope and 44px targets",
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
