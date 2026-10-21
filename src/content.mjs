/** Muhit content families. DOM-only, dependency-free; data and persistence belong to the consumer. */
const listeners=new WeakMap();
function release(root){const binding=listeners.get(root);if(binding){binding.button.removeEventListener('click',binding.handler);listeners.delete(root);}}
const variants=new Set(['editorial','resource','profile','project','metric','proposal']);
const tones=new Set(['neutral','success','warning','info']);
export function validateContent(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new TypeError('Content options required');
 const text=(value,key,required=false)=>{if(value===undefined&&!required)return undefined;if(typeof value!=='string'||value.length>4000||(required&&!value.trim()))throw new TypeError('Invalid '+key);return value;};
 const result={title:text(input.title,'title',true),description:text(input.description,'description'),eyebrow:text(input.eyebrow,'eyebrow'),variant:input.variant??'editorial',headingLevel:input.headingLevel??3};
 if(!variants.has(result.variant)||![2,3,4,5,6].includes(result.headingLevel))throw new TypeError('Invalid variant or headingLevel');
 if(input.href!==undefined)result.href=validateURL(input.href);
 if(input.image!==undefined){if(!input.image||typeof input.image!=='object')throw new TypeError('Invalid image');result.image={src:validateURL(input.image.src),alt:text(input.image.alt,'alt',true)};}
 if(input.meta!==undefined){if(!Array.isArray(input.meta)||input.meta.length>8)throw new TypeError('Invalid meta');result.meta=input.meta.map(v=>text(v,'meta',true));}
 if(input.status!==undefined){if(!input.status||!tones.has(input.status.tone??'neutral'))throw new TypeError('Invalid status');result.status={label:text(input.status.label,'status',true),tone:input.status.tone??'neutral'};}
 if(input.progress!==undefined){if(!Number.isFinite(input.progress)||input.progress<0||input.progress>100)throw new TypeError('Invalid progress');result.progress=input.progress;result.progressLabel=text(input.progressLabel,'progressLabel',true);}
 if(input.action!==undefined){if(!input.action||typeof input.action.onClick!=='function')throw new TypeError('Invalid action');result.action={label:text(input.action.label,'action label',true),onClick:input.action.onClick};}
 return result;
}
function validateURL(value){if(typeof value!=='string'||!value.trim()||/[\u0000-\u0020\u007f]/.test(value)||value.startsWith('//')||value.includes('\\'))throw new TypeError('Invalid URL');const url=new URL(value,'https://muhit.invalid/');if(!['https:','http:'].includes(url.protocol))throw new TypeError('Unsafe URL');return value;}
function resolveHost(host){if(!host?.ownerDocument||typeof host.replaceChildren!=='function')throw new TypeError('DOM host required');return host;}
function element(doc,name,cls,text){const node=doc.createElement(name);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;}
function render(doc,o,kind){const root=element(doc,kind==='row'?'div':'article','mh-content-kit mh-content-'+kind);root.dataset.variant=o.variant;
 if(o.image){const img=element(doc,'img','mh-content-image');img.src=o.image.src;img.alt=o.image.alt;img.loading='lazy';root.append(img);}
 const body=element(doc,'div','mh-content-body');root.append(body);
 if(o.eyebrow)body.append(element(doc,'p','mh-content-eyebrow',o.eyebrow));
 const h=element(doc,'h'+o.headingLevel,'mh-content-title');if(o.href){const a=element(doc,'a','',o.title);a.href=o.href;h.append(a);}else h.textContent=o.title;body.append(h);
 if(o.description)body.append(element(doc,'p','mh-content-description',o.description));
 if(o.status){const status=element(doc,'span','mh-content-status',o.status.label);status.dataset.tone=o.status.tone;body.append(status);}
 if(o.progress!==undefined){const label=element(doc,'label','mh-content-progress-label',o.progressLabel+' · '+o.progress+'%');const progress=element(doc,'progress','');progress.max=100;progress.value=o.progress;label.append(progress);body.append(label);}
 if(o.meta?.length){const ul=element(doc,'ul','mh-content-meta');for(const m of o.meta)ul.append(element(doc,'li','',m));body.append(ul);}
 if(o.action){const b=element(doc,'button','mh-content-action',o.action.label);b.type='button';b.addEventListener('click',o.action.onClick);listeners.set(root,{button:b,handler:o.action.onClick});body.append(b);}
 return root;}
function mount(host,options,kind){host=resolveHost(host);let dead=false;let root=render(host.ownerDocument,validateContent(options),kind);host.replaceChildren(root);return {get element(){return root;},update(next){if(dead)throw new Error('Content destroyed');const replacement=render(host.ownerDocument,validateContent(next),kind);release(root);root.replaceWith(replacement);root=replacement;},destroy(){release(root);root.remove();dead=true;}};}
export function mountCard(host,options){return mount(host,options,'card');}
export function mountRow(host,options){return mount(host,options,'row');}
export function mountSection(host,{title,description='',headingLevel=2}){host=resolveHost(host);validateContent({title,description,headingLevel});const doc=host.ownerDocument;const root=element(doc,'section','mh-content-kit mh-content-section');root.append(element(doc,'h'+headingLevel,'mh-content-title',title));if(description)root.append(element(doc,'p','mh-content-description',description));const status=element(doc,'div','mh-content-state');status.setAttribute('role','status');status.hidden=true;const region=element(doc,'div','mh-content-region');root.append(status,region);host.replaceChildren(root);let dead=false;return{element:root,region,setState(state,message=''){if(dead)throw new Error('Section destroyed');if(!['content','loading','empty','error','partial'].includes(state)||typeof message!=='string'||message.length>4000)throw new TypeError('Invalid section state');if(state!=='content'&&!message.trim())throw new TypeError('State message required');root.setAttribute('aria-busy',String(state==='loading'));region.hidden=!['content','partial'].includes(state);status.hidden=state==='content';status.textContent=message;root.dataset.state=state;},destroy(){root.remove();dead=true;}};}
