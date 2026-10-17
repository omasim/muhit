import test from 'node:test';
import assert from 'node:assert/strict';
import {MuhitI18n as I,MuhitForm as F} from '../src/index.mjs';
test('locale contexts interpolate safely and isolate per-instance messages',()=>{
 const en=I.create({locale:'en-US'});assert.equal(en.text('Kaydet'),'Save');assert.equal(en.text('{label} alanını doldurun.',undefined,{label:'<img>'}),'Complete <img>.');
 const custom=I.create({locale:'en',messages:{Kaydet:'Submit'}});assert.equal(custom.text('Kaydet'),'Submit');assert.equal(en.text('Kaydet'),'Save');
 assert.equal(I.create({locale:'ar'}).dir,'rtl');assert.equal(I.create({locale:'he',dir:'ltr'}).dir,'ltr');
 assert.throws(()=>I.create({dir:'sideways'}));assert.throws(()=>I.create({messages:{a:1}}));assert.throws(()=>I.setLocale('invalid_locale'));
});
test('catalog registration copies dictionaries and default locale leaves existing contexts unchanged',()=>{
 const old=I.create({locale:'tr'}),messages={Kaydet:'Speichern'};I.register('de',messages);messages.Kaydet='mutated';assert.equal(I.create({locale:'de-DE'}).text('Kaydet'),'Speichern');
 I.setLocale('en');assert.equal(I.create().text('Kaydet'),'Save');assert.equal(old.text('Kaydet'),'Kaydet');I.setLocale('tr-TR');
});
test('validation errors use selected language and caller field labels',()=>{
 const fields=[{name:'email',label:'Email',type:'email',required:true}];assert.equal(F.validate(fields,{email:''},{locale:'en'}).errors.email,'Complete Email.');
 assert.equal(F.validate(fields,{email:'bad'},{locale:'en'}).errors.email,'Enter a valid email address.');
});

import {MuhitDataGrid as G,MuhitAgent as A} from '../src/index.mjs';
test('agent column layouts validate widths, keys and pinning before rendering',()=>{
 const columns=[{key:'name',label:'Name'}],layout=[{key:'name',width:240,pin:'start'}];
 const value=G.validateColumnLayout(layout,columns);value[0].width=300;assert.equal(layout[0].width,240);
 assert.throws(()=>G.validateColumnLayout([{key:'name',width:119,pin:null}],columns));
 assert.throws(()=>G.validateColumnLayout([{key:'other',width:200,pin:null}],columns));
 const spec={schemaVersion:'1.1.0',components:[{type:'datagrid',id:'g',title:'Grid',columns,rows:[],columnLayout:layout}]};
 assert.equal(A.validate(spec).valid,true);spec.components[0].columnLayout[0].width=900;assert.equal(A.validate(spec).valid,false);
});
