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
 const entries=Object.entries(pkg.exports).filter(([,v])=>v.types).map(([k])=>k==='.'?'muhit-ui':'muhit-ui/'+k.slice(2));
 await writeFile(path.join(work,'check.ts'),entries.map((e,i)=>`import * as entry${i} from '${e}'; console.log(entry${i});`).join('\n'));
 const tsc=process.env.MUHIT_TSC || path.join(root,'node_modules/typescript/bin/tsc');
 for(const [module,resolution] of [['NodeNext','NodeNext'],['ESNext','Bundler']]) {
  execFileSync(process.execPath,[tsc,path.join(work,'check.ts'),'--noEmit','--strict','--target','ES2022','--module',module,'--moduleResolution',resolution],{stdio:'inherit'});
  console.log(`PASS packed ${resolution}: ${entries.length} public type entries`);
 }
} finally {await rm(work,{recursive:true,force:true});}
