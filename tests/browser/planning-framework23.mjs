import assert from 'node:assert/strict';
export async function checkPlanningFramework(page){
 const panel=page.getByTestId('planning-extension');
 await panel.getByLabel('Event title',{exact:true}).fill('Framework series');
 await panel.getByLabel('Start (UTC)',{exact:true}).fill('2026-10-22T09:00');
 await panel.getByLabel('End (UTC)',{exact:true}).fill('2026-10-22T10:00');
 await panel.getByLabel('Resource / room',{exact:true}).fill('Studio');
 await panel.getByRole('button',{name:'Apply weekly example',exact:true}).click();
 await panel.getByTestId('adapter-status').filter({hasText:'Applied 2'}).waitFor();
 await panel.getByRole('button',{name:'Apply weekly example',exact:true}).click();
 await panel.getByRole('button',{name:'Apply weekly example',exact:true}).click();
 assert.match(await panel.getByTestId('adapter-status').textContent(),/Cannot apply/);
 await panel.getByLabel('New block type',{exact:true}).selectOption('paragraph');
 await panel.getByRole('button',{name:'Add block',exact:true}).click();
 const area=panel.locator('textarea[data-block]').first();await area.fill('Shared thinking');await area.evaluate(e=>{e.focus();e.setSelectionRange(0,6)});
 await panel.locator('[data-action=bold]').first().click();assert.equal(await panel.locator('.mh-document-preview strong').textContent(),'Shared');
 await panel.getByRole('button',{name:'Export JSON',exact:true}).click();const exchange=panel.getByLabel('Document JSON exchange',{exact:true}),json=await exchange.inputValue();
 await exchange.fill('{bad');await panel.getByRole('button',{name:'Import JSON draft',exact:true}).click();assert.equal(await area.inputValue(),'Shared thinking');await exchange.fill(json);await panel.getByRole('button',{name:'Import JSON draft',exact:true}).click();
 await page.route('https://example.com/framework.svg',r=>r.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="green"/></svg>'}));
 await panel.getByLabel('New block type',{exact:true}).selectOption('image');await panel.getByRole('button',{name:'Add block',exact:true}).click();await panel.getByLabel('Image alternative text',{exact:true}).fill('A green square');await panel.locator('input[data-url]').last().fill('https://example.com/framework.svg');await panel.locator('[data-action=apply-url]').last().click();assert.equal(await panel.locator('.mh-document-preview img').getAttribute('alt'),'A green square');
 await page.route('**/api/resources?**',r=>{const pageNumber=Number(new URL(r.request().url()).searchParams.get('page'));return r.fulfill({json:{page:pageNumber,pageSize:2,total:4,items:[0,1].map(i=>({id:'r'+((pageNumber-1)*2+i),title:'Resource '+((pageNumber-1)*2+i)}))}})});
 await panel.getByRole('button',{name:'Search remote resources',exact:true}).click();await panel.getByTestId('adapter-status').filter({hasText:'Page 1'}).waitFor();await panel.getByRole('button',{name:'Next resource page',exact:true}).click();await panel.getByTestId('adapter-status').filter({hasText:'Page 2'}).waitFor();assert.equal(await panel.getByTestId('adapter-results').locator('li').first().textContent(),'Resource 2');
 await page.unroute('**/api/resources?**');await page.route('**/api/resources?**',r=>r.fulfill({status:503,body:'Unavailable'}));await panel.getByRole('button',{name:'Search remote resources',exact:true}).click();await panel.getByTestId('adapter-status').filter({hasText:'Search failed'}).waitFor();assert.equal(await panel.getByTestId('adapter-results').locator('li').count(),2);
 await page.unroute('**/api/resources?**');await page.route('**/api/resources?**',async r=>{await new Promise(resolve=>setTimeout(resolve,150));await r.fulfill({json:{items:[],total:0,page:1,pageSize:2}}).catch(()=>{});});await panel.getByRole('button',{name:'Search remote resources',exact:true}).click();await panel.getByRole('button',{name:'Cancel remote search',exact:true}).click();await page.waitForTimeout(200);assert.match(await panel.getByTestId('adapter-status').textContent(),/Cancelled/);assert.equal(await panel.getByTestId('adapter-results').locator('li').count(),2);
 await page.unroute('**/api/resources?**');
}
