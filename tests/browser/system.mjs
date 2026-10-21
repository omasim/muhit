import { provenance } from "../../tools/provenance.mjs";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
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
  browser = await engines[engine].launch({ headless: true });
  const p = await browser.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  const scans = [];
  for (const name of ["index", "corporate", "admin", "data"])
    for (const width of [390, 1440]) {
      await p.setViewportSize({ width, height: 1000 });
      await p.goto(url + "/examples/system/" + name + ".html");
      await p.waitForFunction(() => window.systemReady);
      await p.evaluate(() => document.fonts.ready);
      for (const mode of ["light", "dark"]) {
        await p.locator("#appearance").selectOption(mode);
        if (mode === "dark")
          await p.evaluate(() => { document.body.dir = "rtl"; document.querySelector(".mh-system-page").dir = "rtl"; });
        await p.addScriptTag({
          path: path.join(root, "node_modules/axe-core/axe.min.js"),
        });
        const result = await p.evaluate(async () => ({
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          mains: document.querySelectorAll("main").length,
          h1: document.querySelectorAll("h1").length,
          axe: (await axe.run(document)).violations.map((v) => ({
            id: v.id,
            targets: v.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          })),
        }));
        scans.push({ name, width, mode, ...result });
        assert.deepEqual(
          result,
          { overflow: false, mains: 1, h1: 1, axe: [] },
          JSON.stringify({ name, width, mode, result }),
        );
      }
    }
  await p.goto(url + "/examples/system/index.html");
  await p.waitForFunction(() => window.systemReady);
  await p.locator("#menu-trigger").focus();
  await p.keyboard.press("ArrowDown");
  assert.equal(await p.getByRole("menu").isVisible(), true);
  await p.keyboard.press("End");
  assert.equal(
    await p.evaluate(() => document.activeElement.textContent),
    "Koyu görünüm",
  );
  await p.keyboard.press("Escape");
  assert.equal(
    await p
      .locator("#menu-trigger")
      .evaluate((n) => n === document.activeElement),
    true,
  );
  await p.locator("#tooltip-trigger").focus();
  await p.getByRole("tooltip").waitFor();
  await p.keyboard.press("Escape");
  assert.equal(await p.getByRole("tooltip").isVisible(), false);
  const tree = p.getByRole("tree");
  await tree.getByRole("treeitem", { name: "Temeller", exact: true }).focus();
  await p.keyboard.press("ArrowRight");
  await p.keyboard.press("ArrowRight");
  assert.equal(
    await p.evaluate(() => document.activeElement.dataset.treeId),
    "tokens",
  );
  await p.keyboard.press("Space");
  assert.equal(
    await tree
      .getByRole("treeitem", { name: "Tokenlar", exact: true })
      .getAttribute("aria-selected"),
    "true",
  );
  await p.locator("#flow-draft").fill("Preserve me");
  await p.locator("#flow-submit").click();
  await p.locator("#flow-cancel").click();
  await p.waitForTimeout(500);
  assert.equal(await p.locator("#flow-draft").inputValue(), "Preserve me");
  await p
    .getByText("İptal edildi. Taslak korunuyor.", { exact: true })
    .waitFor();
  await p.locator("#flow-mode").selectOption("partial");
  await p.locator("#flow-submit").click();
  await p
    .getByText(
      "Kısmi sonuç. Taslak korunuyor; başarısız kayıtları yeniden deneyin.",
      { exact: true },
    )
    .waitFor();
  await p.locator("#page-state").selectOption("error");
  await p.getByRole("button", { name: "Yeniden dene", exact: true }).click();
  assert.equal(await p.locator("#flow-draft").inputValue(), "Preserve me");
  await p.locator("#wizard-name").fill("Korunan çalışma");
  await p.getByRole("button", { name: "İncelemeye geç", exact: true }).click();
  await p
    .getByRole("button", { name: "Önceki adıma dön", exact: true })
    .click();
  assert.equal(await p.locator("#wizard-name").inputValue(), "Korunan çalışma");
  await p.getByRole("button", { name: "İncelemeye geç", exact: true }).click();
  await p.locator("#wizard-submit").click();
  await p
    .getByText("Hazırlık tamamlandı. Veri kaydedilmedi; taslak korunuyor.", {
      exact: true,
    })
    .waitFor();
  await p.locator("#apply-proposal").click();
  await p
    .getByText("Onay veya yetki sağlanmadı; işlem uygulanmadı.", {
      exact: true,
    })
    .waitFor();
  await p.locator("#approve").check();
  await p.locator("#apply-proposal").click();
  await p
    .getByText("Örnek işlem tamamlandı. Veri kaydedilmedi.", { exact: true })
    .waitFor();
  await p.locator("#agent-preview input[name=note]").fill("AI draft");
  await p
    .getByRole("button", { name: "Doğrula ve önizle", exact: true })
    .click();
  assert.equal(
    await p.locator("#agent-preview input[name=note]").inputValue(),
    "AI draft",
  );
  await p.locator("#proposal").fill("{}");
  assert.equal(await p.locator("#apply-proposal").isDisabled(), true);
  await p
    .getByRole("button", { name: "Doğrula ve önizle", exact: true })
    .click();
  assert.equal(
    await p.locator("#agent-preview input[name=note]").inputValue(),
    "AI draft",
  );
  await p.goto(url + "/examples/system/admin.html");
  await p.waitForFunction(() => window.systemReady);
  await p.locator("textarea[name=note]").fill("Record draft");
  await p.locator("[data-record=design]").click();
  await p.locator("[data-record=research]").click();
  assert.equal(
    await p.locator("textarea[name=note]").inputValue(),
    "Record draft",
  );
  await p.locator("button[type=submit]").click();
  await p
    .getByText("Yalnız bu sekmenin örnek kayıt belleği güncellendi.", {
      exact: true,
    })
    .waitFor();
  await p
    .getByRole("checkbox", { name: "Araştırma planı", exact: true })
    .check();
  await p
    .getByRole("checkbox", { name: "Tasarım raporu", exact: true })
    .check();
  await p.locator("#bulk-run").click();
  await p.locator("#bulk-cancel").click();
  await p
    .getByText("İptal edildi. Seçim korundu; yeni değişiklik uygulanmadı.", {
      exact: true,
    })
    .waitFor();
  assert.equal(
    await p
      .getByRole("checkbox", { name: "Araştırma planı", exact: true })
      .isChecked(),
    true,
  );
  await p.locator("#bulk-run").click();
  await p
    .getByText("1 kayıt örnek bellekte işlendi; 1 kayıt başarısız.", {
      exact: true,
    })
    .waitFor();
  assert.equal(
    await p
      .getByRole("checkbox", { name: "Araştırma planı", exact: true })
      .isDisabled(),
    true,
  );
  await p.locator("#bulk-run").click();
  await p
    .getByText("1 kayıt örnek bellekte işlendi; 0 kayıt başarısız.", {
      exact: true,
    })
    .waitFor();
  await p.goto(url + "/examples/system/data.html");
  await p.waitForFunction(() => window.systemReady);
  const search = p.getByRole("searchbox", {
    name: "Kayıtlarda ara",
    exact: true,
  });
  await search.fill("Araştırma");
  await p.getByRole("button", { name: "Hata durumunu dene" }).click();
  await p.getByRole("button", { name: "Yeniden dene", exact: true }).click();
  assert.equal(await search.inputValue(), "Araştırma");
  await search.fill("");
  await p
    .locator("#import-file")
    .setInputFiles({
      name: "records.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify([{ name: "Imported", count: 7 }])),
    });
  await p
    .getByText(
      "1 kayıt doğrulandı. Önizleme hazır; kayıt veya yükleme yapılmadı.",
      { exact: true },
    )
    .waitFor();
  await p.locator("#apply-import").click();
  assert.equal(await p.getByText("Imported", { exact: true }).count(), 2);
  await p
    .locator("#import-file")
    .setInputFiles({
      name: "invalid.json",
      mimeType: "application/json",
      buffer: Buffer.from("{}"),
    });
  await p.getByText("Dosya reddedildi:", { exact: false }).waitFor();
  assert.equal(await p.locator("#apply-import").isDisabled(), true);
  await p.goto(url + "/examples/system/corporate.html");
  await p.waitForFunction(() => window.systemReady);
  await p.getByLabel("Adınız *").fill("Ada");
  await p.getByLabel("E-posta *").fill("ada@example.com");
  await p.getByLabel("Görüşme konusu *").fill("Research");
  const download = p.waitForEvent("download");
  await p.getByRole("button", { name: "Notu indir", exact: true }).click();
  assert.equal((await download).suggestedFilename(), "gorusme-notu.json");
  await p
    .getByText("İşlem tamamlandı. Veri kaydedilmedi; taslak korunuyor.", {
      exact: true,
    })
    .waitFor();
  assert.deepEqual(errors, []);
  await mkdir(path.join(root, "tests/previews"), { recursive: true });
  await p.screenshot({
    path: path.join(root, "tests/previews/system-" + engine + ".png"),
    fullPage: true,
  });
  await writeFile(
    path.join(root, "tests/system-verification-" + engine + ".json"),
    JSON.stringify(
      {
        provenance: await provenance(),
        engine,
        scans,
        menuKeyboard: true,
        treeKeyboard: true,
        tooltipEscape: true,
        draftCancellation: true,
        approvalBoundary: true,
        recordContext: true,
        importPreview: true,
        downloadTruth: true,
        bulkPartialRetry: true,
        wizardDraft: true,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS system:",
    engine,
    scans.length,
    "responsive/axe scans and product workflows",
  );
} finally {
  await browser?.close();
  await new Promise((r) => server.close(r));
}
