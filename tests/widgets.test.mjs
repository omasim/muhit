import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MuhitWidgets as W,MuhitAgent as A,MuhitTheme as T} from '../src/index.mjs';
const examples=JSON.parse(fs.readFileSync(new URL('../examples/widgets.json',import.meta.url),'utf8'));
const get=kind=>structuredClone(examples.find(x=>x.type===kind));
test('all 10 widget contracts validate alone and inside the agent view',()=>{
 assert.equal(examples.length,10);for(const spec of examples)assert.deepEqual(W.validate(spec),{valid:true,errors:[]});
 assert.deepEqual(A.validate({schemaVersion:'1.0.0',components:examples}),{valid:true,errors:[]});
});
test('widget contracts reject unknown fields and invalid cross references',()=>{
 for(const spec of examples){spec.html='<b>unsafe</b>';assert.equal(W.validate(spec).valid,false);}
 const a=get('tabs');a.selected='missing';assert.equal(W.validate(a).valid,false);
 const b=get('kanban');b.items[0].column='missing';assert.equal(W.validate(b).valid,false);
 const c=get('choices');c.multiple=false;c.value=['nature','people'];assert.equal(W.validate(c).valid,false);
 const d=get('pagination');d.page=100;assert.equal(W.validate(d).valid,false);
 const e=get('filepicker');e.maxFiles=100;assert.equal(W.validate(e).valid,false);
});
test('unsafe JavaScript values are rejected without executing getters',()=>{
 const a=get('tabs');Object.defineProperty(a,'bad',{enumerable:true,get(){throw new Error('accessed');}});assert.equal(W.validate(a).valid,false);
 const b=get('tabs');b.loop=b;assert.equal(W.validate(b).valid,false);
 const c=get('tabs');c.items.push(c.items[0]);assert.equal(W.validate(c).valid,false);
});
test('extended theme controls round-trip without losing types and all preset contrast audits pass',()=>{
 const config=T.normalizeConfig({preset:'moss',font:'book',radius:'organic',density:'spacious',elevation:'raised',buttonStyle:'outline',controlSize:'lg',headingScale:1.15,lineHeight:1.85,contentWidth:'wide',borderWidth:2,iconWeight:2,accentIntensity:'vivid',chartPalette:'mono'});
 assert.deepEqual(T.fromJSON(T.toJSON(config)),config);assert.equal(Object.keys(T.resolve(config).tokens).length,68);
 for(const preset of T.presets)for(const mode of ['light','dark'])for(const chartPalette of ['natural','contrast','mono']){
  const result=T.audit({preset:preset.id,mode,chartPalette});assert.ok(result.every(x=>x.pass),JSON.stringify(result));
 }
});
