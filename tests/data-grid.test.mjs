import test from "node:test";
import assert from "node:assert/strict";
import { MuhitDataGrid as G, MuhitAgent as A } from "../src/index.mjs";
const cols = G.validateColumns([
  { key: "title", label: "Ad" },
  { key: "amount", label: "Tutar", type: "number" },
  { key: "date", label: "Tarih", type: "date" },
]);
test("generic data validates dates, unique ids, nullable values and numeric types", () => {
  assert.throws(() => G.validateRows([{ id: "a", amount: "4" }], cols));
  assert.throws(() => G.validateRows([{ id: "a", date: "2026-02-30" }], cols));
  assert.throws(() => G.validateRows([{ id: "a" }, { id: "a" }], cols));
  assert.equal(
    G.validateRows([{ id: "a", amount: null }], cols)[0].amount,
    null,
  );
});
test("generic search, numeric sorting and paging preserve input", () => {
  const rows = G.validateRows(
    [
      { id: "a", title: "İnsan", amount: 10 },
      { id: "b", title: "İnsan", amount: 2 },
      { id: "c", title: "Doğa", amount: 9 },
    ],
    cols,
  );
  const result = G.query(rows, cols, {
    query: "insan",
    sort: "amount",
    direction: "asc",
    page: 1,
    pageSize: 5,
  });
  assert.deepEqual(
    result.rows.map((x) => x.id),
    ["b", "a"],
  );
  assert.equal(rows[0].id, "a");
});
test("rich cards and page accept only explicit safe enums", () => {
  const spec = {
    schemaVersion: "1.0.0",
    page: { title: "Çalışma", layout: "grid" },
    components: [
      {
        type: "card",
        id: "a",
        title: "<script>x</script>",
        variant: "horizontal",
        state: "loading",
        meta: "Kaynak",
      },
    ],
  };
  assert.equal(A.validate(spec).valid, true);
  spec.components[0].state = "onclick";
  assert.equal(A.validate(spec).valid, false);
  spec.components[0].state = "error";
  spec.page.url = "https://example.com";
  assert.equal(A.validate(spec).valid, false);
});
