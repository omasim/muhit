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
  await p.goto(url + "/examples/advanced.html");
  await p.addScriptTag({path:path.join(root,"node_modules/axe-core/axe.min.js")});
  const result = await p.evaluate(async () => {
    const {MuhitDataGrid:G,MuhitForm:F,MuhitFields:Fields,MuhitWidgets:W}=await import('/src/index.mjs');
    const host=document.createElement('div');document.body.append(host);
    const check=(x,m)=>{if(!x)throw Error(m)};
    const labels=['A → B','10 × 20','✓','مرحبا ← عالم'];
    for (const locale of ['tr','en','de','ar']) {
      const tabs={type:'tabs',id:'labels',title:'Labels',items:labels.map((label,i)=>({id:'x'+i,label,content:'Content'}))};
      const widget=W.mount(host,tabs,{locale,headingLevel:2});
      check(JSON.stringify([...host.querySelectorAll('[role=tab]')].map(n=>n.textContent))===JSON.stringify(labels),'literal user labels '+locale);
      check(host.querySelector('h2')?.textContent==='Labels','heading level');
      const before=host.firstChild;let rejected=false;
      try { W.mount(host,tabs,{headingLevel:5}); } catch { rejected=true; }
      check(rejected && host.firstChild===before,'invalid heading atomic');widget.destroy();
    }
    const timeline=W.mount(host,{type:'timeline',id:'headings',title:'Timeline',items:[{id:'one',title:'Step',description:'Details',state:'complete'}]},{headingLevel:2});
    check(host.querySelector('h3')?.textContent==='Step','relative child heading');timeline.destroy();
    let mode='ok', release;
    const grid=G.mount(host,{selectable:true,columns:[{key:'name',label:'Name'}],load:async()=>{
      if(mode==='error')throw Error('offline');
      if(mode==='wait')await new Promise(r=>release=r);
      return {rows:[{id:'one',name:mode}],total:1};
    }});
    await grid.refresh();check(grid.toCSV().includes('ok'),'initial export');
    mode='wait';const pending=grid.refresh();
    let blocked=false;try{grid.toCSV()}catch{blocked=true}check(blocked,'pending export blocked');
    check(host.querySelector('thead input').disabled,'pending selection disabled');
    release();await pending;
    mode='error';await grid.refresh();blocked=false;try{grid.toCSV()}catch{blocked=true}
    check(blocked,'error export blocked');mode='retry';await grid.refresh();check(grid.toCSV().includes('retry'),'retry export');grid.destroy();
    const resolvers=[];const racing=G.mount(host,{columns:[{key:'name',label:'Name'}],load:()=>new Promise(r=>resolvers.push(r))});
    const latest=racing.refresh();resolvers[1]({rows:[{id:'new',name:'new'}],total:1});await latest;
    resolvers[0]({rows:[{id:'old',name:'old'}],total:1});await new Promise(r=>setTimeout(r,0));check(racing.toCSV().includes('new')&&!racing.toCSV().includes('old'),'late response ignored');racing.destroy();
    const fields=[{name:'name',label:'Name',required:true}];
    let form=F.mount(host,{fields,values:{name:'Original'}});
    form.setValues({name:'Edited'});check(form.isDirty(),'dirty before');
    const snap=form.getSnapshot();form.destroy();form=F.mount(host,{fields,...snap,locale:'en'});
    check(form.isDirty()&&form.getValues().name==='Edited','dirty after remount');form.reset();check(form.getValues().name==='Original'&&!form.isDirty(),'baseline reset');form.destroy();
    const repeater=Fields.repeater(host,{fields,groupLabel:'Contact',values:[{name:'A'},{name:'B'}]});
    const titles=()=>[...host.querySelectorAll('form h2')].map(x=>x.textContent);
    check(new Set(titles()).size===2,'distinct titles');
    const axe=await window.axe.run(host);check(axe.violations.length===0,JSON.stringify(axe.violations));
    host.querySelector('[aria-label="Grubu kaldır 1"]').click();check(titles()[0]==='Contact 1','renumber');
    repeater.destroy();
    let saves=0;
    const groups=Fields.repeater(host,{fields,values:[{name:'A'},{name:'B'}],validateAsync:async()=>[{}, {name:'Duplicate'}],onSubmit:async()=>{saves++}});
    await groups.submit();check(saves===0,'async group error prevents save');check(host.querySelectorAll('[aria-invalid=true]').length===1,'group specific error');groups.destroy();
    const server=Fields.repeater(host,{fields,values:[{name:'A'},{name:'B'}],onSubmit:async()=>({errors:[{name:'Server rejected'}]})});
    await server.submit();check(host.querySelectorAll('[aria-invalid=true]').length===1,'server group error');server.destroy();
    const native=document.createElement('form');host.append(native);
    const combo=Fields.combobox(native,{name:'owner',required:true,load:async()=>[{id:'ada',label:'Ada'}]});
    check(!native.checkValidity(),'required unselected');combo.setValue({id:'ada',label:'Ada'});
    check(native.checkValidity()&&new FormData(native).get('owner')==='ada','native form value');
    combo.setDisabled(true);check(!new FormData(native).has('owner'),'disabled omitted');combo.setDisabled(false);combo.setReadOnly(true);
    check(native.querySelector('[role=combobox]').readOnly,'readonly');combo.destroy();
    host.remove();return {csv:true,snapshot:true,repeaterAxe:true};
  });
  assert.deepEqual(errors, []);
  console.log('PASS production regressions',result);
} finally {
  await browser?.close();
  await new Promise(resolve=>server.close(resolve));
}
