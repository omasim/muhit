import {MuhitIcons as Icons,MuhitTheme as Theme,MuhitDataGrid as Grid,MuhitForm as Form,MuhitWidgets as Widgets} from '../../src/index.mjs';
Theme.apply({});
document.querySelectorAll('[data-icon]').forEach(a=>a.prepend(Icons.mount(a,a.dataset.icon,{size:20}).element));
const regions=document.getElementById('regions');
function region(kind,title,body){const section=document.createElement(kind==='rail'?'aside':'section');section.className='mh-region mh-region--'+kind;if(kind==='rail'&&title)section.setAttribute('aria-label',title); if(title){const heading=document.createElement('h2');heading.textContent=title;section.append(heading)} if(body){const p=document.createElement('p');p.textContent=body;section.append(p)}regions.append(section);return section}
function card(host,title,body){const a=document.createElement('article');a.className='mh-card';const h=document.createElement(host.querySelector('h2')?'h3':'h2');h.textContent=title;const p=document.createElement('p');p.textContent=body;a.append(h,p);host.append(a);return a}
const recipe=document.body.dataset.recipe;
const states={ready:['Hazır',''],loading:['Yükleniyor','Veriler bekleniyor. Bu ekran bir durum örneğidir.'],empty:['Henüz içerik yok','İlk kaydı oluşturarak başlayabilirsin.'],error:['İçerik yüklenemedi','Bağlantıyı kontrol edip tekrar deneyebilirsin.'],unauthorized:['Erişim gerekli','Bu içeriği görmek için uygun erişim yetkisi gerekir.']};
const requested=new URL(location.href).searchParams.get('state');
const state=Object.hasOwn(states,requested)?requested:'ready';
const controls=document.createElement('div');controls.className='mh-row';
const label=document.createElement('label');label.textContent='Sayfa durumu ';const select=document.createElement('select');select.className='mh-input';
for(const [key,[name]] of Object.entries(states)){const option=document.createElement('option');option.value=key;option.textContent=name;select.append(option)}
select.value=state;label.append(select);controls.append(label);regions.before(controls);
select.onchange=()=>{const url=new URL(location.href);url.searchParams.set('state',select.value);location.assign(url)};
if(state!=='ready'){
 regions.setAttribute('aria-busy',String(state==='loading'));
 const panel=region('full');panel.classList.add('mh-card');panel.dataset.pageState=state;
 const heading=document.createElement('h2');heading.textContent=states[state][0];
 const message=document.createElement('p');message.textContent=states[state][1];message.setAttribute('role',state==='error'?'alert':'status');
 panel.append(heading,message);
 const button=document.createElement('button');button.className='mh-button';button.type='button';
 button.textContent=state==='error'?'Tekrar dene':state==='empty'?'Örnek içeriği aç':state==='unauthorized'?'Erişim hakkında':'Yüklemeyi sonlandır';
 button.onclick=()=>{if(state==='unauthorized'){message.textContent='Örnek ekran: erişim verilmedi. Gerçek uygulamada yöneticinizle iletişime geçin.';return;}const url=new URL(location.href);url.searchParams.set('state','ready');location.assign(url)};
 panel.append(button);
}else 
if(recipe==='overview'){
 [['12','Etkin proje'],['36','Ortak kaynak'],['8','Ekip üyesi'],['4','Bekleyen karar']].forEach(([value,label])=>{const h=region('metric');card(h,label,value)});
 const main=region('main','Öncelikli çalışmalar');card(main,'Araştırma çerçevesi','Paylaşılan kaynakları ve açık soruları bir araya getiriyoruz.');
 const a=document.createElement('a');a.href='detail.html';a.className='mh-text-link';a.textContent='Projeyi incele';main.append(a);
 card(region('rail','Bugünün odağı'),'İlk karar','Kapsamı netleştir, ardından sorumluluğu paylaş.');
}else if(recipe==='collection'){
 Grid.mount(region('full'),{title:'Araştırma kayıtları',selectable:true,columns:[{key:'name',label:'Çalışma'},{key:'owner',label:'Sorumlu'},{key:'count',label:'Kaynak',type:'number'}],rows:[{id:'a',name:'İnsan odaklı araştırma',owner:'Ada',count:12},{id:'b',name:'Ortak bilgi alanı',owner:'Deniz',count:24},{id:'c',name:'Doğa ve kent ilişkisi',owner:'Ece',count:8}]});
}else if(recipe==='detail'){
 const main=region('main','Ortak bilgi alanı');card(main,'Amaç','Bilgiyi bağlamıyla koruyan, anlaşılır ve paylaşılabilir bir çalışma ortamı.');card(main,'Son karar','İlk uygulama küçük bir ekiple sınanacak. Sonuçlar birlikte değerlendirilecek.');
 const aside=region('rail','Proje bağlamı');card(aside,'Sorumluluk','Araştırma ekibi · Örnek proje');card(aside,'Durum','İnceleme sürüyor. Henüz tamamlandı olarak işaretlenmedi.');
}else if(recipe==='settings'){
 const h=region('main');const status=document.createElement('p');status.setAttribute('role','status');
 Form.mount(h,{title:'Çalışma alanı tercihleri',fields:[{name:'name',label:'Çalışma alanı adı',required:true},{name:'email',label:'İletişim e-postası',type:'email',required:true}],values:{name:'Ortak alan',email:'demo@example.com'},onSubmit:async()=>{status.textContent='Tercihler yalnız bu örnekte onaylandı. Sunucuya gönderilmedi.';return {persisted:false}}});h.append(status);
 card(region('rail','Bu alan hakkında'),'Açık kayıt durumu','Alanlar kaydedilene kadar taslaktır. Sıfırla düğmesi son onaylanan değerlere döner.');
}else if(recipe==='workspace'){
 const workspace=region('full','İş akışı');const board=document.createElement('div');workspace.append(board);
 Widgets.mount(board,{type:'kanban',id:'work',title:'Ortak çalışmalar',columns:[{id:'plan',title:'Planlandı'},{id:'active',title:'Sürüyor'},{id:'done',title:'Tamamlandı'}],items:[{id:'research',title:'Kaynakları birleştir',column:'plan',description:'Örnek çalışma'},{id:'review',title:'Araştırma sorularını gözden geçir',column:'active'}]},{locale:'tr'});
}else {
 const article=region('full');article.classList.add('mh-prose');
 for(const [title,body]of [['Bağlamı korumak','Bir arayüz yalnız bilgiyi göstermek için değil, insanlar arasında anlaşılır bir ortak zemin kurmak için vardır. İçeriğin ritmi ve boşlukları bu ortak zeminin parçasıdır.'],['İnsan ve doğa','Muhit’in görsel dili sakin yüzeyler, okunaklı metin ve anlamlı işaretlerle kurulur. Doğa, her köşeye eklenen bir süs olmaktan çok ölçü ve denge konusunda bir referanstır.'],['Karara alan açmak','Ana içerik kolay izlenmeli; destekleyici bilgiler düşünce akışını bölmemelidir. Bir sayfa, kullanıcının bir sonraki adımı anlayabildiği kadar tamamlanmıştır.']]){const h=document.createElement('h2');h.textContent=title;const p=document.createElement('p');p.textContent=body;article.append(h,p)}
}
let dark=false;document.getElementById('theme').onclick=()=>{dark=!dark;Theme.apply({mode:dark?'dark':'light'});document.getElementById('theme').textContent=dark?'Açık tema':'Koyu tema';document.querySelector('.mh-shell__brand img').src='../../assets/brand/'+(dark?'muhit-logo-dark.svg':'muhit-logo.svg')};
document.getElementById('direction').onclick=()=>{const rtl=document.documentElement.dir!=='rtl';document.documentElement.dir=rtl?'rtl':'ltr';document.getElementById('direction').textContent=rtl?'LTR yerleşim':'RTL yerleşim'};
window.foundationReady=true;
