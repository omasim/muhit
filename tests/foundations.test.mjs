import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {MuhitIcons as I} from '../src/index.mjs';
test('icon catalog has 58 safe standalone SVG sources with matching exports',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../schemas/icons.json',import.meta.url),'utf8'));
 assert.equal(I.names.length,58);assert.deepEqual(I.names,manifest.icons.map(i=>i.name));
 for(const name of I.names){const svg=I.svg(name);assert.ok(svg.includes('aria-hidden="true"'));assert.ok(!/<script|onload=|<foreignObject|href=/i.test(svg));const file=await readFile(new URL('../assets/icons/'+name+'.svg',import.meta.url),'utf8');assert.ok(file.includes('viewBox="0 0 24 24"'));assert.equal(file.match(/<svg[^>]*>(.*)<\/svg>/s)[1],svg.match(/<svg[^>]*>(.*)<\/svg>/s)[1]);}
});
test('icon API rejects invalid names/options and escapes accessible names',()=>{
 for(const name of ['__proto__','constructor','unknown'])assert.throws(()=>I.svg(name));
 assert.throws(()=>I.svg('leaf',{size:19}));assert.throws(()=>I.svg('leaf',{stroke:5}));assert.throws(()=>I.svg('leaf',{label:''}));
 const result=I.svg('leaf',{label:'"><script>alert(1)</script>'});assert.ok(!result.includes('<script>'));assert.ok(result.includes('role="img"'));
 assert.ok(I.svg('arrow-forward',{dir:'rtl'}).includes('scale(-1 1)'));assert.ok(!I.svg('leaf',{dir:'rtl'}).includes('scale(-1 1)'));
});
test('page recipes all provide a real template and reference existing icons',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../schemas/pages.json',import.meta.url),'utf8'));
 assert.equal(manifest.recipes.length,6);
 for(const r of manifest.recipes){assert.ok(I.names.includes(r.icon));const html=await readFile(new URL('../examples/foundations/'+r.id+'.html',import.meta.url),'utf8');assert.equal((html.match(/<main\b/g)||[]).length,1);assert.equal((html.match(/<h1>/g)||[]).length,1);assert.ok(html.includes('href="#main"'));}
});

test('legacy icon API delegates to the canonical set and keeps aliases safe',async()=>{
 const {Muhit,MuhitTheme}=await import('../src/index.mjs');
 for(const [old,name] of Object.entries({arrow:'arrow-forward',sliders:'settings',chevron:'chevron-forward',bookmarkFilled:'bookmark',board:'board',bell:'bell'})){
  assert.equal(Muhit.icon(old),I.svg(name,{size:20}).replace('class="mh-symbol"','class="mh-symbol mh-icon"'));
 }
 assert.ok(Muhit.icon('__proto__').includes('data-icon="grid"'));
 assert.equal(MuhitTheme.resolve({iconWeight:1.25}).tokens['--mh-icon-weight'],'1.5');
 assert.ok(I.svg('chevron-forward',{dir:'rtl'}).includes('scale(-1 1)'));
});
