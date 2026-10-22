import test from "node:test";
import assert from "node:assert/strict";
import {
  createSearchIndex,
  createSearchIndexAsync,
} from "../src/search-index.mjs";
import { notifyObserver } from "../src/observers.mjs";
test("observer throws and rejections are diagnostics, not operation failures", async () => {
  const errors = [];
  for (const async of [false, true]) {
    notifyObserver(
      {
        onChange: () => {
          if (async) return Promise.reject(Error("observer"));
          throw Error("observer");
        },
        onObserverError: (e, name) => errors.push([e.message, name]),
      },
      "onChange",
      [],
    );
  }
  await new Promise((r) => setTimeout(r, 0));
  assert.deepEqual(errors, [
    ["observer", "onChange"],
    ["observer", "onChange"],
  ]);
});
test("yielding index matches synchronous search and cancellation stops construction", async () => {
  const rows = Array.from({ length: 10000 }, (_, i) => ({
    id: String(i),
    title: "İnsan research " + i,
  }));
  let ticks = 0;
  const timer = setInterval(() => ticks++, 0);
  const index = await createSearchIndexAsync(rows, { sliceMs: 1 });
  clearInterval(timer);
  assert.ok(ticks > 0);
  assert.deepEqual(
    index.search("insan", { page: 2 }),
    createSearchIndex(rows).search("insan", { page: 2 }),
  );
  const abort = new AbortController();
  setTimeout(() => abort.abort(), 0);
  await assert.rejects(
    createSearchIndexAsync(rows, { sliceMs: 1, signal: abort.signal }),
    { name: "AbortError" },
  );
  await assert.rejects(createSearchIndexAsync([{ id: "a" }, { id: "a" }]));
});

import {labels} from '../src/suite-core.mjs';import de from '../locales/de.mjs';import ar from '../locales/ar.mjs';
test('shared module catalogs cover inherited labels',()=>{for(const catalog of [de,ar])for(const key of Object.values(labels.tr))assert.ok(catalog[key],key);});
import {evaluatePerformance} from '../tools/performance-policy.mjs';import {readFile} from 'node:fs/promises';
test('build and responsiveness budgets cannot pass with fast queries alone',async()=>{const budgets=JSON.parse(await readFile(new URL('../schemas/performance-budgets.json',import.meta.url)));for(const local of [{p95Ms:1,buildMs:2500,maxGapMs:1},{p95Ms:1,buildMs:1,maxGapMs:60}])assert.equal(evaluatePerformance({local,remote:{p95Ms:1}},budgets).passed,false);});
