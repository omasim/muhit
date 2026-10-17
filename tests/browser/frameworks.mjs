import assert from "node:assert/strict";
import {
  mkdtemp,
  cp,
  readFile,
  writeFile,
  mkdir,
  rm,
  realpath,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawn } from "node:child_process";
const root = path.resolve(fileURLToPath(new URL("../../", import.meta.url)));
const { chromium } = await import(
  process.env.MUHIT_PLAYWRIGHT_MODULE || "playwright"
);
const work = await realpath(
  await mkdtemp(path.join(tmpdir(), "muhit-frameworks-")),
);
const report = {
  date: new Date().toISOString(),
  packageVersion: JSON.parse(
    await readFile(path.join(root, "package.json"), "utf8"),
  ).version,
  results: [],
};
function run(args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn("npm", args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    });
    let output = "";
    child.stdout.on("data", (d) => {
      output += d;
      process.stdout.write(d);
    });
    child.stderr.on("data", (d) => {
      output += d;
      process.stderr.write(d);
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolve(output)
        : reject(Error(`npm ${args.join(" ")} failed (${code})`)),
    );
  });
}
let browser;
try {
  await run(["pack", "--pack-destination", work, "--ignore-scripts"], root);
  const tar = path.join(work, `muhit-ui-${report.packageVersion}.tgz`);
  browser = await chromium.launch({
    headless: true,
    ...(process.env.MUHIT_CHROME
      ? { executablePath: process.env.MUHIT_CHROME }
      : {}),
  });
  for (const framework of ["react", "vue"]) {
    const app = path.join(work, framework);
    await cp(path.join(root, "examples", framework), app, {
      recursive: true,
      filter: (src) =>
        !["node_modules", "dist"].some((x) =>
          path
            .relative(path.join(root, "examples", framework), src)
            .split(path.sep)
            .includes(x),
        ),
    });
    await run(
      [
        "install",
        tar,
        "--save-exact",
        "--no-audit",
        "--no-fund",
        ...(process.env.MUHIT_OFFLINE ? ["--offline"] : []),
      ],
      app,
    );
    const installed = JSON.parse(
      await readFile(
        path.join(app, "node_modules/muhit-ui/package.json"),
        "utf8",
      ),
    );
    assert.equal(installed.version, report.packageVersion);
    await run(["run", "build"], app);
    const vite = await import(
      pathToFileURL(path.join(app, "node_modules/vite/dist/node/index.js")).href
    );
    await writeFile(
      path.join(app, "ssr-entry.ts"),
      framework === "react"
        ? "import React from 'react';import {renderToString} from 'react-dom/server';import App from './src/App';export const render=()=>renderToString(React.createElement(App));"
        : "import {createSSRApp} from 'vue';import {renderToString} from 'vue/server-renderer';import App from './src/App.vue';export const render=()=>renderToString(createSSRApp(App));",
    );
    for (const mode of ["development", "production", "ssr"]) {
      const server =
        mode !== "production"
          ? await vite.createServer({
              root: app,
              plugins:
                mode === "ssr"
                  ? [
                      {
                        name: "muhit-ssr-test",
                        configureServer(server) {
                          server.middlewares.use(
                            "/ssr",
                            async (req, res, next) => {
                              try {
                                const entry =
                                  await server.ssrLoadModule("/ssr-entry.ts");
                                const html = await entry.render();
                                const template = await readFile(
                                  path.join(app, "index.html"),
                                  "utf8",
                                );
                                const output = await server.transformIndexHtml(
                                  "/",
                                  template.replace(
                                    '<div id="root"></div>',
                                    '<div id="root">' + html + "</div>",
                                  ),
                                );
                                res.setHeader("Content-Type", "text/html");
                                res.end(output);
                              } catch (e) {
                                next(e);
                              }
                            },
                          );
                        },
                      },
                    ]
                  : [],
              server: { host: "127.0.0.1", port: 0, strictPort: false },
            })
          : await vite.preview({
              root: app,
              preview: { host: "127.0.0.1", port: 0, strictPort: false },
            });
      if (mode !== "production") await server.listen();
      const url = server.resolvedUrls.local[0];
      const page = await browser.newPage({
        viewport: { width: 1440, height: 1000 },
      });
      page.setDefaultTimeout(10000);
      const errors = [];
      page.on("pageerror", (e) => {
        errors.push(e.message);
        console.error(framework, mode, "PAGE", e.stack);
      });
      page.on("console", (m) => {
        if (m.type() === "error") {
          errors.push(m.text());
          console.error(framework, mode, "CONSOLE", m.text());
        }
      });
      try {
        await page.goto(mode === "ssr" ? url + "ssr" : url);
        await page.locator(".mh-data-grid tbody tr").first().waitFor();
        assert.equal(await page.locator(".mh-data-grid").count(), 1);
        assert.equal(await page.locator("tbody tr").count(), 2);
        await page.getByRole("button", { name: "Veriyi güncelle" }).click();
        await page.waitForFunction(() =>
          document.querySelector("tbody")?.textContent.includes("24"),
        );
        await page.getByRole("button", { name: "Metin kaydı ekle" }).click();
        await page.waitForFunction(
          () => document.querySelectorAll("tbody tr").length === 3,
        );
        assert.equal(await page.locator("tbody img").count(), 0);
        assert.ok(
          (await page.locator("tbody").innerText()).includes(
            "<img src=x onerror=alert(1)>",
          ),
        );
        await page.getByRole("button", { name: "Sütunları değiştir" }).click();
        await page.getByRole("columnheader", { name: "Tarih" }).waitFor();
        assert.equal(await page.locator(".mh-data-grid").count(), 1);
        await page.getByRole("button", { name: "Adet", exact: true }).click();
        assert.ok(
          (await page.locator("tbody tr").first().innerText()).includes(
            "Görüşme",
          ),
        );
        await page
          .getByRole("searchbox", { name: "Kayıtlarda ara" })
          .fill("araştırma");
        await page.waitForFunction(
          () => document.querySelectorAll("tbody tr").length === 1,
        );
        await page.getByRole("searchbox").fill("bekleyen");
        await page.getByRole("button", { name: "Tabloyu kaldır" }).click();
        await page.waitForTimeout(250);
        assert.equal(await page.locator("table").count(), 0);
        for (let i = 0; i < 5; i++) {
          await page.getByRole("button", { name: "Tabloyu aç" }).click();
          await page.locator("table").waitFor();
          assert.equal(await page.locator("table").count(), 1);
          await page.getByRole("button", { name: "Tabloyu kaldır" }).click();
        }
        await page.getByRole("button", { name: "Tabloyu aç" }).click();
        await page.waitForFunction(
          () => document.querySelectorAll("tbody tr").length === 3,
        );
        await page.getByRole("button", { name: "Temayı değiştir" }).click();
        assert.equal(
          await page.locator("html").getAttribute("data-mh-mode"),
          "dark",
        );
        await page.evaluate(() =>
          document.documentElement.style.setProperty("--mh-text-scale", "1.25"),
        );
        await page.setViewportSize({ width: 390, height: 844 });
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        );
        await page.getByRole("button", { name: "Temayı değiştir" }).focus();
        await page.keyboard.press("Enter");
        assert.equal(
          await page.locator("html").getAttribute("data-mh-mode"),
          "light",
        );
        const font = await page.evaluate(async () => {
          await document.fonts.ready;
          return document.fonts.check("14px Manrope");
        });
        assert.ok(font);
        await page.getByLabel("Adınız *").fill("Unsaved draft");
        await page.getByRole("button",{name:"Form dilini değiştir"}).click();
        assert.equal(await page.getByLabel("Adınız *").inputValue(),"Unsaved draft");
        await page.getByRole("button",{name:"Değişiklik durumunu kontrol et"}).click();
        assert.equal(await page.getByTestId("dirty").textContent(),"true");
        await page.getByRole("button",{name:"Reset",exact:true}).click();
        assert.equal(await page.getByLabel("Adınız *").inputValue(),"Ada");
        await page.getByRole("button",{name:"Form dilini değiştir"}).click();
        await page.getByRole("button", { name: "Profili güncelle" }).click();
        assert.equal(await page.getByLabel("Adınız *").inputValue(), "Deniz");
        await page.getByRole("button", { name: "Kaydet", exact: true }).click();
        await page.getByText("Örnek kayıt: Deniz", { exact: true }).waitFor();
        await page.getByRole("button", { name: "Formu kaldır" }).click();
        assert.equal(await page.locator(".mh-form").count(), 0);
        await page.getByRole("button", { name: "Formu aç" }).click();
        assert.equal(await page.locator(".mh-form").count(), 1);
        await page.getByRole("tab", { name: "Ayrıntı" }).click();
        await page.getByText("İnsan ve doğa uyumu.", { exact: true }).waitFor();
        assert.deepEqual(errors, []);
        report.results.push({
          framework,
          mode,
          build: "passed",
          strictMode: framework === "react" && mode !== "production",
          passed: true,
          checks: [
            "data update",
            "column replacement",
            "sorting",
            "search",
            "literal HTML text",
            "pending timer cleanup",
            "5 remount cycles",
            "theme",
            "390px/125%",
            "keyboard",
            "fonts",
            "form controlled update/save/remount",
            "widget tabs",
            "no console/runtime errors",
          ],
        });
      } finally {
        await page.close();
        await server.close?.();
        if (mode === "production")
          await new Promise((resolve) => server.httpServer.close(resolve));
      }
    }
  }
  await writeFile(
    path.join(root, "tests/framework-verification.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(
    "PASS React and Vue: typecheck/build + development/production/SSR hydration browser flows against installed TGZ.",
  );
} finally {
  await browser?.close();
  if (process.env.MUHIT_KEEP_FIXTURES) console.log("Fixtures:", work);
  else await rm(work, { recursive: true, force: true });
}
