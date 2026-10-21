import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import de from '../locales/de.mjs';
import ar from '../locales/ar.mjs';
import '../studio-model.js';
test('both studios share the current theme schema and value parsing', async()=>{
 const schema=JSON.parse(await readFile(new URL('../schemas/theme.schema.json',import.meta.url),'utf8'));
 assert.deepEqual(globalThis.MuhitStudioModel.properties,schema.properties);
 assert.equal(globalThis.MuhitStudioModel.parse('scale','1.25'),1.25);
 assert.equal(globalThis.MuhitStudioModel.parse('accent',''),null);
 assert.throws(()=>globalThis.MuhitStudioModel.parse('unknown','x'));
});
test('legacy table and charts have DE/AR messages for every literal translation call', async()=>{
 for(const file of ['table','charts']) {
  const text=await readFile(new URL('../src/'+file+'.js',import.meta.url),'utf8');
  for(const m of text.matchAll(/\bt\(\s*"((?:[^"\\]|\\.)*)"/g)) {
   const key=JSON.parse('"'+m[1]+'"');
   for(const [locale,catalog]of Object.entries({de,ar})) assert.ok(typeof catalog[key]==='string'&&catalog[key].trim(),`${locale}: ${key}`);
  }
 }
});
