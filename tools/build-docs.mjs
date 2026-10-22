import {readFile,writeFile,mkdir,readdir,cp} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const version=JSON.parse(await readFile(path.join(root,'package.json'),'utf8')).version;
const out=path.join(root,'docs-site',version);await mkdir(out,{recursive:true});
const docs=[];
for(const name of (await readdir(path.join(root,'docs'))).filter(n=>n.endsWith('.md')).sort()){
 const body=await readFile(path.join(root,'docs',name),'utf8');
 docs.push({id:name,title:body.split('\n').find(s=>s.startsWith('# '))?.slice(2)||name,lang:name.endsWith('.en.md')||name==='MIGRATION-0.15.md'?'en':'tr',body});
}
docs.push({id:'api',title:'API reference · TypeScript',body:'# Public API\n\n```ts\n'+await readFile(path.join(root,'types/index.d.ts'),'utf8')+'\n```'});
await writeFile(path.join(out,'search.json'),JSON.stringify(docs));
for(const dir of ['styles','assets','src','esm','schemas','locales','types','docs','tokens','design'])await cp(path.join(root,dir),path.join(out,dir),{recursive:true});
await cp(path.join(root,'examples/foundations'),path.join(out,'examples/foundations'),{recursive:true});
for(const folder of ['atelier','product','integration','planning'])await cp(path.join(root,'examples',folder),path.join(out,'examples',folder),{recursive:true});
await cp(path.join(root,'examples/system'),path.join(out,'examples/system'),{recursive:true});
for(const entry of await readdir(path.join(root,'examples'),{withFileTypes:true})) if(entry.isFile()) await cp(path.join(root,'examples',entry.name),path.join(out,'examples',entry.name));
for(const file of ['llms.txt','AGENTS.md','README.md','LICENSE','NOTICE']) await cp(path.join(root,file),path.join(out,file));
for(const file of ['index.html','studio.js','studio-example.js','studio-model.js','studio-en.html','studio-en.mjs','studio-en.css']) await cp(path.join(root,file),path.join(out,file==='index.html'?'studio.html':file));
await writeFile(path.join(out,'index.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Muhit ${version} · Documentation</title><link rel="stylesheet" href="styles/index.css"><link rel="stylesheet" href="styles/pages.css"><link rel="stylesheet" href="docs.css"></head><body class="mh-scope"><a class="mh-skip" href="#main">Skip to documentation</a><div class="mh-shell"><aside class="mh-shell__nav"><img src="assets/brand/muhit-logo.svg" alt="Muhit" width="140"><p>Version ${version}</p><label>Search documentation<input id="search" type="search" class="mh-input"></label><p id="count" role="status"></p><nav id="results" aria-label="Documentation"></nav></aside><div class="mh-shell__body"><main id="main" tabindex="-1" class="mh-content" data-width="reading"><h1>Muhit documentation</h1><p><a href="examples/planning/index.html">Planning lab</a> · <a href="examples/product/index.html">Product patterns</a> · <a href="examples/atelier/index.html">Atelier</a> · <a href="examples/system/index.html">Design system</a> · <a href="studio.html">Muhit Studio</a> · <a href="examples/foundations/principles.html" lang="tr">Muhit felsefesi · çalışan ilkeler</a> · <a href="examples/foundations/overview.html">Page recipes and states</a> · <a href="examples/foundations/icons.html">Icon gallery</a></p><article id="document"></article></main></div></div><script type="module" src="docs.mjs"></script></body></html>`);
await cp(path.join(root,'tools/docs-client.mjs'),path.join(out,'docs.mjs'));
await writeFile(path.join(out,'docs.css'),'.mh-scope {margin:0}.mh-scope pre {overflow:auto;padding:16px;background:var(--mh-surface);border:1px solid var(--mh-border);border-radius:var(--mh-radius-sm)}.mh-scope #document {overflow-wrap:anywhere}.mh-scope #document p {white-space:pre-wrap}.mh-scope #results {max-height:60vh;overflow:auto}.mh-scope #results a {font-size:14px}.mh-scope #search {width:100%}');
await writeFile(path.join(root,'docs-site/index.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><title>Muhit documentation</title><h1>Muhit documentation</h1><p><a href="${version}/">Open version ${version}</a></p></html>`);
console.log('Built versioned documentation:',out);
