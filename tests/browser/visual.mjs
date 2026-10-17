import assert from "node:assert/strict";
import { PNG } from "pngjs";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
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
  const folder = path.join(
    root,
    "tests/visual",
    process.platform + "-" + engine,
  );
  await mkdir(folder, { recursive: true });
  const report = [];
  const missing = [];
  await p.emulateMedia({ reducedMotion: "reduce" });
  for (const name of [
    "light",
    "dark",
    "compact",
    "large-rtl",
    "custom",
    "loading",
    "empty",
    "error",
    "groups", "combo", "kanban", "german", "arabic", "zoom",
  ]) {
    await p.setViewportSize({
      width: name === "large-rtl" ? 390 : 1100,
      height: 900,
    });
    await p.goto(url + "/examples/visual-catalog.html?case=" + name);
    await p.waitForFunction(() => window.catalogReady === true);
    if (name === "kanban") {
      const handle=p.locator('.mh-kanban-handle');
      await handle.focus(); await p.keyboard.press('Space'); await p.keyboard.press('ArrowRight');
    }
    await p.evaluate(() => document.activeElement?.blur());
    await p.waitForTimeout(100);
    assert.ok(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      "overflow " + name,
    );
    const file = path.join(folder, name + ".png"),
      actual = await p.screenshot({ fullPage: true, animations: "disabled" });
    if (process.env.MUHIT_UPDATE_VISUAL === "1") await writeFile(file, actual);
    else {
      let expected;
      try { expected = await readFile(file); }
      catch(error) {
        if (error.code !== 'ENOENT') throw error;
        await writeFile(path.join(folder,name+'.candidate.png'),actual);
        missing.push(name); continue;
      }
      const a = PNG.sync.read(actual),
        b = PNG.sync.read(expected);
      let changed = 0;
      if (a.width !== b.width || a.height !== b.height) changed = Infinity;
      else
        for (let i = 0; i < a.data.length; i += 4)
          if (
            Math.max(
              ...[0, 1, 2].map((c) => Math.abs(a.data[i + c] - b.data[i + c])),
            ) > 16
          )
            changed++;
      if (changed / (a.width * a.height) > 0.0001) {
        await writeFile(path.join(folder, name + ".actual.png"), actual);
        missing.push("mismatch: " + name);
      }
    }
    report.push({
      name,
      sha256: createHash("sha256").update(actual).digest("hex"),
    });
  }
  await writeFile(
    path.join(root, "tests/visual-verification.json"),
    JSON.stringify(
      {
        platform: process.platform,
        engine,
        browser: browser.version(),
        updated: process.env.MUHIT_UPDATE_VISUAL === "1",
        cases: report,
      },
      null,
      2,
    ),
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(missing, [], "Review candidate images and explicitly add missing baselines");
  console.log("PASS visual baselines: " + report.length + " states");
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
