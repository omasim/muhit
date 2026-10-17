import fs from 'node:fs';
import {createHash} from 'node:crypto';
const base=new URL('../assets/brand/',import.meta.url);
const lock=JSON.parse(fs.readFileSync(new URL('brand-lock.json',base),'utf8'));
const meta=JSON.parse(fs.readFileSync(new URL('brand.json',base),'utf8'));
if(meta.version!==lock.version||meta.status!=='locked')throw new Error('Marka sürümü veya sabitleme kaydı uyuşmuyor.');
for(const [name,expected] of Object.entries(lock.files)){
 const hash=createHash('sha256').update(fs.readFileSync(new URL(name,base))).digest('hex');
 if(hash!==expected)throw new Error('Ana logo dosyası değişmiş: '+name);
}
const actual=fs.readdirSync(base).filter(x=>x.endsWith('.svg')).sort();
if(JSON.stringify(actual)!==JSON.stringify(Object.keys(lock.files).sort()))throw new Error('SVG envanteri değişmiş.');
console.log(`Muhit ${lock.version}: ${actual.length} SVG dosyası sabit ana sürümle eşleşiyor.`);
