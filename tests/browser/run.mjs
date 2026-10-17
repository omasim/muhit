import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const { chromium } = await import(
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
  browser = await chromium.launch({
    headless: true,
    ...(process.env.MUHIT_CHROME
      ? { executablePath: process.env.MUHIT_CHROME }
      : {}),
  });
  const p = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  p.setDefaultTimeout(10000);
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(url + "/?component=cards#components");
  const ratio = await p.evaluate(() => {
    MuhitTheme.apply({ accent: "#FFFF00" });
    const c = getComputedStyle(document.querySelector(".mh-card--ink"));
    const hex = (s) =>
      "#" +
      s
        .match(/\d+/g)
        .slice(0, 3)
        .map((n) => (+n).toString(16).padStart(2, "0"))
        .join("");
    return MuhitTheme.contrast(hex(c.color), hex(c.backgroundColor));
  });
  assert.ok(ratio >= 4.5);
  await p.locator("[data-component-tab=table]").click();
  await p.getByLabel("Sorumlu filtresi").selectOption({ label: "Ada Deniz" });
  await p.getByPlaceholder("Proje, alan veya sorumlu").fill("zzzz");
  await p.getByRole("button", { name: "Aramayı ve filtreyi sıfırla" }).click();
  assert.equal(await p.getByLabel("Sorumlu filtresi").inputValue(), "");
  await p.getByLabel("Sorumlu filtresi").selectOption({ label: "Ada Deniz" });
  await p
    .getByRole("button", { name: "Sorumlu filtresini kaldır: Ada Deniz" })
    .click();
  assert.equal(await p.getByLabel("Sorumlu filtresi").inputValue(), "");
  await p.evaluate(() => MuhitTheme.apply({ tableHeader: "sticky" }));
  await p.locator(".mh-table__page-size select").selectOption("10");
  const scroll = p.locator(".mh-table__scroll");
  await scroll.evaluate((el) => {
    el.style.maxHeight = "180px";
    el.scrollTop = 100;
  });
  assert.ok(
    await scroll.evaluate((el) => {
      const a = el.getBoundingClientRect(),
        b = el.querySelector("thead").getBoundingClientRect();
      return el.scrollHeight > el.clientHeight && Math.abs(a.top - b.top) < 3;
    }),
  );
  await p.goto(url + "/#customize");
  await p
    .locator("#config-cardSurface")
    .evaluate((el) => (el.closest("details").open = true));
  await p.selectOption("#config-cardSurface", "tinted");
  await p.locator("#theme-undo").click();
  assert.equal(await p.locator("#config-cardSurface").inputValue(), "plain");
  await p.locator("#theme-redo").click();
  assert.equal(await p.locator("#config-cardSurface").inputValue(), "tinted");
  await p.goto(url + "/?component=pages#components");
  await p.locator("[data-page-recipe=detail]").click();
  assert.match(p.url(), /page=detail/);
  await p.reload();
  assert.equal(
    await p.locator("[data-page-recipe=detail]").getAttribute("aria-pressed"),
    "true",
  );
  await p.evaluate(() => {
    const host = document.createElement("div");
    host.id = "audit-grid";
    document.querySelector("#main").append(host);
    window.testGrid = MuhitDataGrid.mount(host, {
      columns: [
        { key: "title", label: "Ad" },
        { key: "n", label: "Sayı", type: "number" },
      ],
      rows: Array.from({ length: 10000 }, (_, i) => ({
        id: String(i),
        title: i === 0 ? "<img src=x onerror=alert(1)>" : "Kayıt " + i,
        n: i,
      })),
    });
  });
  assert.equal(await p.locator("#audit-grid tbody tr").count(), 10);
  assert.equal(await p.locator("#audit-grid img").count(), 0);
  await p.evaluate(() => testGrid.destroy());
  assert.equal(await p.locator("#audit-grid table").count(), 0);
  await p.evaluate(async () => {
    let request = 0;
    const host = document.querySelector("#audit-grid");
    window.testGrid = MuhitDataGrid.mount(host, {
      columns: [{ key: "title", label: "Ad" }],
      load: async (state, signal) => {
        const id = ++request;
        await new Promise((r) => setTimeout(r, id === 1 ? 100 : 10));
        return { rows: [{ id: "a", title: state.query || "eski" }], total: 1 };
      },
    });
    testGrid.setState({ query: "yeni" });
  });
  await p.waitForTimeout(150);
  assert.equal(await p.locator("#audit-grid tbody").innerText(), "yeni");
  await p.evaluate(async () => {
    window.testGrid.destroy();
    let attempts = 0;
    window.testGrid = MuhitDataGrid.mount(
      document.querySelector("#audit-grid"),
      {
        columns: [{ key: "title", label: "Ad" }],
        load: async () => {
          if (++attempts === 1) throw Error("test");
          return { rows: [{ id: "ok", title: "yeniden yüklendi" }], total: 1 };
        },
      },
    );
  });
  await p.getByRole("button", { name: "Yeniden dene", exact: true }).click();
  await p.waitForFunction(() =>
    document
      .querySelector("#audit-grid tbody")
      .textContent.includes("yeniden yüklendi"),
  );
  await p.evaluate(async () => {
    const host = document.createElement("div");
    host.id = "rich-agent";
    document.querySelector("#main").append(host);
    const spec = await (await fetch("/examples/rich-agent.json")).json();
    MuhitAgent.render(host, spec, { onAction: () => {} });
  });
  assert.ok(
    await p.locator("#rich-agent [data-state=loading] button").isDisabled(),
  );
  assert.ok(
    await p.locator("#rich-agent [data-state=disabled] button").isDisabled(),
  );
  assert.equal(await p.locator("#rich-agent .mh-page").count(), 1);
  for (const mode of ["light", "dark"])
    for (const width of [1440, 390]) {
      await p.evaluate((mode) => MuhitTheme.apply({ mode, scale: 1.25 }), mode);
      await p.setViewportSize({ width, height: 1000 });
      assert.ok(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
    }
  await p.goto(url + "/examples/settings.html");
  await p.getByRole("button", { name: "Örnek kaydı dene" }).click();
  assert.equal(
    await p.getByLabel("İletişim e-postası *").getAttribute("aria-invalid"),
    "true",
  );
  assert.ok(
    await p
      .locator(".mh-form .mh-alert")
      .evaluate((n) => n === document.activeElement),
  );
  await p.getByLabel("İletişim e-postası *").fill("hello@example.com");
  await p.getByRole("button", { name: "Örnek kaydı dene" }).click();
  await p.getByText("Kaydedildi.", { exact: true }).waitFor();
  assert.equal(await p.evaluate(() => exampleForm.isDirty()), false);
  await p.getByLabel("Örnek yanıt").selectOption("validation");
  await p.getByRole("button", { name: "Örnek kaydı dene" }).click();
  await p.getByText("Kayıt tamamlanamadı.", { exact: true }).waitFor();
  assert.equal(
    await p.getByLabel("İletişim e-postası *").getAttribute("aria-invalid"),
    "true",
  );
  await p.getByLabel("İletişim e-postası *").fill("retry@example.com");
  await p.getByLabel("Örnek yanıt").selectOption("network");
  await p.getByRole("button", { name: "Örnek kaydı dene" }).click();
  await p
    .getByText("Kaydedilemedi. Bağlantınızı kontrol edip yeniden deneyin.", {
      exact: true,
    })
    .waitFor();
  await p.getByLabel("Örnek yanıt").selectOption("success");
  await p
    .getByLabel("Çalışma alanı adı *")
    .fill("<img src=x onerror=alert(1)>");
  await p.getByRole("button", { name: "Örnek kaydı dene" }).click();
  assert.ok(await p.getByLabel("Çalışma alanı adı *").isDisabled());
  await p.getByRole("button", { name: "Sıfırla", exact: true }).click();
  await p.waitForTimeout(600);
  assert.equal(
    await p.getByLabel("Çalışma alanı adı *").inputValue(),
    "Ortak Atölye",
  );
  assert.equal(await p.evaluate(() => exampleForm.isDirty()), false);
  await p.getByLabel("Renk paleti").selectOption("atelier");
  await p.getByLabel("Tema", { exact: true }).selectOption("dark");
  await p.reload();
  assert.equal(
    await p.getByLabel("Tema", { exact: true }).inputValue(),
    "dark",
  );
  assert.equal(await p.getByLabel("Renk paleti").inputValue(), "atelier");
  await p.getByLabel("Metin ölçeği").selectOption("1.25");
  assert.ok(
    await p.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  );
  await p.getByRole("button", { name: "Görünümü sıfırla" }).click();
  assert.equal(
    await p.getByLabel("Tema", { exact: true }).inputValue(),
    "light",
  );
  await p.evaluate(async () => {
    const { MuhitForm } = await import("/src/index.mjs");
    const host = document.createElement("div");
    document.body.append(host);
    let finish;
    const form = MuhitForm.mount(host, {
      fields: [{ name: "x", label: "X" }],
      onSubmit: () => new Promise((r) => (finish = r)),
    });
    host.querySelector("form").requestSubmit();
    form.destroy();
    finish();
    await Promise.resolve();
    if (host.children.length) throw Error("destroy failed");
    const next = MuhitForm.mount(host, { fields: [{ name: "x", label: "X" }] });
    next.setValues({ x: "kept" });
    try {
      next.setValues({ unknown: "bad" });
    } catch {}
    if (next.getValues().x !== "kept")
      throw Error("invalid update mutated form");
    next.destroy();
    host.remove();
  });
  console.log(
    "PASS forms/preferences: validation, server errors, retry, abort/reset, dirty state, persistence, themes, mobile, destroy.",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS browser: contrast, filter reset/chip, sticky header, theme history, page URL, 10k rows, safe text, stale async responses, dark/mobile/125%.",
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
