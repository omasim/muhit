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
  const routes=['/index.html#palette','/index.html#customize','/index.html#agents','/index.html#start',...['cards','pages','table','charts','forms','feedback','navigation','workflow','overlays','selection'].map(n=>'/index.html?component='+n+'#components'),'/studio-en.html',...['basic','pages','advanced','settings','workspace','workflow','scale','international','visual-catalog'].map(n=>'/examples/'+n+'.html')];
  for(const route of routes){
    for(const width of [390,768,1440]){
      await p.setViewportSize({width,height:1000});await p.goto(url+route);await p.waitForTimeout(180);
      await p.evaluate(()=>document.fonts.ready);
      const structure=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,mains:document.querySelectorAll('main').length,headings:document.querySelectorAll('h1').length,skip:!!document.querySelector('a[href="#main"],a[href="#example"]'),oldIcons:[...document.querySelectorAll('svg.mh-icon')].filter(n=>!n.dataset.icon).length}));
      await p.addScriptTag({path:path.join(root,'node_modules/axe-core/axe.min.js')});
      const axe=await p.evaluate(async()=> (await window.axe.run(document)).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
      report.push({route,width,...structure,axe});
      if(width===390){
        await p.evaluate(async()=>{const {MuhitTheme}=await import('/src/index.mjs');MuhitTheme.apply({mode:'dark',scale:1.25});document.documentElement.dir='rtl'});
        const dark=await p.evaluate(async()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,axe:(await window.axe.run(document)).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))}));
        report.push({route,width,mode:'dark-rtl-125%',...structure,...dark});
      }
    }
  }
  console.log(JSON.stringify({report,errors},null,2));
  assert.deepEqual(errors,[]);
  assert.ok(report.every(r=>!r.overflow&&r.mains===1&&r.headings===1&&r.skip&&r.oldIcons===0&&r.axe.length===0),'Migration scan failed; see report');
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
