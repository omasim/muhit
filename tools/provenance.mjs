import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const root=fileURLToPath(new URL('../',import.meta.url));
export async function provenance(){
  const hash=createHash('sha256');
  async function visit(rel){
    const full=path.join(root,rel);
    for(const item of (await readdir(full,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name,'en'))){
      if(['node_modules','dist','.git'].includes(item.name)||item.isSymbolicLink())continue;
      const child=path.join(rel,item.name);
      if(item.isDirectory())await visit(child);
      else {hash.update(child.replaceAll(path.sep,'/'));hash.update('\0');hash.update(await readFile(path.join(root,child)));hash.update('\0');}
    }
  }
  for(const dir of ['src','esm','styles','types','schemas','locales','examples'])await visit(dir);
  for(const f of ['package.json','package-lock.json','index.html','studio.js','studio-model.js','studio-example.js','studio-en.html','studio-en.mjs','studio-en.css']){hash.update(f);hash.update(await readFile(path.join(root,f)));}
  let commit=null;try{commit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim()}catch{}
  return {version:JSON.parse(await readFile(path.join(root,'package.json'),'utf8')).version,sourceSha256:hash.digest('hex'),commit,scope:'src, esm, styles, types, schemas, locales, examples (without dependencies/builds), package manifests, studio entrypoints',date:new Date().toISOString(),platform:process.platform,node:process.version};
}
