import {fileURLToPath,pathToFileURL} from 'node:url';
import {writeFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const {build}=await import(process.env.MUHIT_ESBUILD_MODULE || pathToFileURL(path.join(root,'examples/react/node_modules/esbuild/lib/main.js')).href);
const report={};
for(const [name,api]of [['forms','MuhitForm'],['plot','MuhitPlot'],['data-grid','MuhitDataGrid']]){
 const result=await build({stdin:{contents:`export {${api}} from './esm/${name}.mjs';`,resolveDir:root},bundle:true,minify:true,format:'esm',write:false,metafile:true});
 const inputs=Object.keys(result.metafile.inputs);if(inputs.some(f=>/esm\/(agent|charts|table|widgets)\.mjs/.test(f)))throw Error('Unrelated module included: '+name);
 const bytes=result.outputFiles[0].contents.length;if(bytes>35000)throw Error('35KB per-module JS budget exceeded: '+name);
 report[name]={bytes,inputs};
}
await writeFile(path.join(root,'tests/bundle-verification.json'),JSON.stringify(report,null,2)+'\n');console.log('PASS isolated module bundles',report);
