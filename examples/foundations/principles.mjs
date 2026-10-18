import {MuhitTheme as Theme} from '../../esm/theme.mjs';
Theme.apply({});
const $=id=>document.getElementById(id);
const records=[{id:'research',title:'Araştırma çerçevesi'},{id:'sources',title:'Ortak kaynaklar'},{id:'decision',title:'Karar notları'}];
const drafts=new Map(),confirmed=new Map();let current=null,timer=null,revision=0;
function announce(text){$('result').textContent=text;}
function list(){
 const term=$('filter').value.toLocaleLowerCase('tr');$('records').replaceChildren();
 const matches=records.filter(r=>r.title.toLocaleLowerCase('tr').includes(term));
 $('count').textContent=matches.length+' örnek kayıt';
 for(const record of matches){const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.className='mh-button';button.id='record-'+record.id;button.textContent=record.title;button.onclick=()=>open(record);li.append(button);$('records').append(li)}
 $('no-results').hidden=matches.length>0;
}
function busy(value){$('draft').readOnly=value;$('confirm').disabled=value;$('failure').disabled=value;$('cancel').hidden=!value;$('back').disabled=value;$('editor').setAttribute('aria-busy',String(value));}
function open(record){current=record;$('confirm').textContent='Yerel olarak onayla';$('list-view').hidden=true;$('detail-view').hidden=false;$('detail-title').textContent=record.title;$('draft').value=drafts.get(record.id)||'';announce(confirmed.has(record.id)?'Bu sekmede daha önce yerel olarak onaylandı. Yeni değişiklikler taslaktır.':'Taslak · henüz onaylanmadı.');$('detail-title').focus();}
$('filter').addEventListener('input',list);
$('clear').onclick=()=>{$('filter').value='';list();$('filter').focus()};
$('draft').addEventListener('input',()=>{drafts.set(current.id,$('draft').value);announce('Taslak değişti. Yalnız bu sayfanın belleğinde tutuluyor.')});
$('back').onclick=()=>{$('detail-view').hidden=true;$('list-view').hidden=false;list();$('record-'+current.id)?.focus()};
$('editor').addEventListener('submit',event=>{
 event.preventDefault();if(timer!==null)return;
 const text=$('draft').value;if(!text.trim()){announce('Onaylamak için bir not yaz. Taslağın korunuyor.');$('draft').focus();return;}
 const turn=++revision,fail=$('failure').checked;busy(true);announce('Örnek işlem bekleniyor. Henüz onaylanmadı.');$('cancel').focus();
 timer=setTimeout(()=>{timer=null;if(turn!==revision)return;busy(false);
 if(fail){announce('Örnek işlem başarısız oldu. Taslağın korunuyor. Hata seçeneğini kapatıp yeniden deneyebilirsin.');$('confirm').textContent='Yeniden dene';}
 else{confirmed.set(current.id,text);announce('Yalnız bu sekmenin belleğinde onaylandı. Sunucuya veya kalıcı depoya kaydedilmedi.');$('confirm').textContent='Yerel olarak onayla';}
 $('confirm').focus();},700);
});
$('cancel').onclick=()=>{revision++;clearTimeout(timer);timer=null;busy(false);announce('İşlem iptal edildi. Taslağın korunuyor; onay verilmedi.');$('confirm').focus()};
$('theme').onclick=()=>{const dark=document.documentElement.dataset.mhMode!=='dark';Theme.apply({mode:dark?'dark':'light'});document.querySelector('header img').src='../../assets/brand/'+(dark?'muhit-logo-dark.svg':'muhit-logo.svg');$('theme').textContent=dark?'Açık tema':'Koyu tema'};
window.addEventListener('pagehide',()=>{revision++;clearTimeout(timer);if(timer!==null){busy(false);announce('İşlem iptal edildi. Taslağın korunuyor; onay verilmedi.')}timer=null});
list();window.principlesReady=true;
