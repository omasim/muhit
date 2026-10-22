/** Prepared search; asynchronous construction yields between bounded slices. */
function prepare(
  rows,
  { fields = ["title"], locale = "tr", maxRows = 100000 } = {},
) {
  if (
    !Array.isArray(rows) ||
    rows.length > maxRows ||
    !Number.isInteger(maxRows) ||
    maxRows < 1 ||
    maxRows > 500000 ||
    !Array.isArray(fields) ||
    !fields.length ||
    fields.some((k) => typeof k !== "string")
  )
    throw TypeError("Invalid search index");
  const source = [],
    keys = [],
    seen = new Set();
  return {
    add(row) {
      if (!row || typeof row.id !== "string" || seen.has(row.id))
        throw TypeError("Unique row IDs required");
      seen.add(row.id);
      const copy = structuredClone(row);
      source.push(copy);
      keys.push(
        fields
          .map((k) => String(copy[k] ?? "").toLocaleLowerCase(locale))
          .join("\u0000"),
      );
    },
    finish() {
      return {
        size: source.length,
        search(query, { page = 1, pageSize = 25 } = {}) {
          if (
            typeof query !== "string" ||
            query.length > 500 ||
            !Number.isInteger(page) ||
            page < 1 ||
            !Number.isInteger(pageSize) ||
            pageSize < 1 ||
            pageSize > 100
          )
            throw TypeError("Invalid page query");
          const needle = query.toLocaleLowerCase(locale),
            items = [];
          let total = 0;
          for (let i = 0; i < keys.length; i++)
            if (keys[i].includes(needle)) {
              if (total >= (page - 1) * pageSize && items.length < pageSize)
                items.push(structuredClone(source[i]));
              total++;
            }
          return { items, total, page, pageSize };
        },
      };
    },
  };
}
export function createSearchIndex(rows, options = {}) {
  const builder = prepare(rows, options);
  rows.forEach((row) => builder.add(row));
  return builder.finish();
}
export async function createSearchIndexAsync(rows, options = {}) {
  const { signal, sliceMs = 8 } = options;
  if (!Number.isFinite(sliceMs) || sliceMs < 1 || sliceMs > 16)
    throw TypeError("sliceMs must be between 1 and 16");
  const check = () => {
    if (signal?.aborted)
      throw signal.reason ?? new DOMException("Aborted", "AbortError");
  };
  check();
  const builder = prepare(rows, options);
  let start = performance.now();
  // Caller owns the input until resolution; do not mutate rows while building.
  for (let i = 0; i < rows.length; i++) {
    check();
    builder.add(rows[i]);
    if (performance.now() - start >= sliceMs) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      check();
      start = performance.now();
    }
  }
  check();
  return builder.finish();
}
export function createRemoteSearch(loader) {
  if (typeof loader !== "function") throw TypeError("Loader required");
  let controller,
    revision = 0,
    dead = false;
  return {
    async search(query, { page = 1, pageSize = 25 } = {}) {
      if (dead) throw Error("Destroyed");
      if (
        typeof query !== "string" ||
        query.length > 500 ||
        !Number.isInteger(page) ||
        page < 1 ||
        !Number.isInteger(pageSize) ||
        pageSize < 1 ||
        pageSize > 100
      )
        throw TypeError("Invalid page query");
      const current = ++revision;
      controller?.abort();
      controller = new AbortController();
      try {
        const value = await loader(
          { query, page, pageSize },
          controller.signal,
        );
        if (dead || current !== revision) return null;
        if (
          !value ||
          !Array.isArray(value.items) ||
          value.items.length > pageSize ||
          !Number.isSafeInteger(value.total) ||
          value.total < 0 ||
          value.items.length > value.total ||
          (value.items.length &&
            (page - 1) * pageSize + value.items.length > value.total) ||
          value.page !== page ||
          value.pageSize !== pageSize
        )
          throw TypeError("Invalid server page");
        return structuredClone(value);
      } catch (error) {
        if (dead || current !== revision) return null;
        throw error;
      }
    },
    cancel() {
      revision++;
      controller?.abort();
    },
    destroy() {
      dead = true;
      revision++;
      controller?.abort();
    },
  };
}
