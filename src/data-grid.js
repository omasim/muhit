/* Muhit UI generic data grid. Local data or application-owned async provider. */
(function (global) {
  "use strict";
  const instances = new WeakMap();
  function columnsOf(columns) {
    if (!Array.isArray(columns) || !columns.length || columns.length > 30)
      throw new TypeError("1–30 sütun gerekli.");
    const ids = new Set();
    return columns.map((c) => {
      if (
        !c ||
        Object.keys(c).some(
          (k) => !["key", "label", "type", "sortable", "editable"].includes(k),
        ) ||
        (c.sortable !== undefined && typeof c.sortable !== "boolean") ||
        (c.editable !== undefined && typeof c.editable !== "boolean") ||
        ["constructor", "prototype", "__proto__"].includes(c.key) ||
        typeof c.key !== "string" ||
        !/^[a-zA-Z][\w-]{0,63}$/.test(c.key) ||
        ids.has(c.key) ||
        typeof c.label !== "string" ||
        !c.label.trim()
      )
        throw new TypeError("Geçersiz veya yinelenen sütun.");
      ids.add(c.key);
      if (c.type && !["text", "number", "date"].includes(c.type))
        throw new TypeError("Geçersiz sütun türü.");
      return {
        key: c.key,
        label: c.label,
        type: c.type || "text",
        sortable: c.sortable !== false,
        editable: c.editable === true,
      };
    });
  }
  function rowsOf(rows, columns) {
    if (!Array.isArray(rows) || rows.length > 100000)
      throw new TypeError("En fazla 100000 satır desteklenir.");
    const ids = new Set();
    return rows.map((r) => {
      if (!r || typeof r.id !== "string" || !r.id || ids.has(r.id))
        throw new TypeError("Satır kimlikleri benzersiz metin olmalı.");
      ids.add(r.id);
      const result = { id: r.id };
      columns.forEach((c) => {
        const v = r[c.key];
        if (v === null || v === undefined) {
          result[c.key] = null;
          return;
        }
        if (
          c.type === "number"
            ? typeof v !== "number" || !Number.isFinite(v)
            : typeof v !== "string"
        )
          throw new TypeError(c.key + " veri türü uyuşmuyor.");
        if (
          c.type === "date" &&
          (!/^\d{4}-\d{2}-\d{2}$/.test(v) ||
            new Date(v + "T12:00:00Z").toISOString().slice(0, 10) !== v)
        )
          throw new TypeError("Gerçek YYYY-MM-DD tarihi gerekli.");
        result[c.key] = v;
      });
      return result;
    });
  }
  function query(rows, columns, state) {
    const needle = state.query.toLocaleLowerCase(state.locale || "tr-TR");
    const result = rows.filter(
      (r) =>
        Object.entries(state.filters || {}).every(([key, value]) =>
          String(r[key] ?? "")
            .toLocaleLowerCase(state.locale || "tr-TR")
            .includes(String(value).toLocaleLowerCase(state.locale || "tr-TR")),
        ) &&
        columns.some((c) =>
          String(r[c.key] ?? "")
            .toLocaleLowerCase(state.locale || "tr-TR")
            .includes(needle),
        ),
    );
    const col = columns.find((c) => c.key === state.sort);
    if (col)
      result.sort((a, b) => {
        const x = a[col.key],
          y = b[col.key];
        if (x === null) return y === null ? 0 : 1;
        if (y === null) return -1;
        const cmp =
          col.type === "number"
            ? x - y
            : String(x).localeCompare(String(y), state.locale || "tr-TR");
        return state.direction === "desc" ? -cmp : cmp;
      });
    return {
      rows: result.slice(
        (state.page - 1) * state.pageSize,
        state.page * state.pageSize,
      ),
      total: result.length,
    };
  }
  function mount(host, options = {}) {
    let columns = columnsOf(options.columns);
    const locale = options.locale || "tr-TR";
    new Intl.NumberFormat(locale);
    const en = locale.startsWith("en");
    const t = (tr, eng) => (en ? eng : tr);
    const selected = new Set();
    let visibleKeys = columns.map((c) => c.key),
      currentRows = [];
    const selectionChanged = () => options.onSelectionChange?.([...selected]);
    let rows = rowsOf(options.rows || [], columns);
    if (options.load !== undefined && typeof options.load !== "function")
      throw new TypeError("load işlev olmalı.");
    if (
      options.onStateChange !== undefined &&
      typeof options.onStateChange !== "function"
    )
      throw new TypeError("onStateChange işlev olmalı.");
    if (options.load && options.rows)
      throw new TypeError("rows veya load seçin.");
    const initial = {
      query: "",
      sort: "",
      direction: "asc",
      page: 1,
      pageSize: 10,
      filters: {},
      locale,
      ...options.state,
    };
    function validateState(s) {
      if (
        !s.filters ||
        typeof s.filters !== "object" ||
        Array.isArray(s.filters) ||
        Object.entries(s.filters).some(
          ([k, v]) =>
            !columns.some((c) => c.key === k) || typeof v !== "string",
        )
      )
        throw new TypeError("Geçersiz sütun filtresi.");
      if (typeof s.locale !== "string") throw new TypeError("Geçersiz locale.");
      new Intl.NumberFormat(s.locale);
      if (
        typeof s.query !== "string" ||
        s.query.length > 500 ||
        !["asc", "desc"].includes(s.direction) ||
        !Number.isInteger(s.page) ||
        s.page < 1 ||
        ![5, 10, 25, 50].includes(s.pageSize) ||
        (s.sort && !columns.some((c) => c.key === s.sort && c.sortable))
      )
        throw new TypeError("Geçersiz tablo durumu.");
      return { ...s, filters: { ...s.filters } };
    }
    let state = validateState(initial),
      destroyed = false,
      serial = 0,
      controller,
      total = 0;
    const el = typeof host === "string" ? document.querySelector(host) : host;
    if (!el) throw new TypeError("Kapsayıcı bulunamadı.");
    instances.get(el)?.destroy();
    const doc = el.ownerDocument;
    const node = (tag, cls, text) => {
      const n = doc.createElement(tag);
      if (tag === "button") n.type = "button";
      n.className = cls;
      if (text !== undefined) n.textContent = text;
      return n;
    };
    const root = node("section", "mh-scope mh-data-grid"),
      title = node("h2", "mh-panel__title", options.title || "Kayıtlar");
    const selectedLabel = node("p", "mh-small");
    selectedLabel.setAttribute("role", "status");
    const columnsMenu = node("details", "mh-grid-columns"),
      menuTitle = node("summary", "mh-button", t("Sütunlar", "Columns"));
    columnsMenu.append(menuTitle);
    columns.forEach((c) => {
      const label = node("label", "mh-check"),
        check = node("input", "");
      check.type = "checkbox";
      check.checked = true;
      check.onchange = () => {
        const keys = check.checked
          ? [...visibleKeys, c.key]
          : visibleKeys.filter((k) => k !== c.key);
        if (!keys.length) {
          check.checked = true;
          return;
        }
        api.setVisibleColumns(keys);
      };
      label.append(check, doc.createTextNode(c.label));
      columnsMenu.append(label);
    });
    const tools = node("div", "mh-page__toolbar"),
      search = node("input", "mh-input");
    search.type = "search";
    search.placeholder = t("Kayıtlarda ara", "Search records");
    search.setAttribute("aria-label", t("Kayıtlarda ara", "Search records"));
    search.value = state.query;
    const label = node(
        "label",
        "mh-small",
        t("Sayfa başına ", "Rows per page "),
      ),
      size = node("select", "mh-select");
    [5, 10, 25, 50].forEach((n) => {
      const o = node("option", "", String(n));
      o.value = n;
      size.append(o);
    });
    size.value = state.pageSize;
    label.append(size);
    tools.append(search, label, columnsMenu);
    const status = node("p", "mh-small");
    status.setAttribute("role", "status");
    const scroll = node("div", "mh-data-grid__scroll");
    scroll.tabIndex = 0;
    scroll.setAttribute("role", "region");
    scroll.setAttribute(
      "aria-label",
      (options.title || "Kayıtlar") + " tablo alanı",
    );
    const table = node("table", "mh-table"),
      caption = node(
        "caption",
        "mh-small",
        options.description || "Uygulamanın sağladığı kayıtlar",
      );
    table.append(caption);
    const head = node("thead", ""),
      hr = node("tr", "");
    head.append(hr);
    table.append(head);
    const body = node("tbody", "");
    table.append(body);
    scroll.append(table);
    const heads = [];
    let allSelect;
    if (options.selectable) {
      const th = node("th", "");
      allSelect = node("input", "");
      allSelect.type = "checkbox";
      allSelect.setAttribute(
        "aria-label",
        t("Bu sayfayı seç", "Select this page"),
      );
      allSelect.onchange = () => {
        currentRows.forEach((r) =>
          allSelect.checked ? selected.add(r.id) : selected.delete(r.id),
        );
        selectionChanged();
        refresh();
      };
      th.append(allSelect);
      hr.append(th);
    }
    columns.forEach((c) => {
      const th = node("th", "");
      th.scope = "col";
      const b = node("button", "mh-button mh-button--quiet", c.label);
      b.disabled = !c.sortable;
      b.onclick = () =>
        change({
          sort: c.key,
          direction:
            state.sort === c.key && state.direction === "asc" ? "desc" : "asc",
          page: 1,
        });
      th.append(b);
      hr.append(th);
      heads.push([c, th]);
    });
    const nav = node("div", "mh-page__toolbar"),
      prev = node("button", "mh-button", t("Önceki", "Previous")),
      next = node("button", "mh-button", t("Sonraki", "Next")),
      position = node("span", "mh-small");
    prev.onclick = () => change({ page: state.page - 1 });
    next.onclick = () => change({ page: state.page + 1 });
    nav.append(prev, position, next);
    const retry = node("button", "mh-button", t("Yeniden dene", "Retry"));
    retry.hidden = true;
    retry.onclick = () => refresh();
    root.append(title, tools, status, selectedLabel, retry, scroll, nav);
    el.append(root);
    function notify() {
      options.onStateChange?.({ ...state, filters:{...state.filters} });
    }
    function change(patch) {
      state = validateState({ ...state, ...patch });
      search.value = state.query;
      size.value = state.pageSize;
      notify();
      refresh();
    }
    async function refresh() {
      if (destroyed) return;
      const ticket = ++serial;
      controller?.abort();
      controller = new AbortController();
      retry.hidden = true;
      root.setAttribute("aria-busy", "true");
      status.textContent = t("Yükleniyor…", "Loading…");
      body.replaceChildren();
      prev.disabled = next.disabled = true;
      try {
        let result = options.load
          ? await options.load({ ...state, filters:{...state.filters} }, controller.signal)
          : query(rows, columns, state);
        if (destroyed || ticket !== serial) return;
        if (!result || !Number.isInteger(result.total) || result.total < 0)
          throw new TypeError("load: rows ve toplam kayıt sayısı gerekli.");
        const data = rowsOf(result.rows, columns);
        if (data.length > state.pageSize || data.length > result.total)
          throw new TypeError("Sayfa büyüklüğü veya toplam tutarsız.");
        total = result.total;
        const pages = Math.max(1, Math.ceil(total / state.pageSize));
        if (state.page > pages) {
          state.page = pages;
          notify();
          return refresh();
        }
        currentRows = data;
        selectedLabel.textContent = options.selectable
          ? t(
              `${selected.size} kayıt seçili`,
              `${selected.size} records selected`,
            )
          : "";
        if (allSelect) {
          const count = data.filter((r) => selected.has(r.id)).length;
          allSelect.checked = !!data.length && count === data.length;
          allSelect.indeterminate = count > 0 && count < data.length;
          allSelect.disabled = !data.length;
        }
        heads.forEach(([c, th]) => (th.hidden = !visibleKeys.includes(c.key)));
        data.forEach((row) => {
          const tr = node("tr", "");
          if (options.selectable) {
            const td = node("td", ""),
              check = node("input", "");
            check.type = "checkbox";
            check.checked = selected.has(row.id);
            check.setAttribute(
              "aria-label",
              t("Kaydı seç: ", "Select record: ") + row.id,
            );
            check.onchange = () => {
              check.checked ? selected.add(row.id) : selected.delete(row.id);
              selectionChanged();
              refresh();
            };
            td.append(check);
            tr.append(td);
          }
          columns.forEach((c) => {
            const td = node(
              "td",
              "",
              row[c.key] === null
                ? "—"
                : c.type === "number"
                  ? new Intl.NumberFormat(locale).format(row[c.key])
                  : String(row[c.key]),
            );
            td.hidden = !visibleKeys.includes(c.key);
            if (c.editable && !options.load) {
              const input = node("input", "mh-input");
              input.type =
                c.type === "number"
                  ? "number"
                  : c.type === "date"
                    ? "date"
                    : "text";
              input.setAttribute("aria-label", c.label + " · " + row.id);
              input.value = row[c.key] ?? "";
              if (c.type === "number") input.step = "any";
              input.onchange = () => {
                try {
                  api.updateCell(
                    row.id,
                    c.key,
                    c.type === "number"
                      ? input.value === ""
                        ? null
                        : Number(input.value)
                      : input.value,
                  );
                  input.setAttribute("aria-invalid", "false");
                } catch {
                  input.setAttribute("aria-invalid", "true");
                  status.textContent = t(
                    "Geçersiz hücre değeri. Önceki kayıt korundu.",
                    "Invalid cell value. Previous record preserved.",
                  );
                }
              };
              td.replaceChildren(input);
            }
            tr.append(td);
          });
          body.append(tr);
        });
        status.textContent = total
          ? t(
              `${total} kayıt · Bu sayfada ${data.length} kayıt`,
              `${total} records · ${data.length} on this page`,
            )
          : t(
              "Sonuç bulunamadı. Aramanı değiştirebilirsin.",
              "No results. Try changing your search.",
            );
        position.textContent = `${state.page} / ${pages}`;
        prev.disabled = state.page === 1;
        next.disabled = state.page >= pages;
        heads.forEach(([c, th]) =>
          th.setAttribute(
            "aria-sort",
            state.sort === c.key
              ? state.direction === "asc"
                ? "ascending"
                : "descending"
              : "none",
          ),
        );
      } catch (error) {
        if (destroyed || ticket !== serial) return;
        status.textContent = t(
          "Kayıtlar yüklenemedi. Yeniden deneyebilirsin.",
          "Unable to load records. Please retry.",
        );
        retry.hidden = false;
        position.textContent = "";
      } finally {
        if (!destroyed && ticket === serial)
          root.setAttribute("aria-busy", "false");
      }
    }
    let timer;
    search.oninput = () => {
      clearTimeout(timer);
      timer = setTimeout(() => change({ query: search.value, page: 1 }), 200);
    };
    size.onchange = () => change({ pageSize: Number(size.value), page: 1 });
    const api = {
      getState: () => ({ ...state, filters: { ...state.filters } }),
      getSelected: () => [...selected],
      clearSelection() {
        selected.clear();
        selectionChanged();
        refresh();
      },
      setVisibleColumns(keys) {
        if (
          !Array.isArray(keys) ||
          !keys.length ||
          new Set(keys).size !== keys.length ||
          keys.some((k) => !columns.some((c) => c.key === k))
        )
          throw new TypeError("Geçersiz sütun listesi.");
        visibleKeys = [...keys];
        columnsMenu
          .querySelectorAll("input")
          .forEach(
            (input, i) => (input.checked = keys.includes(columns[i].key)),
          );
        refresh();
        return api;
      },
      updateCell(id, key, value) {
        if (destroyed) throw new Error("Tablo kaldırıldı.");
        if (options.load) throw new Error("Uzaktan veriyi uygulama günceller.");
        if (
          !columns.some((c) => c.key === key && c.editable) ||
          !rows.some((r) => r.id === id)
        )
          throw new TypeError("Düzenlenebilir hücre bulunamadı.");
        const next = rowsOf(
          rows.map((r) => (r.id === id ? { ...r, [key]: value } : r)),
          columns,
        );
        rows = next;
        options.onRowsChange?.(
          rows.map((r) => ({ ...r })),
          { id, key, value },
        );
        refresh();
        return api;
      },
      toCSV({ selectedOnly = false } = {}) {
        const source = options.load
          ? currentRows
          : query(rows, columns, {
              ...state,
              page: 1,
              pageSize: Number.MAX_SAFE_INTEGER,
            }).rows;
        const visible = columns.filter((c) => visibleKeys.includes(c.key));
        const cell = (v) =>
          '"' +
          String(v ?? "")
            .replace(/^[=+@\-\t\r]/, "'$&")
            .replaceAll('"', '""') +
          '"';
        return (
          "\uFEFF" +
          [
            visible.map((c) => cell(c.label)).join(","),
            ...source
              .filter((r) => !selectedOnly || selected.has(r.id))
              .map((r) => visible.map((c) => cell(r[c.key])).join(",")),
          ].join("\r\n")
        );
      },
      setState(patch) {
        if (destroyed) throw new Error("Tablo kaldırıldı.");
        change(patch);
        return api;
      },
      setRows(nextRows) {
        if (destroyed) throw new Error("Tablo kaldırıldı.");
        if (options.load)
          throw new Error("Uzaktan veri tablosunda refresh kullanın.");
        const next = rowsOf(nextRows, columns);
        rows = next;
        for (const id of selected)
          if (!rows.some((r) => r.id === id)) selected.delete(id);
        selectionChanged();
        refresh();
        return api;
      },
      refresh,
      destroy() {
        if (destroyed) return;
        destroyed = true;
        ++serial;
        controller?.abort();
        clearTimeout(timer);
        root.remove();
        instances.delete(el);
      },
    };
    instances.set(el, api);
    refresh();
    return api;
  }
  global.MuhitDataGrid = Object.freeze({
    mount,
    validateColumns: columnsOf,
    validateRows: rowsOf,
    query,
  });
})(globalThis);
