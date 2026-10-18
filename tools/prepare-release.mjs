import {provenance} from './provenance.mjs';
// Creates local versioned artifacts. Does not publish to npm or GitHub.
import {execFileSync} from 'node:child_process';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const pkg=JSON.parse(await readFile(path.join(root,'package.json'),'utf8'));
const out=path.resolve(process.argv[2] || path.join(root,'../muhit-release-'+pkg.version));
await mkdir(out,{recursive:true});
execFileSync('npm',['pack','--pack-destination',out],{cwd:root,stdio:'inherit'});
const archive=`muhit-ui-${pkg.version}-source.zip`;
execFileSync('python3',['-c',`import pathlib,sys,zipfile
root=pathlib.Path(sys.argv[1]); out=pathlib.Path(sys.argv[2])
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted(root.rglob('*')):
  rel=p.relative_to(root)
  if not p.is_file() or p.is_symlink() or any(x in ('node_modules','dist','.git','__pycache__') for x in rel.parts) or p.suffix in ('.tgz','.zip') or p.name=='.DS_Store' or '.actual.' in p.name or '.candidate.' in p.name: continue
  z.write(p,'muhit-ui/'+str(rel))
`,root,path.join(out,archive)],{stdio:'inherit'});
const files=[`${pkg.name}-${pkg.version}.tgz`,archive];
await writeFile(path.join(out,'SHA256SUMS'),(await Promise.all(files.map(async f=>createHash('sha256').update(await readFile(path.join(out,f))).digest('hex')+'  '+f))).join('\n')+'\n');
await writeFile(path.join(out,'PROVENANCE.json'),JSON.stringify(await provenance(),null,2)+'\n');
console.log('Release artifacts:',out);
