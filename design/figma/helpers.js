// Run in use_figma after selecting one page. Source values are the code token graph.
const changed=[];
function track(n){changed.push(n.id);return n}
const vars=await figma.variables.getLocalVariablesAsync(),collections=await figma.variables.getLocalVariableCollectionsAsync(),styles=await figma.getLocalTextStylesAsync();
const theme=collections.find(c=>c.name==='Muhit/grove/light');
function variable(path,collection=theme){return vars.find(v=>v.variableCollectionId===collection.id&&v.name===path)}
function paint(n,key,field='fills',collection=theme){const v=variable(key,collection);if(!v)throw Error('Missing '+key);n[field]=[figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',v)]}
function bind(n,key,path){n.setBoundVariable(key,variable(path))}
await figma.loadFontAsync({family:'Manrope',style:'Regular'});await figma.loadFontAsync({family:'Manrope',style:'SemiBold'});await figma.loadFontAsync({family:'Source Serif 4',style:'Regular'});
async function text(parent,value,style='Body',width=280,key='semantic/color/text/primary'){const t=track(figma.createText());t.name=value.slice(0,60);t.fontName={family:'Manrope',style:'Regular'};t.characters=value;await t.setTextStyleIdAsync(styles.find(s=>s.name==='Muhit/'+style).id);t.textAutoResize='HEIGHT';t.resize(width,t.height);paint(t,key);parent.appendChild(t);return t}
function stack(parent,name,width=320){const n=track(figma.createAutoLayout('VERTICAL'));n.name=name;n.resize(width,100);n.primaryAxisSizingMode='AUTO';n.counterAxisSizingMode='FIXED';n.fills=[];bind(n,'itemSpacing','primitive/space/4');parent.appendChild(n);return n}
function panel(parent,name,width=320){const n=stack(parent,name,width);for(const k of ['paddingTop','paddingBottom','paddingLeft','paddingRight'])bind(n,k,'component/card/padding');bind(n,'cornerRadius','component/card/radius');paint(n,'component/card/background');paint(n,'semantic/color/border/default','strokes');return n}
function rect(parent,w,h,color){const n=track(figma.createRectangle());n.resize(w,h);paint(n,color);parent.appendChild(n);return n}
