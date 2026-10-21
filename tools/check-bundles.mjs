import {provenance} from './provenance.mjs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {writeFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const {build}=await import(process.env.MUHIT_ESBUILD_MODULE || pathToFileURL(path.join(root,'examples/react/node_modules/esbuild/lib/main.js')).href);
const report={};
for(const [name,api]of [['forms','MuhitForm'],['plot','MuhitPlot'],['data-grid','MuhitDataGrid']]){
 const result=await build({stdin:{contents:`export {${api}} from './esm/${name}.mjs';`,resolveDir:root},bundle:true,minify:true,format:'esm',write:false,metafile:true});
 const inputs=Object.keys(result.metafile.inputs);if(inputs.some(f=>/esm\/(agent|charts|table|widgets)\.mjs/.test(f)))throw Error('Unrelated module included: '+name);
 if(name==='data-grid' && inputs.includes('esm/icons.mjs'))throw Error('Full icon catalog pulled into DataGrid');
 const bytes=result.outputFiles[0].contents.length;if(bytes>(name==='data-grid'?28000:35000))throw Error('35KB per-module JS budget exceeded: '+name);
 report[name]={bytes,inputs};
}
await writeFile(path.join(root,'tests/bundle-verification.json'),JSON.stringify({...report,provenance:await provenance()},null,2)+'\n');console.log('PASS isolated module bundles',report);

const single=await build({entryPoints:[path.join(root,'esm/icons/leaf.mjs')],bundle:true,minify:true,format:'esm',write:false,metafile:true});
if(single.outputFiles[0].contents.length>5000 || Object.keys(single.metafile.inputs).some(p=>p.endsWith('/icons.mjs')))throw Error('Single icon budget/dependency regression');
console.log('PASS single-icon budget',single.outputFiles[0].contents.length);
