import {evaluatePerformance} from '../../tools/performance-policy.mjs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdtemp,writeFile,mkdir,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';import path from 'node:path';
import {provenance} from '../../tools/provenance.mjs';
const folder=await mkdtemp(path.join(tmpdir(),'muhit-perf-')),port=Number(process.env.MUHIT_PERF_PORT||4517),origin=`http://127.0.0.1:${port}`;
const supplied=process.env.MUHIT_SEARCH_DATA;
const budgets=JSON.parse(await readFile(new URL('../../schemas/performance-budgets.json',import.meta.url),'utf8'));
const rows=supplied?JSON.parse(await readFile(supplied,'utf8')):Array.from({length:50000},(_,i)=>({id:'r'+i,title:(i%2?'Research':'Design')+' '+i+' — '+('İnsan, doğa ve ortak üretim. '.repeat(i%10===0?160:40))}));
const dataFile=path.join(folder,'search.json');await writeFile(dataFile,JSON.stringify(rows));
const server=spawn(process.execPath,['examples/integration/server.mjs'],{env:{...process.env,PORT:String(port),MUHIT_DATA_FILE:path.join(folder,'document.json'),MUHIT_SEARCH_DATA:dataFile},stdio:'ignore'});
let browser;const report={provenance:await provenance(),dataset:supplied?'provided-file':'synthetic-long-text',rows:rows.length,profile:{cpuSlowdown:4,latencyMs:150,downloadBytesPerSecond:131072,uploadBytesPerSecond:65536},notes:'Emulation on host hardware; not a physical mobile-device acceptance.'};
try{
 for(let i=0;i<100;i++){try{if((await fetch(origin)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch();const page=await browser.newPage();await page.goto(origin+'/examples/planning/index.html');await page.waitForFunction(()=>window.planningLab);
 const cdp=await page.context().newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 report.local=await page.evaluate(async()=>{const {createSearchIndexAsync}=await import('/src/search-index.mjs');const rows=Array.from({length:10000},(_,i)=>({id:'r'+i,title:('Research knowledge '+i+' ').repeat(100)}));let last=performance.now(),maxGapMs=0;const timer=setInterval(()=>{const now=performance.now();maxGapMs=Math.max(maxGapMs,now-last);last=now;},0);const start=performance.now(),index=await createSearchIndexAsync(rows,{locale:'en'}),buildMs=performance.now()-start;maxGapMs=Math.max(maxGapMs,performance.now()-last);clearInterval(timer);const times=[];for(let i=0;i<20;i++){const t=performance.now();index.search(String(i),{pageSize:25});times.push(performance.now()-t);}times.sort((a,b)=>a-b);return{rows:rows.length,buildMs,maxGapMs,p50Ms:times[10],p95Ms:times[18]};});
 
 await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:131072,uploadThroughput:65536});
 report.remote=await page.evaluate(async()=>{const times=[];let bytes=0;for(let i=0;i<8;i++){const start=performance.now(),response=await fetch('/api/resources?query=Research&page=1&pageSize=25'),text=await response.text();const value=JSON.parse(text);if(!Array.isArray(value.items)||value.items.length>25)throw Error('Bad page');times.push(performance.now()-start);bytes=new TextEncoder().encode(text).length;}times.sort((a,b)=>a-b);return{p50Ms:times[4],p95Ms:times[7],responseBytes:bytes};});
 
 report.budgets=budgets;
 report.acceptance=evaluatePerformance(report,budgets);
 report.realDataAcceptance=supplied?'provided-data-profile-only':'pending-data-and-device';
 assert.ok(report.acceptance.passed,'Product or regression performance gate failed');
 report.status='passed';
}catch(error){report.status='failed';report.failure=String(error);throw error;}finally{await browser?.close();server.kill();await rm(folder,{recursive:true,force:true});await mkdir('tests/evidence/readiness25',{recursive:true});await writeFile('tests/evidence/readiness25/performance.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify(report));
