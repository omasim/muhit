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
    if(req.url==='/__consumer'){
      res.setHeader('Content-Type','text/html');
      res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; require-trusted-types-for 'script'; trusted-types 'none'");
      res.end('<!doctype html><html lang="en"><head><title>Consumer</title><link rel="stylesheet" href="/styles/index.css"></head><body><main><h1>Consumer</h1><button id="outside">Return</button><div id="host"></div></main></body></html>');return;
    }
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
  await p.goto(url + '/__consumer');
  const result=await p.evaluate(async()=>{
    const {MuhitWidgets:W,MuhitIcons:I,MuhitDataGrid:G,MuhitForm:F}=await import('/src/index.mjs');
    const check=(v,m)=>{if(!v)throw Error(m)};
    const host=document.querySelector('#host');
    const outside=document.querySelector('#outside');
    const original=getComputedStyle(outside).fontSize;
    const icon=I.mount(host,'arrow-forward',{label:'A < B & "C"',dir:'rtl'});
    check(icon.element.getAttribute('aria-label')==='A < B & "C"','exact accessible label');icon.destroy();
    for(const name of I.names){const i=I.mount(host,name);check(i.element.querySelector('path,rect,circle'),'icon geometry '+name);i.destroy();}
    const w=W.mount(host,{type:'pagination',id:'pages',title:'Pages',total:50,pageSize:10},{headingLevel:2});
    check(host.querySelectorAll('svg').length===2,'CSP widget icons');w.destroy();
    const grid=G.mount(host,{columns:[{key:'name',label:'Name'}],rows:[{id:'a',name:'Ada'}]});
    check(host.querySelector('svg'),'CSP grid icon');grid.destroy();
    const f=F.mount(host,{fields:[{name:'name',label:'Name'}]});f.destroy();
    check(getComputedStyle(outside).fontSize===original,'host styles preserved');
    check(host.childElementCount===0,'route unmount cleanup');
    outside.focus();check(document.activeElement===outside,'application focus restoration');
    return {trustedTypes:!!window.trustedTypes,hostStyles:true,routeCleanup:true};
  });
  assert.deepEqual(errors, []);
  console.log('PASS consumer environment',result);
} finally {
  await browser?.close();
  await new Promise(resolve=>server.close(resolve));
}
