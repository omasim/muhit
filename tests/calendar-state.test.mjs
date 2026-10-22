import test from 'node:test';
import assert from 'node:assert/strict';
import {calendarCandidate,calendarEditIsStale} from '../src/calendar-state.mjs';
const base={id:'a',title:'Before',description:'Context',resource:'Room',start:'2026-10-22T09:00:00.000Z',end:'2026-10-22T10:00:00.000Z'};
test('calendar editing preserves metadata while clearing resource intentionally',()=>{
 const next=calendarCandidate(base,{id:'a',title:'After',start:'2026-10-22T09:00',end:'2026-10-22T10:00',resource:''},'UTC');
 assert.equal(next.description,'Context');assert.equal(next.resource,undefined);assert.equal(base.resource,'Room');
});
test('calendar conflict compares values independent of JSON key order',()=>{
 const reordered=Object.fromEntries(Object.entries(base).reverse());assert.equal(calendarEditIsStale([reordered],'a',base),false);
 assert.equal(calendarEditIsStale([{...base,description:'Changed'}],'a',base),true);assert.equal(calendarEditIsStale([],'a',base),true);
});
