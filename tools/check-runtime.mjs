import {readFile} from 'node:fs/promises';
const pkg=JSON.parse(await readFile(new URL('../package.json',import.meta.url)));
let count=0;for(const entry of Object.values(pkg.exports)){if(entry?.import){await import(new URL('../'+entry.import,import.meta.url));count++;}}
console.log(JSON.stringify({node:process.version,version:pkg.version,runtimeImports:count,status:'passed'}));
