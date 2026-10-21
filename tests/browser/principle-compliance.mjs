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
 const engine=process.env.MUHIT_BROWSER||'chromium';browser=await engines[engine].launch({headless:true});const p=await browser.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(url+'/examples/basic.html');
 const checks=await p.evaluate(async()=>{
  const {MuhitForm:F,MuhitFields:Fields,MuhitAgent:A}=await import('/src/index.mjs');
  const host=document.createElement('div');document.querySelector('main').append(host);const checks=[];
  const check=(v,name)=>{if(!v)throw Error(name);checks.push(name)};
  const tick=()=>new Promise(r=>setTimeout(r,0));
  let done,signal,mode='pending';
  const f=F.mount(host,{locale:'en',fields:[{name:'name',label:'Name',required:true}],values:{name:'Original'},onSubmit:async(v,s)=>{signal=s;if(mode==='pending')return new Promise(r=>done=r);if(mode==='demo')return {persisted:false};if(mode==='forbidden')throw {code:'forbidden'};throw Error('private message');}});
  f.setValues({name:'Draft'});const submit=()=>host.querySelector('form').requestSubmit();submit();await tick();
  check(host.querySelector('form').getAttribute('aria-busy')==='true','form busy');
  [...host.querySelectorAll('button')].find(b=>b.textContent==='Cancel operation').click();
  check(signal.aborted&&f.getValues().name==='Draft'&&f.isDirty(),'cancel preserves draft and aborts');done();await tick();check(host.textContent.includes('Draft preserved.')&&!host.textContent.includes('Saved.'),'late response ignored');
  mode='demo';submit();await tick();check(f.isDirty()&&host.textContent.includes('No data was saved'),'explicit unpersisted result');
  mode='forbidden';submit();await tick();check(host.textContent.includes('permission')&&!host.textContent.includes('connection'),'permission error');
  mode='other';submit();await tick();check(host.textContent.includes('could not complete')&&!host.textContent.includes('private message'),'neutral safe error');f.reset();check(f.getValues().name==='Original','reset separate from cancel');f.destroy();
  let finish;const groups=Fields.repeater(host,{locale:'en',fields:[{name:'name',label:'Name'}],values:[{name:'Group draft'}],onSubmit:()=>new Promise(r=>finish=r)});const pending=groups.submit();await tick();groups.cancelSubmit();check(groups.getValues()[0].name==='Group draft','repeater cancellation preserves values');finish();await pending;check(!host.textContent.includes('Saved.'),'repeater late response ignored');groups.destroy();
  let actions=[];const spec={schemaVersion:'1.1.0',page:{title:'First'},components:[{type:'form',id:'f',fields:[{name:'name',label:'Name'}],values:{name:'Original'}},{type:'datagrid',id:'g',title:'Records',selectable:true,columns:[{key:'name',label:'Name'}],rows:[{id:'one',name:'First'},{id:'two',name:'Second'}]},{type:'card',id:'c',title:'Card',action:{id:'review',label:'Review'}}]};
  const a=A.render(host,spec,{onAction:e=>{actions.push(e);if(e.id==='submit')return {persisted:false};}});
  let input=host.querySelector('input[name=name]');input.value='Agent draft';input.dispatchEvent(new Event('input',{bubbles:true}));let search=host.querySelector('input[type=search]');search.value='First';search.dispatchEvent(new Event('input',{bubbles:true}));await tick();
  a.update({...spec,page:{title:'Second'}});check(host.querySelector('input[name=name]')===input&&input.value==='Agent draft','unchanged child identity preserved');check(host.querySelector('input[type=search]').value==='First','agent grid context');host.querySelector('[data-action-id=review]').click();check(actions.some(e=>e.id==='review'),'adopted callback active');
  const changed=structuredClone(spec);changed.components[0].title='Renamed';a.update(changed);check(host.querySelector('input[name=name]').value==='Agent draft','compatible form snapshot preserved');
  const incompatible=structuredClone(changed);incompatible.components[0].fields=[{name:'other',label:'Other'}];delete incompatible.components[0].values;
  let blocked=false;try{a.update(incompatible)}catch{blocked=true}check(blocked&&host.querySelector('input[name=name]').value==='Agent draft','incompatible dirty update atomic');
  a.update(incompatible,{resetState:true});check(!!host.querySelector('input[name=other]'),'explicit reset accepted');a.destroy();host.remove();return checks;
 });
 await p.goto(url+'/index.html#agents');await p.locator('#agent-extended-example').click();
 const field=p.locator('#agent-output input[name=name]');await field.fill('Studio draft');
 await p.locator('[data-route=palette]').click();await p.locator('[data-route=agents]').click();assert.equal(await field.inputValue(),'Studio draft');
 await p.locator('#render-agent').click();assert.equal(await field.inputValue(),'Studio draft');
 await p.locator('#agent-output button[type=submit]').click();await p.getByText('İşlem tamamlandı. Veri kaydedilmedi; taslak korunuyor.',{exact:true}).waitFor();
 await p.locator('[data-route=components]').click();await p.locator('[data-component-tab=table]').click();
 const search=p.getByRole('searchbox',{name:'Kayıtlarda ara',exact:true});await search.fill('Araştırma');
 await p.locator('[data-component-tab=cards]').click();await p.locator('[data-component-tab=table]').click();assert.equal(await search.inputValue(),'Araştırma');
 await p.locator('[data-route=palette]').click();await p.locator('[data-route=components]').click();assert.equal(await search.inputValue(),'Araştırma');
 await p.goto(url+'/examples/foundations/principles.html#practice');await p.waitForFunction(()=>window.principlesReady);
 await p.locator('#record-research').focus();await p.keyboard.press('Enter');await p.keyboard.press('Tab');await p.keyboard.type('Keyboard draft');await p.keyboard.press('Tab');await p.keyboard.press('Space');await p.keyboard.press('Tab');await p.keyboard.press('Enter');await p.getByText('Örnek işlem başarısız oldu.',{exact:false}).waitFor();
 assert.equal(await p.locator('#draft').inputValue(),'Keyboard draft');assert.deepEqual(errors,[]);
 await writeFile(path.join(root,'tests/principle-compliance-verification-'+engine+'.json'),JSON.stringify({provenance:await provenance(),engine,checks,studioContext:true,keyboardRecovery:true},null,2));
 console.log('PASS principle compliance',engine,checks.length);
}finally{await browser?.close();await new Promise(r=>server.close(r));}
