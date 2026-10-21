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
  await p.emulateMedia({reducedMotion:"reduce"});
  const report=[];
  for(const name of ['icons','overview','collection','detail','settings','workspace','editorial']) {
    for(const width of [390,768,1440]) {
      await p.setViewportSize({width,height:1000});
      await p.goto(url+'/examples/foundations/'+name+'.html');
      await p.waitForFunction(()=>window.foundationReady===true);
      assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'overflow '+name+' '+width);
      assert.equal(await p.locator('h1').count(),1);
      await p.addScriptTag({path:path.join(root,'node_modules/axe-core/axe.min.js')});
      const violations=await p.evaluate(async()=> (await axe.run(document)).violations.map(x=>({id:x.id,targets:x.nodes.map(n=>n.target)})));
      assert.deepEqual(violations,[],'axe '+name+' '+width);
      if(name!=='icons') {
        await p.locator('#direction').click();
        assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'RTL overflow');
        await p.locator('#theme').click();
        const dark=await p.evaluate(async()=> (await axe.run(document)).violations.map(x=>({id:x.id,targets:x.nodes.map(n=>n.target)})));
        assert.deepEqual(dark,[],'dark RTL axe '+name+' '+width);
      }
      report.push({name,width,passed:true});
    }
  }
  await p.goto(url+'/examples/foundations/icons.html');await p.waitForFunction(()=>window.foundationReady);
  assert.equal(await p.locator('.icon-tile').count(),58);
  await p.locator('#mode').click();
  await p.addScriptTag({path:path.join(root,'node_modules/axe-core/axe.min.js')});
  assert.deepEqual(await p.evaluate(async()=> (await axe.run(document)).violations.map(x=>x.id)),[], 'dark icon catalog');
  await p.locator('#search').fill('doğa');assert.equal(await p.locator('.icon-tile').count(),1);
  await p.locator('#search').fill('');await p.locator('#size').selectOption('16');
  assert.equal(await p.locator('.icon-tile svg').first().getAttribute('width'),'16');
  const download=p.waitForEvent('download');await p.locator('#download').click();assert.equal((await download).suggestedFilename(),'muhit-leaf.svg');
  await p.goto(url+'/examples/foundations/overview.html');await p.waitForFunction(()=>window.foundationReady);
  // macOS WebKit uses Option+Tab to include links in keyboard navigation.
  await p.keyboard.press(engine === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');assert.equal(await p.locator(':focus').getAttribute('class'),'mh-skip');await p.keyboard.press('Enter');assert.equal(await p.locator(':focus').getAttribute('id'),'main');
  await p.goto(url+'/examples/foundations/collection.html');await p.waitForFunction(()=>window.foundationReady);await p.getByRole('searchbox').fill('Doğa');await p.waitForFunction(()=>document.querySelectorAll('tbody tr').length===1);
  await p.goto(url+'/examples/foundations/settings.html');await p.waitForFunction(()=>window.foundationReady);await p.getByLabel('Çalışma alanı adı *').fill('Yeni alan');await p.getByRole('button',{name:'Kaydet',exact:true}).click();await p.getByText('Tercihler yalnız bu örnekte onaylandı. Sunucuya gönderilmedi.').waitFor();
  assert.deepEqual(errors,[]);
  console.log('PASS 21 page/viewport combinations, light/dark RTL axe, skip link, icon search/download, grid search and form save');
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
