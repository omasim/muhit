const page=await figma.getNodeByIdAsync('3:192');await figma.setCurrentPageAsync(page);
// @helpers
if(page.children.length)throw Error('Pages already composed; inspect before updating');
const recipes=RECIPES,mappings=MAPPINGS,boards=[];
async function instance(parent,id){const entry=mappings.find(c=>c.id===id),base=await figma.getNodeByIdAsync(entry.variants[0].id),n=track(base.createInstance());parent.appendChild(n);for(const child of n.findAll())changed.push(child.id);return n}
for(const [index,recipe]of recipes.entries()){
 const board=panel(page,recipe.id+' · Desktop composition',1240);board.x=100+(index%2)*1340;board.y=100+Math.floor(index/2)*1100;paint(board,'semantic/color/surface/canvas');boards.push({id:board.id,recipe:recipe.id});await text(board,recipe.label,'Display',1160);await text(board,recipe.description,'Body',1160);await text(board,'Tarif: '+recipe.id+' · Bölgeler: '+recipe.regions.join(' / '),'Small',1160);
 const content=track(figma.createAutoLayout('HORIZONTAL'));content.name='Content and context';content.fills=[];bind(content,'itemSpacing','primitive/space/5');board.appendChild(content);const main=stack(content,'Main',760),rail=stack(content,'Context rail',352);
 const inventory={overview:['metric','chart','card'],collection:['datagrid','pagination'],detail:['card','timeline'],settings:['form','notice'],workspace:['kanban','tree'],editorial:['card','accordion']};
 for(const name of inventory[recipe.id]||['card'])await instance(main,name);await instance(rail,recipe.id==='settings'?'notice':'card');
 await text(board,'Yükleniyor, boş, hata, erişim ve kısmi sonuç durumlarında bölge DOM’u ve uyumlu taslaklar korunur. Çalışan responsive örnek: '+recipe.example.replace('../',''),'Small',1160);
}
return {createdNodeIds:changed,boards,instances:page.findAllWithCriteria({types:['INSTANCE']}).length};
