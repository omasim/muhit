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
  function layoutOf(value, columns) {
    if (
      !Array.isArray(value) ||
      value.length !== columns.length ||
      new Set(value.map((c) => c?.key)).size !== columns.length ||
      value.some(
        (c) =>
          !c ||
          Object.keys(c).some((k) => !["key", "width", "pin"].includes(k)) ||
          !columns.some((x) => x.key === c.key) ||
          !Number.isInteger(c.width) ||
          c.width < 120 ||
          c.width > 800 ||
          ![null, "start", "end"].includes(c.pin),
      )
    )
      throw new TypeError("Invalid column layout");
    return value.map((c) => ({ ...c }));
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
    const locale = options.locale || global.MuhitI18n?.getLocale() || "tr-TR";
    new Intl.NumberFormat(locale);
    const en = locale.startsWith("en");
    const i18n = global.MuhitI18n?.create({ ...options, locale });
    const t = (tr, eng, params = {}) =>
      i18n
        ? i18n.text(tr, eng, params)
        : (en ? eng : tr).replace(/\{(\w+)\}/g, (_, key) =>
            String(params[key] ?? "{" + key + "}"),
          );
    const selected = new Set();
    let visibleKeys = columns.map((c) => c.key),
      currentRows = [];
    let layout = columns.map((c) => ({ key: c.key, width: 200, pin: null }));
    const validateLayout = (value) => layoutOf(value, columns);
    if (options.columnLayout) layout = validateLayout(options.columnLayout);
    const ordered = () =>
      ["start", null, "end"].flatMap((pin) =>
        layout.filter((c) => c.pin === pin),
      );
    const selectionChanged = () => options.onSelectionChange?.([...selected]);
    let rows = rowsOf(options.rows || [], columns);
    if (options.load !== undefined && typeof options.load !== "function")
      throw new TypeError("load işlev olmalı.");
    for (const key of [
      "onStateChange",
      "onSelectionChange",
      "onRowsChange",
      "onColumnLayoutChange",
      "exportRows",
    ])
      if (options[key] !== undefined && typeof options[key] !== "function")
        throw new TypeError(key + " must be a function");
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
      if (s.locale !== locale)
        throw new TypeError(
          "Locale is a mount option; remount with getView()/restoreView() to change language.",
        );
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
    const exportControllers = new Set();
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
      title = node(
        "h2",
        "mh-panel__title",
        options.title || t("Kayıtlar", "Records"),
      );
    root.lang = locale;
    root.dir = options.dir || i18n?.dir || "ltr";
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
      const controls = node("div", "mh-grid-column-controls");
      for (const [delta, tr, en] of [
        [-1, "Öne taşı", "Move earlier"],
        [1, "Arkaya taşı", "Move later"],
      ]) {
        const move = node("button", "mh-button", t(tr, en));
        move.setAttribute("aria-label", c.label + ": " + t(tr, en));
        move.onclick = () => {
          const next = layout.map((x) => ({ ...x })),
            i = next.findIndex((x) => x.key === c.key),
            j = i + delta;
          if (j >= 0 && j < next.length) {
            [next[i], next[j]] = [next[j], next[i]];
            api.setColumnLayout(next);
          }
        };
        controls.append(move);
      }
      const pin = node("select", "mh-select");
      pin.setAttribute("aria-label", c.label + ": " + t("Sabitle", "Pin"));
      for (const [value, tr, en] of [
        ["", "Sabitleme yok", "Unpinned"],
        ["start", "Başlangıca sabitle", "Pin to start"],
        ["end", "Sona sabitle", "Pin to end"],
      ]) {
        const o = node("option", "", t(tr, en));
        o.value = value;
        pin.append(o);
      }
      pin.dataset.pin = c.key;
      pin.value = layout.find((x) => x.key === c.key).pin || "";
      pin.onchange = () =>
        api.setColumnLayout(
          layout.map((x) =>
            x.key === c.key ? { ...x, pin: pin.value || null } : x,
          ),
        );
      controls.append(pin);
      columnsMenu.append(label, controls);
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
      (options.title || t("Kayıtlar", "Records")) +
        t(" tablo alanı", " table region"),
    );
    const table = node("table", "mh-table"),
      caption = node(
        "caption",
        "mh-small",
        options.description ||
          t(
            "Uygulamanın sağladığı kayıtlar",
            "Records supplied by the application",
          ),
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
    let draggingColumn = null;
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
        syncSelection();
      };
      const target = node("label", "mh-grid-check");
      target.append(allSelect);
      th.append(target);
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
      th.dataset.column = c.key;
      const resize = node("button", "mh-grid-resize", "↔");
      resize.setAttribute("role", "separator");
      resize.setAttribute("aria-orientation", "vertical");
      resize.setAttribute("aria-valuemin", "120");
      resize.setAttribute("aria-valuemax", "800");
      resize.setAttribute(
        "aria-label",
        c.label +
          ": " +
          t(
            "Sütun genişliği; ok tuşlarıyla değiştir",
            "Column width; use arrow keys",
          ),
      );
      const width = () => layout.find((x) => x.key === c.key).width;
      const setWidth = (w) =>
        api.setColumnLayout(
          layout.map((x) =>
            x.key === c.key
              ? { ...x, width: Math.min(800, Math.max(120, Math.round(w))) }
              : x,
          ),
        );
      resize.onkeydown = (e) => {
        let w = width();
        const step = e.shiftKey ? 50 : 10;
        if (e.key === "ArrowRight") w += root.dir === "rtl" ? -step : step;
        else if (e.key === "ArrowLeft") w += root.dir === "rtl" ? step : -step;
        else if (e.key === "Home") w = 120;
        else if (e.key === "End") w = 800;
        else return;
        e.preventDefault();
        setWidth(w);
      };
      let drag;
      resize.onpointerdown = (e) => {
        if (e.button !== 0) return;
        drag = { x: e.clientX, width: width() };
        resize.setPointerCapture(e.pointerId);
      };
      resize.onpointermove = (e) => {
        if (drag)
          setWidth(
            drag.width + (e.clientX - drag.x) * (root.dir === "rtl" ? -1 : 1),
          );
      };
      resize.onpointerup =
        resize.onpointercancel =
        resize.onlostpointercapture =
          () => {
            drag = null;
          };
      const move = node(
        "button",
        "mh-button mh-button--quiet",
        t("Taşı", "Move"),
      );
      move.setAttribute(
        "aria-label",
        c.label +
          ": " +
          t(
            "Sütunu taşı; sıra seçeneklerini aç",
            "Move column; open order options",
          ),
      );
      move.draggable = true;
      move.onclick = () => {
        columnsMenu.open = true;
        const pin = columnsMenu.querySelector('[data-pin="' + c.key + '"]');
        pin?.parentElement.querySelector("button")?.focus();
      };
      move.ondragstart = (e) => {
        draggingColumn = c.key;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", c.key);
      };
      move.ondragend = () => {
        draggingColumn = null;
      };
      th.ondragover = (e) => {
        if (draggingColumn) {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }
      };
      th.ondrop = (e) => {
        if (!draggingColumn) return;
        e.preventDefault();
        if (draggingColumn === c.key) {
          draggingColumn = null;
          return;
        }
        const next = layout.map((x) => ({ ...x }));
        const from = next.findIndex((x) => x.key === draggingColumn);
        const target = next.find((x) => x.key === c.key);
        if (from < 0 || !target) return;
        const [item] = next.splice(from, 1);
        item.pin = target.pin;
        next.splice(
          next.findIndex((x) => x.key === c.key),
          0,
          item,
        );
        draggingColumn = null;
        api.setColumnLayout(next);
      };
      th.append(b, resize, move);
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
    function applyLayout() {
      const active = doc.activeElement;
      const order = ordered(),
        shown = order.filter((c) => visibleKeys.includes(c.key));
      for (const row of [hr, ...body.children]) {
        const reorder =
          [...row.children]
            .filter((n) => n.dataset.column)
            .map((n) => n.dataset.column)
            .join() !== order.map((c) => c.key).join();
        for (const c of order) {
          const cell = [...row.children].find(
            (n) => n.dataset.column === c.key,
          );
          if (!cell) continue;
          if (reorder) row.append(cell);
          cell.hidden = !visibleKeys.includes(c.key);
          cell.style.width = c.width + "px";
          cell.style.minWidth = c.width + "px";
          cell.style.maxWidth = c.width + "px";
          cell.style.position = c.pin ? "sticky" : "";
          cell.style.insetInlineStart = "";
          cell.style.insetInlineEnd = "";
          cell.classList.toggle("mh-grid-pinned", !!c.pin);
          if (c.pin) {
            const peers = shown.filter((x) => x.pin === c.pin),
              i = peers.findIndex((x) => x.key === c.key);
            const offset = (
              c.pin === "start" ? peers.slice(0, i) : peers.slice(i + 1)
            ).reduce((a, x) => a + x.width, 0);
            cell.style[
              c.pin === "start" ? "insetInlineStart" : "insetInlineEnd"
            ] = offset + "px";
          }
          const resize = cell.querySelector(".mh-grid-resize");
          if (resize) {
            resize.setAttribute("aria-valuenow", String(c.width));
            resize.setAttribute("aria-valuetext", c.width + " px");
            resize.title = c.width + " px";
            resize.setAttribute("aria-description", c.width + " px");
          }
        }
      }
      table.style.tableLayout = "fixed";
      table.style.width =
        shown.reduce((a, c) => a + c.width, 0) +
        (options.selectable ? 64 : 0) +
        "px";
      table.style.minWidth = "0";
      if (
        active?.isConnected &&
        root.contains(active) &&
        doc.activeElement !== active
      )
        active.focus();
      columnsMenu
        .querySelectorAll("[data-pin]")
        .forEach(
          (n) =>
            (n.value = layout.find((c) => c.key === n.dataset.pin).pin || ""),
        );
    }
    function syncSelection() {
      selectedLabel.textContent = options.selectable
        ? t(
            "{count} kayıt seçili",
            selected.size === 1
              ? "{count} record selected"
              : "{count} records selected",
            { count: i18n ? i18n.number(selected.size) : selected.size },
          )
        : "";
      if (allSelect) {
        const count = currentRows.filter((r) => selected.has(r.id)).length;
        allSelect.checked =
          !!currentRows.length && count === currentRows.length;
        allSelect.indeterminate = count > 0 && count < currentRows.length;
        allSelect.disabled = !currentRows.length;
      }
      body
        .querySelectorAll("input[data-selection]")
        .forEach((n) => (n.checked = selected.has(n.dataset.selection)));
    }
    function notify() {
      options.onStateChange?.({ ...state, filters: { ...state.filters } });
    }
    function change(patch) {
      const next = validateState({ ...state, ...patch });
      if (JSON.stringify(next) === JSON.stringify(state)) return;
      state = next;
      search.value = state.query;
      size.value = state.pageSize;
      notify();
      refresh();
    }
    async function refresh() {
      if (destroyed) return;
      const focused = doc.activeElement;
      const focusRow = focused?.closest("tr")?.dataset.row;
      const focusColumn = focused?.closest("td")?.dataset.column;
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
          ? await options.load(
              { ...state, filters: { ...state.filters } },
              controller.signal,
            )
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
              "{count} kayıt seçili",
              selected.size === 1
                ? "{count} record selected"
                : "{count} records selected",
              { count: i18n ? i18n.number(selected.size) : selected.size },
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
          tr.dataset.row = row.id;
          if (options.selectable) {
            const td = node("td", ""),
              check = node("input", "");
            check.type = "checkbox";
            check.dataset.selection = row.id;
            check.checked = selected.has(row.id);
            check.setAttribute(
              "aria-label",
              t("Kaydı seç: ", "Select record: ") + row.id,
            );
            check.onchange = () => {
              check.checked ? selected.add(row.id) : selected.delete(row.id);
              selectionChanged();
              syncSelection();
            };
            const target = node("label", "mh-grid-check");
            target.append(check);
            td.append(target);
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
                  : c.type === "date"
                    ? new Intl.DateTimeFormat(locale, {
                        timeZone: "UTC",
                      }).format(new Date(row[c.key] + "T12:00:00Z"))
                    : String(row[c.key]),
            );
            td.dataset.column = c.key;
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
              let committing = false;
              input.onchange = () => {
                if (committing) return;
                committing = true;
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
                } finally {
                  committing = false;
                }
              };
              td.replaceChildren(input);
            }
            tr.append(td);
          });
          body.append(tr);
        });
        applyLayout();
        if (
          focusRow &&
          focusColumn &&
          (doc.activeElement === doc.body || doc.activeElement === focused)
        ) {
          const row = [...body.children].find(
            (n) => n.dataset.row === focusRow,
          );
          [...(row?.children || [])]
            .find((n) => n.dataset.column === focusColumn)
            ?.querySelector("input")
            ?.focus();
        }
        status.textContent = total
          ? t(
              "{total} kayıt · Bu sayfada {count} kayıt",
              total === 1
                ? "{total} record · {count} on this page"
                : "{total} records · {count} on this page",
              {
                total: i18n ? i18n.number(total) : total,
                count: i18n ? i18n.number(data.length) : data.length,
              },
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
    function csvRows(source) {
      const visible = ordered()
        .filter((c) => visibleKeys.includes(c.key))
        .map((c) => columns.find((x) => x.key === c.key));
      const cell =
        global.MuhitCSV?.cell ||
        ((value) =>
          '"' +
          String(value ?? "")
            .replace(/^[\s]*[=+@\-]/, "'$&")
            .replaceAll('"', '""') +
          '"');
      return (
        "\uFEFF" +
        [
          visible.map((c) => cell(c.label)).join(","),
          ...source.map((r) => visible.map((c) => cell(r[c.key])).join(",")),
        ].join("\r\n")
      );
    }
    const api = {
      getView: () => ({
        version: 1,
        layout: api.getColumnLayout(),
        visible: [...visibleKeys],
        state: api.getState(),
        selected: api.getSelected(),
      }),
      restoreView(view) {
        if (destroyed) throw new Error("Grid destroyed");
        if (
          !view ||
          view.version !== 1 ||
          !Array.isArray(view.layout) ||
          !Array.isArray(view.visible) ||
          !Array.isArray(view.selected) ||
          view.selected.some((id) => typeof id !== "string")
        )
          throw new TypeError("Invalid view");
        const validKeys = new Set(columns.map((c) => c.key));
        const retained = view.layout.filter((c) => validKeys.has(c?.key));
        const nextLayout = validateLayout([
          ...retained,
          ...layout.filter((c) => !retained.some((x) => x.key === c.key)),
        ]);
        const nextVisible = [
          ...new Set([
            ...view.visible.filter((k) => validKeys.has(k)),
            ...columns
              .filter((c) => !view.layout.some((x) => x.key === c.key))
              .map((c) => c.key),
          ]),
        ];
        const filters = Object.fromEntries(
          Object.entries(view.state?.filters || {}).filter(([key]) =>
            validKeys.has(key),
          ),
        );
        const nextState = validateState({
          ...state,
          ...view.state,
          locale,
          filters,
          sort: columns.some((c) => c.key === view.state?.sort && c.sortable)
            ? view.state.sort
            : "",
        });
        const ids = [...new Set(view.selected)].filter(
          (id) => options.load || rows.some((r) => r.id === id),
        );
        layout = nextLayout;
        visibleKeys = nextVisible.length
          ? nextVisible
          : columns.map((c) => c.key);
        state = nextState;
        selected.clear();
        ids.forEach((id) => selected.add(id));
        columnsMenu
          .querySelectorAll("input")
          .forEach(
            (n, i) => (n.checked = visibleKeys.includes(columns[i].key)),
          );
        search.value = state.query;
        size.value = state.pageSize;
        notify();
        selectionChanged();
        refresh();
        return api;
      },
      setSelected(ids) {
        if (destroyed) throw new Error("Grid destroyed");
        if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string"))
          throw new TypeError("Selection must contain IDs");
        const next = [
          ...new Set(
            ids.filter((id) => options.load || rows.some((r) => r.id === id)),
          ),
        ];
        if (JSON.stringify(next) === JSON.stringify([...selected])) return api;
        selected.clear();
        next.forEach((id) => selected.add(id));
        selectionChanged();
        syncSelection();
        return api;
      },
      getVisibleColumns: () => [...visibleKeys],
      getColumnLayout: () => layout.map((c) => ({ ...c })),
      setColumnLayout(value) {
        if (destroyed) throw new Error("Grid destroyed");
        const next = validateLayout(value);
        if (JSON.stringify(next) === JSON.stringify(layout)) return api;
        layout = next;
        applyLayout();
        options.onColumnLayoutChange?.(api.getColumnLayout());
        return api;
      },
      getState: () => ({ ...state, filters: { ...state.filters } }),
      getSelected: () => [...selected],
      clearSelection() {
        selected.clear();
        selectionChanged();
        syncSelection();
      },
      setVisibleColumns(keys) {
        if (destroyed) throw new Error("Grid destroyed");
        if (
          !Array.isArray(keys) ||
          !keys.length ||
          new Set(keys).size !== keys.length ||
          keys.some((k) => !columns.some((c) => c.key === k))
        )
          throw new TypeError("Geçersiz sütun listesi.");
        if (JSON.stringify(keys) === JSON.stringify(visibleKeys)) return api;
        visibleKeys = [...keys];
        columnsMenu
          .querySelectorAll("input")
          .forEach(
            (input, i) => (input.checked = keys.includes(columns[i].key)),
          );
        applyLayout();
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
      async exportCSV({ scope = "page", signal } = {}) {
        if (destroyed) throw new Error("Grid destroyed");
        if (!["page", "filtered", "selected"].includes(scope))
          throw new TypeError("Invalid export scope");
        if (!options.load || scope === "page")
          return api.toCSV({ scope, selectedOnly: scope === "selected" });
        if (typeof options.exportRows !== "function")
          throw new Error(
            "Remote filtered/selected export requires exportRows",
          );
        const controller = new AbortController(),
          abort = () => controller.abort();
        exportControllers.add(controller);
        signal?.addEventListener("abort", abort, { once: true });
        if (signal?.aborted) abort();
        try {
          const result = await options.exportRows(
            { scope, state: api.getState(), selected: api.getSelected() },
            controller.signal,
          );
          if (controller.signal.aborted || destroyed)
            throw new DOMException("Export aborted", "AbortError");
          return csvRows(rowsOf(result, columns));
        } finally {
          exportControllers.delete(controller);
          signal?.removeEventListener("abort", abort);
        }
      },
      toCSV({ selectedOnly = false, scope } = {}) {
        if (destroyed) throw new Error("Grid destroyed");
        if (
          scope !== undefined &&
          !["page", "filtered", "selected"].includes(scope)
        )
          throw new TypeError("Invalid export scope");
        if (
          options.load &&
          (scope === "filtered" || scope === "selected" || selectedOnly)
        )
          throw new Error("Use exportCSV for remote filtered/selected exports");
        const source =
          options.load || scope === "page"
            ? currentRows
            : query(rows, columns, {
                ...state,
                page: 1,
                pageSize: Number.MAX_SAFE_INTEGER,
              }).rows;
        return csvRows(
          source.filter(
            (r) =>
              !(selectedOnly || scope === "selected") || selected.has(r.id),
          ),
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
        exportControllers.forEach((c) => c.abort());
        exportControllers.clear();
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
    validateColumnLayout: (value, columns) =>
      layoutOf(value, columnsOf(columns)),
    validateRows: rowsOf,
    query,
  });
})(globalThis);
