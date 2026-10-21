import {MuhitIcons as Icons,MuhitTheme as Theme} from '../../src/index.mjs';
const catalog=await fetch('../../schemas/icons.json').then(r=>{if(!r.ok)throw Error('Icon catalog unavailable');return r.json()});
const $=id=>document.getElementById(id);
Theme.apply({});let selected='leaf',dark=false;
const groups={navigation:'Gezinme',actions:'Eylemler',data:'Veri',knowledge:'Bilgi',people:'İnsan',nature:'Doğa',system:'Sistem'};
for(const [value,label]of Object.entries(groups)){const o=document.createElement('option');o.value=value;o.textContent=label;$('category').append(o)}
function options(){return {size:Number($('size').value),stroke:Number($('stroke').value)}}
function selection(){const icon=catalog.icons.find(x=>x.name===selected);$('chosen').textContent=icon.label+' · '+selected;$('code').textContent=Icons.svg(selected,options());$('icons').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.name===selected)))}
function render(){const query=$('search').value.toLocaleLowerCase('tr');const data=catalog.icons.filter(i=>($('category').value==='all'||i.category===$('category').value)&&(i.name+' '+i.label).toLocaleLowerCase('tr').includes(query));$('icons').replaceChildren();for(const icon of data){const b=document.createElement('button');b.type='button';b.className='icon-tile';b.dataset.name=icon.name;b.innerHTML=Icons.svg(icon.name,options());const label=document.createElement('span');label.textContent=icon.label;const id=document.createElement('small');id.textContent=icon.name;b.append(label,id);b.onclick=()=>{selected=icon.name;selection()};$('icons').append(b)}$('count').textContent=data.length+' ikon gösteriliyor.';selection()}
for(const id of ['search','category','size','stroke'])$(id).addEventListener(id==='search'?'input':'change',render);
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText($('code').textContent);$('result').textContent='SVG kodu kopyalandı.'}catch{$('result').textContent='Kopyalama izni yok. Yukarıdaki SVG kodunu seçerek kopyalayabilirsin.'}};
$('download').onclick=()=>{const url=URL.createObjectURL(new Blob([$('code').textContent],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=url;a.download='muhit-'+selected+'.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('result').textContent=selected+' SVG indirmesi başlatıldı.'};
$('mode').onclick=()=>{dark=!dark;Theme.apply({mode:dark?'dark':'light'});$('mode').textContent=dark?'Açık tema':'Koyu tema';$('logo').src='../../assets/brand/'+(dark?'muhit-logo-dark.svg':'muhit-logo.svg')};
render();window.foundationReady=true;
