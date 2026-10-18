import {provenance} from '../../tools/provenance.mjs';
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
  const reports=[];
  await mkdir(path.join(root,"tests/previews"),{recursive:true});
  for(const recipe of ['overview','collection','detail','settings','workspace','editorial']){
    for(const state of ['loading','empty','error','unauthorized']){
      for(const width of [390,1440]){
        await p.setViewportSize({width,height:950});
        await p.goto(url+'/examples/foundations/'+recipe+'.html?state='+state);
        await p.waitForFunction(()=>window.foundationReady);
        if(width===390){await p.locator('#theme').click();await p.locator('#direction').click();}
        await p.evaluate(async()=>{await document.fonts.ready;await Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{})));});
        assert.equal(await p.locator('main').count(),1);assert.equal(await p.locator('h1').count(),1);
        assert.equal(await p.locator('[data-page-state]').getAttribute('data-page-state'),state);
        assert.equal(await p.locator('#regions').getAttribute('aria-busy'),String(state==='loading'));
        assert.equal(await p.locator('#regions table,#regions form,.mh-kanban').count(),0,'non-ready states must not expose data');
        assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
        await p.addScriptTag({path:path.join(root,'node_modules/axe-core/axe.min.js')});
        assert.deepEqual(await p.evaluate(async()=>(await axe.run(document)).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))),[],recipe+' '+state+' '+width);
        if(recipe==='overview' && engine==='chromium')await p.screenshot({path:path.join(root,'tests/previews/p3-'+state+'-'+width+'.png'),fullPage:true});
        const action=p.locator('[data-page-state] button');await action.focus();await p.keyboard.press('Enter');
        if(state==='unauthorized'){await p.getByText('Örnek ekran: erişim verilmedi.',{exact:false}).waitFor();assert.equal(await p.locator('[data-page-state]').count(),1);}
        else {await p.waitForURL(/state=ready/);await p.waitForFunction(()=>window.foundationReady);assert.equal(await p.locator('[data-page-state]').count(),0);}
        reports.push({recipe,state,width,passed:true});
      }
    }
  }
  const pkg=JSON.parse(await readFile(path.join(root,'package.json'),'utf8'));
  await p.goto(url+'/docs-site/'+pkg.version+'/index.html');await p.waitForFunction(()=>window.docsReady);
  await p.addScriptTag({path:path.join(root,'node_modules/axe-core/axe.min.js')});
  assert.deepEqual(await p.evaluate(async()=>(await axe.run(document)).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))),[],'documentation axe');
  if(engine==='chromium')await p.screenshot({path:path.join(root,'tests/previews/p3-docs.png'),fullPage:true});
  await p.getByRole('searchbox').fill('headingLevel');assert.ok(await p.locator('#results a').count()>0);
  await p.locator('#results a').first().click();assert.equal(await p.evaluate(()=>document.activeElement.id),'main');
  await p.getByRole('searchbox').fill('<img src=x onerror=alert(1)>');assert.equal(await p.locator('#results a').count(),0);assert.equal(await p.locator('#results img').count(),0);
  await p.getByRole('searchbox').fill('single-icon');await p.getByRole('link',{name:'Icons · English integration guide'}).click();
  await p.goBack();assert.ok(await p.locator('#document').textContent());
  for(const width of [390,1440]){
    await p.setViewportSize({width,height:950});
    await p.goto(url+'/examples/foundations/principles.html');await p.waitForFunction(()=>window.principlesReady);
    if(width===390)await p.locator('#theme').click();
    await p.evaluate(async()=>{await document.fonts.ready;await Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{})));});
    assert.equal(await p.locator('main').count(),1);assert.equal(await p.locator('h1').count(),1);
    assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await p.addScriptTag({path:path.join(root,'node_modules/axe-core/axe.min.js')});
    assert.deepEqual(await p.evaluate(async()=>(await axe.run(document)).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.failureSummary)}))),[],'principles page');
    await p.locator('#filter').fill('Araştırma');await p.locator('#record-research').focus();await p.keyboard.press('Enter');
    assert.equal(await p.evaluate(()=>document.activeElement.id),'detail-title');
    await p.locator('#draft').fill('<img src=x onerror=alert(1)> Benim notum');
    await p.locator('#back').click();assert.equal(await p.locator('#filter').inputValue(),'Araştırma');
    assert.equal(await p.evaluate(()=>document.activeElement.id),'record-research');
    await p.locator('#record-research').click();assert.ok((await p.locator('#draft').inputValue()).includes('Benim notum'));
    await p.locator('#failure').check();await p.locator('#confirm').click();
    await p.getByText('Örnek işlem başarısız oldu.',{exact:false}).waitFor();
    assert.equal(await p.locator('#editor').getAttribute('aria-busy'),'false');
    assert.ok((await p.locator('#draft').inputValue()).includes('Benim notum'));
    await p.locator('#failure').uncheck();await p.locator('#confirm').click();await p.locator('#cancel').click();
    await p.waitForTimeout(800);assert.match(await p.locator('#result').textContent(),/iptal edildi/);
    await p.locator('#confirm').click();await p.getByText('Yalnız bu sekmenin belleğinde onaylandı.',{exact:false}).waitFor();
    assert.equal(await p.locator('#detail-view img').count(),0);
    if(engine==='chromium')await p.screenshot({path:path.join(root,'tests/previews/p3-principles-'+width+'.png'),fullPage:true});
    await p.reload();await p.waitForFunction(()=>window.principlesReady);await p.locator('#record-research').click();assert.equal(await p.locator('#draft').inputValue(),'');
  }
  assert.deepEqual(errors,[]);
  await writeFile(path.join(root,'tests/p3-verification-'+engine+'.json'),JSON.stringify({provenance:await provenance(),engine,cases:reports,docsSearch:true,principlesFlow:true},null,2));
  console.log('PASS P3: 48 page states and searchable versioned documentation');
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
