import test from 'node:test';import assert from 'node:assert/strict';
import {MuhitI18n as I,MuhitCSV as C} from '../src/index.mjs';
test('regional catalogs overlay base language and instance overrides',()=>{I.register('de',{Kaydet:'Speichern','Sıfırla':'Zurücksetzen'});I.register('de-CH',{Kaydet:'Sichern'});const x=I.create({locale:'de-CH'});assert.equal(x.text('Sıfırla'),'Zurücksetzen');assert.equal(x.text('Kaydet'),'Sichern');assert.equal(I.create({locale:'de-CH',messages:{Kaydet:'OK'}}).text('Kaydet'),'OK');});
test('shared CSV protects whitespace and control-prefixed formulas',()=>{for(const value of ['=1+1',' =1+1','\t=1','\r@SUM(1)','\ntext','  +1','-1','@a'])assert.ok(C.cell(value).startsWith('"\''));assert.equal(C.cell('A"B'),'"A""B"');assert.equal(C.cell(null),'""');});
