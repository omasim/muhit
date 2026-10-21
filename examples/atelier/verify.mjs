// Run from repository root: PLAYWRIGHT_BROWSERS_PATH=/tmp/muhit-browsers node examples/atelier/verify.mjs
import {chromium,firefox,webkit} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const base=process.env.ATELIER_URL||'http://127.0.0.1:4397/examples/atelier/';
const out=process.env.ATELIER_REPORT_DIR||'/tmp/muhit-atelier-verification';
await fs.mkdir(out+'/screenshots',{recursive:true});
const results=[],errors=[],flows=[];
for(const [engine,type] of Object.entries({chromium,firefox,webkit}).filter(([name])=>(process.env.ATELIER_ENGINES||'chromium').split(',').includes(name))){
 console.log('Testing '+engine);
 const browser=await type.launch();const page=await browser.newPage();page.on('pageerror',e=>errors.push({engine,error:String(e)}));
 for(const width of (engine==='chromium'?[1440,768,390]:[1440,390]))for(const screen of ['discover','search','detail','workspace','project','review','catalog']){
  await page.setViewportSize({width,height:width===390?844:1000});await page.goto(base+'index.html?screen='+screen);await page.evaluate(()=>document.fonts.ready);
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
  const axe=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const item={engine,screen,width,overflow,violations:axe.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))};results.push(item);console.log(engine+' '+screen+' '+width);await fs.writeFile(out+'/verification-progress.json',JSON.stringify({results,errors},null,2));
  if(process.env.ATELIER_CAPTURE==='1'&&engine==='chromium'&&width!==768)await page.screenshot({path:out+'/screenshots/'+screen+'-'+width+'.png',fullPage:true,animations:'disabled',timeout:60000});
 }
 await page.goto(base+'index.html?screen=discover');
 await page.getByRole('button',{name:'Tasarım',exact:true}).click();assert.equal(await page.locator('#discovery-cards .card:visible').count(),1);
 await page.locator('[data-save="study"]').click();assert.equal(await page.locator('[data-save="study"]').getAttribute('aria-pressed'),'true');
 await page.goto(base+'index.html?screen=search');await page.locator('#query').fill('olmayan sonuç');assert.equal(await page.locator('#results .card').count(),0);await page.locator('#results [data-action="clear-filters"]').click();assert.equal(await page.locator('#results .card').count(),3);
 await page.locator('[data-action="filters"]').click();await page.getByLabel('Tasarım',{exact:true}).check();assert.equal(await page.locator('#results .card').count(),1);
 await page.locator('#results h3 a').click();assert.match(await page.locator('h1').textContent(),/Daha azla/);
 await page.getByRole('button',{name:'Kendime bir not bırak'}).click();await page.locator('#note').fill('Korunacak araştırma notu');await page.keyboard.press('Escape');assert.equal(await page.locator('#note-dialog').isVisible(),false);assert.equal(await page.evaluate(()=>document.activeElement?.dataset.action),'note');
 await page.getByRole('button',{name:'Kendime bir not bırak'}).click();assert.equal(await page.locator('#note').inputValue(),'Korunacak araştırma notu');await page.locator('#note-form button[type=submit]').click();
 await page.goto(base+'index.html?screen=project');await page.locator('[data-task="1"]').selectOption('2');assert.match(await page.locator('[data-task="1"]').locator('xpath=ancestor::section').getAttribute('aria-label'),/Tamamlandı/);
 await page.goto(base+'index.html?screen=review');await page.locator('[data-action="apply"]').click();assert.equal(await page.locator('#applied-section').isVisible(),false);await page.locator('#approve').check();await page.locator('[data-action="cancel"]').click();assert.equal(await page.locator('#approve').isChecked(),false);await page.locator('#approve').check();await page.locator('[data-action="apply"]').click();assert.equal(await page.locator('#applied-section').isVisible(),true);assert.equal(await page.locator('[data-action="apply"]').isDisabled(),true);
 await page.goto(base+'boards.html');assert.equal(await page.locator('iframe').count(),18);
 flows.push({engine,category:true,bookmark:true,search:true,filter:true,matchingDetail:true,noteEscapeFocusAndDraft:true,taskStatus:true,approvalAndCancel:true,boards:18});await browser.close();
}
await fs.writeFile(out+'/verification.json',JSON.stringify({results,errors,flows},null,2));
const failed=results.filter(r=>r.overflow||r.violations.length);console.log(JSON.stringify({scans:results.length,failed,errors,flows},null,2));assert.equal(failed.length,0);assert.equal(errors.length,0);
