import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const work=await mkdtemp(path.join(tmpdir(),'muhit-types-'));
try {
 const pkg=JSON.parse(await readFile(path.join(root,'package.json'),'utf8'));
 execFileSync('npm',['pack','--ignore-scripts','--pack-destination',work],{cwd:root,stdio:'pipe'});
 const dest=path.join(work,'node_modules/muhit-ui');await mkdir(dest,{recursive:true});
 execFileSync('tar',['-xzf',path.join(work,`${pkg.name}-${pkg.version}.tgz`),'-C',dest,'--strip-components=1']);
 await writeFile(path.join(work,'package.json'),'{"type":"module"}');
 // Resolve and execute actual packed entrypoints as well as their declarations.
 for (const [name, entry] of Object.entries(pkg.exports)) {
  if (!entry || typeof entry !== 'object' || !entry.import) continue;
  const target=path.join(dest,entry.import);
  await readFile(target);
  execFileSync(process.execPath,['--input-type=module','-e',`await import(${JSON.stringify(new URL('file://'+target).href)})`],{stdio:'pipe'});
 }
 for(const asset of ['styles/planning.css','styles/content.css','styles/suite.css','examples/atelier/index.html','styles/product.css','examples/product/index.html','tools/serve.mjs']) await readFile(path.join(dest,asset));
 console.log('PASS packed runtime imports and workspace assets');
 const entries=Object.entries(pkg.exports).filter(([,v])=>v.types).map(([k])=>k==='.'?'muhit-ui':'muhit-ui/'+k.slice(2));
 await writeFile(path.join(work,'check.ts'),entries.map((e,i)=>`import * as entry${i} from '${e}'; console.log(entry${i});`).join('\n')+'\n'+await readFile(path.join(root,'tests/planning-consumer.ts'),'utf8'));
 const tsc=process.env.MUHIT_TSC || path.join(root,'node_modules/typescript/bin/tsc');
 for(const [module,resolution] of [['NodeNext','NodeNext'],['ESNext','Bundler']]) {
  execFileSync(process.execPath,[tsc,path.join(work,'check.ts'),'--noEmit','--strict','--target','ES2022','--module',module,'--moduleResolution',resolution],{stdio:'inherit'});
  console.log(`PASS packed ${resolution}: ${entries.length} public type entries`);
 }
} finally {await rm(work,{recursive:true,force:true});}
