const documents=await (await fetch('search.json')).json();
const search=document.querySelector('#search'),results=document.querySelector('#results'),article=document.querySelector('#document');
const url=new URL(location.href);search.value=url.searchParams.get('q')||'';
function inline(node,text){
 const pattern=/\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`/g;let start=0;
 for(const match of text.matchAll(pattern)){
  node.append(document.createTextNode(text.slice(start,match.index)));
  if(match[3]!==undefined){const code=document.createElement('code');code.textContent=match[3];node.append(code)}
  else {
   const a=document.createElement('a');a.textContent=match[1];const target=match[2];
   if(/^[A-Za-z0-9._-]+\.md$/.test(target))a.href='?doc='+encodeURIComponent(target);
   else if(/^\.\.\/(examples\/foundations|assets|schemas)\/[A-Za-z0-9._/-]+$/.test(target))a.href=target.slice(3);
   else if(/^https:\/\//.test(target))a.href=target;
   else {node.append(document.createTextNode(match[1]+' ('+target+')'));start=match.index+match[0].length;continue;}
   node.append(a);
  }
  start=match.index+match[0].length;
 }
 node.append(document.createTextNode(text.slice(start)));
}
function render(doc){
 article.replaceChildren();article.lang=doc.lang||'en';let code=null;
 for(const line of doc.body.split('\n')){
  if(line.startsWith('```')){if(code){article.append(code);code=null}else{code=document.createElement('pre')}continue;}
  if(code){code.textContent+=line+'\n';continue;}
  if(!line.trim())continue;
  const match=/^(#{1,5}) (.*)$/.exec(line);const node=document.createElement(match?'h'+Math.min(match[1].length+1,6):'p');inline(node,match?match[2]:line);article.append(node);
 }
 if(code)article.append(code);
 document.title=doc.title+' · Muhit';
}
function filter(){
 const q=search.value.toLocaleLowerCase();const found=documents.filter(d=>(d.title+' '+d.body).toLocaleLowerCase().includes(q));results.replaceChildren();
 for(const d of found){const a=document.createElement('a');a.textContent=d.title;a.href='?doc='+encodeURIComponent(d.id)+'&q='+encodeURIComponent(search.value);a.onclick=e=>{e.preventDefault();history.pushState({},'',a.href);render(d);document.querySelector('#main').focus();};results.append(a)}
 document.querySelector('#count').textContent=found.length+' documents';
}
search.addEventListener('input',filter);window.addEventListener('popstate',()=>{const u=new URL(location.href);search.value=u.searchParams.get('q')||'';filter();render(documents.find(d=>d.id===u.searchParams.get('doc'))||documents.find(d=>d.id==='CURRENT.md'));});
filter();render(documents.find(d=>d.id===url.searchParams.get('doc'))||documents.find(d=>d.id==='CURRENT.md'));window.docsReady=true;
