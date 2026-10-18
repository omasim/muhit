/* Muhit Agent 1.0.0 — deterministic JSON adapter. No model, network or DOM at import. */
(function (global) {
  "use strict";

  var VERSION = "1.1.0";
  var extendedKinds = ["form", "datagrid", "plot"];
  var MAX_NUMBER = Number.MAX_SAFE_INTEGER;
  var ID = /^[A-Za-z][A-Za-z0-9_-]{0,63}$/;
  var instances = new WeakMap();
  var sequence = 0;
  var widgetKinds = [
    "tabs",
    "accordion",
    "timeline",
    "kanban",
    "choices",
    "command",
    "drawer",
    "stepper",
    "filepicker",
    "pagination",
  ];
  var kinds = ["card", "metric", "notice", "table", "chart"].concat(
    widgetKinds,
    extendedKinds,
  );
  var toneNames = {
    info: "Bilgi",
    success: "Tamamlandı",
    warning: "Dikkat",
    danger: "Sorun",
  };
  var themeEnums = {
    preset: [
      "grove",
      "clay",
      "tide",
      "atelier",
      "sand",
      "moss",
      "plum",
      "slate",
    ],
    mode: ["light", "dark"],
    font: ["editorial", "humanist", "system", "book"],
    density: ["comfortable", "compact", "spacious"],
    radius: ["soft", "round", "square", "organic"],
    scale: [1, 1.125, 1.25],
    motion: ["system", "reduced"],
    border: ["subtle", "strong"],
    elevation: ["flat", "soft", "raised"],
    buttonStyle: ["solid", "soft", "outline"],
    controlSize: ["sm", "md", "lg"],
    headingScale: [0.9, 1, 1.15],
    lineHeight: [1.45, 1.65, 1.85],
    contentWidth: ["focused", "balanced", "wide"],
    borderWidth: [1, 2],
    iconWeight: [1.25, 1.5, 1.75, 2],
    accentIntensity: ["soft", "balanced", "vivid"],
    chartPalette: ["natural", "contrast", "mono"],
    cardSurface: ["plain", "tinted", "outline"],
    layoutGap: ["compact", "balanced", "airy"],
    tableRows: ["plain", "striped"],
    tableHeader: ["static", "sticky"],
  };

  function own(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
  }
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }
  function equalTotal(a, b) {
    if (!a || !b || (Number.isSafeInteger(a) && Number.isSafeInteger(b)))
      return a === b;
    return (
      Math.abs(a - b) <= Math.max(Math.abs(a), Math.abs(b)) * Number.EPSILON * 8
    );
  }
  function dateIsReal(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    var date = new Date(value + "T12:00:00Z");
    return (
      Number.isFinite(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  }

  function validate(spec) {
    var errors = [];
    function issue(path, message) {
      if (errors.length < 100) errors.push({ path: path, message: message });
    }
    function object(value, path, allowed, required) {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        issue(path, "Bir nesne gerekli.");
        return false;
      }
      Object.keys(value).forEach(function (key) {
        if (allowed.indexOf(key) === -1)
          issue(path + "." + key, "Bilinmeyen alan.");
      });
      (required || []).forEach(function (key) {
        if (!own(value, key)) issue(path + "." + key, "Zorunlu alan eksik.");
      });
      return true;
    }
    function text(value, path, maximum, nonblank) {
      if (typeof value !== "string") {
        issue(path, "Bir metin gerekli.");
        return false;
      }
      if (Array.from(value).length > maximum)
        issue(path, "En fazla " + maximum + " karakter olabilir.");
      if (nonblank && !/\S/.test(value))
        issue(path, "Boş olmayan bir metin gerekli.");
      return true;
    }
    function id(value, path) {
      if (typeof value !== "string" || !ID.test(value))
        issue(
          path,
          "Kimlik harfle başlamalı; en fazla 64 ASCII harf, rakam, _ veya - içermeli.",
        );
    }
    function choice(value, path, values) {
      if (values.indexOf(value) === -1)
        issue(path, "İzin verilen değerler: " + values.join(", ") + ".");
    }
    function count(value, path) {
      if (
        typeof value !== "number" ||
        !Number.isFinite(value) ||
        value < 0 ||
        value > MAX_NUMBER
      ) {
        issue(
          path,
          "0 ile Number.MAX_SAFE_INTEGER arasında sonlu bir sayı gerekli.",
        );
        return false;
      }
      return true;
    }
    function array(value, path, maximum) {
      if (!Array.isArray(value)) {
        issue(path, "Bir dizi gerekli.");
        return false;
      }
      if (value.length > maximum) {
        issue(path, "En fazla " + maximum + " öğe olabilir.");
        return false;
      }
      return true;
    }
    function optionalText(value, key, path, maximum, nonblank) {
      if (own(value, key))
        text(value[key], path + "." + key, maximum, nonblank);
    }

    // Inspect descriptors before reading values: getters, functions, cycles and exotic objects are not JSON.
    var stack = new WeakSet();
    function json(value, path, depth) {
      if (depth > 12) {
        issue(path, "JSON iç içe geçme sınırı 12.");
        return;
      }
      if (
        value === null ||
        typeof value === "string" ||
        typeof value === "boolean"
      )
        return;
      if (typeof value === "number") {
        if (!Number.isFinite(value))
          issue(path, "Sonlu bir JSON sayısı gerekli.");
        return;
      }
      if (!value || typeof value !== "object") {
        issue(path, "Yalnız JSON değerleri kabul edilir.");
        return;
      }
      if (stack.has(value)) {
        issue(path, "Döngüsel başvuru kabul edilmez.");
        return;
      }
      var proto = Object.getPrototypeOf(value);
      if (
        !Array.isArray(value) &&
        proto !== null &&
        Object.getPrototypeOf(proto) !== null
      ) {
        issue(path, "Yalnız düz JSON nesneleri kabul edilir.");
        return;
      }
      if (Object.getOwnPropertySymbols(value).length)
        issue(path, "Symbol anahtarlar kabul edilmez.");
      var descriptors = Object.getOwnPropertyDescriptors(value);
      stack.add(value);
      if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++)
          if (!own(descriptors, String(i))) {
            issue(path + "[" + i + "]", "Boş dizi yuvası kabul edilmez.");
            break;
          }
      }
      Object.keys(descriptors).forEach(function (key) {
        if (Array.isArray(value) && key === "length") return;
        var item = descriptors[key];
        var next = path + (Array.isArray(value) ? "[" + key + "]" : "." + key);
        if (!own(item, "value") || !item.enumerable) {
          issue(
            next,
            "Yalnız enumerable veri alanları kabul edilir; getter/setter kabul edilmez.",
          );
          return;
        }
        if (
          Array.isArray(value) &&
          (!/^(0|[1-9]\d*)$/.test(key) || Number(key) >= value.length)
        ) {
          issue(next, "Dizide özel alan kabul edilmez.");
          return;
        }
        json(item.value, next, depth + 1);
      });
      stack.delete(value);
    }
    try {
      json(spec, "$", 0);
    } catch (_) {
      issue("$", "Okunabilir düz JSON verisi gerekli.");
    }
    if (errors.length) return { valid: false, errors: errors };

    function theme(value, path) {
      if (
        !object(
          value,
          path,
          ["version", "accent"].concat(Object.keys(themeEnums)),
        )
      )
        return;
      if (own(value, "version") && value.version !== 1)
        issue(path + ".version", "Tema sürümü 1 olmalı.");
      Object.keys(themeEnums).forEach((key) => {
        if (own(value, key))
          choice(value[key], path + "." + key, themeEnums[key]);
      });
      if (
        own(value, "accent") &&
        value.accent !== null &&
        (typeof value.accent !== "string" ||
          !/^#[0-9A-Fa-f]{6}$/.test(value.accent))
      )
        issue(path + ".accent", "#RRGGBB rengi gerekli.");
      if (!errors.length && global.MuhitTheme)
        try {
          global.MuhitTheme.normalizeConfig(clone(value));
        } catch (e) {
          issue(path, e.message);
        }
    }
    function tableRows(rows, path) {
      if (!array(rows, path, 500)) return;
      var ids = new Set();
      rows.forEach(function (row, index) {
        var p = path + "[" + index + "]";
        if (
          !object(
            row,
            p,
            [
              "id",
              "title",
              "status",
              "owner",
              "theme",
              "note",
              "next",
              "initials",
              "updated",
            ],
            ["id", "title", "status"],
          )
        )
          return;
        id(row.id, p + ".id");
        if (ids.has(row.id))
          issue(p + ".id", "Tablo içinde yinelenen satır kimliği.");
        ids.add(row.id);
        text(row.title, p + ".title", 240, true);
        choice(row.status, p + ".status", [
          "planned",
          "active",
          "review",
          "complete",
        ]);
        ["owner", "theme"].forEach(function (key) {
          optionalText(row, key, p, 240, false);
        });
        ["note", "next"].forEach(function (key) {
          optionalText(row, key, p, 2000, false);
        });
        optionalText(row, "initials", p, 12, false);
        if (
          own(row, "updated") &&
          text(row.updated, p + ".updated", 10, false) &&
          row.updated !== "" &&
          !dateIsReal(row.updated)
        )
          issue(
            p + ".updated",
            "Gerçek YYYY-MM-DD tarihi veya boş metin gerekli.",
          );
      });
    }
    function chartData(data, path) {
      if (
        !object(
          data,
          path,
          [
            "period",
            "year",
            "label",
            "isExample",
            "source",
            "rows",
            "categories",
            "types",
          ],
          ["rows"],
        )
      )
        return;
      if (own(data, "period")) choice(data.period, path + ".period", [6, 12]);
      ["year", "label", "source"].forEach(function (key) {
        optionalText(data, key, path, 240, false);
      });
      if (own(data, "isExample") && typeof data.isExample !== "boolean")
        issue(path + ".isExample", "Boolean gerekli.");
      if (!array(data.rows, path + ".rows", 24)) return;
      var sums = { sources: 0, actions: 0, connections: 0 };
      var sumsValid = true;
      data.rows.forEach(function (row, index) {
        var p = path + ".rows[" + index + "]";
        if (
          !object(
            row,
            p,
            [
              "date",
              "month",
              "shortMonth",
              "sources",
              "actions",
              "connections",
              "categories",
              "types",
            ],
            ["sources", "actions", "connections"],
          )
        ) {
          sumsValid = false;
          return;
        }
        ["date", "month", "shortMonth"].forEach(function (key) {
          optionalText(row, key, p, 240, false);
        });
        ["sources", "actions", "connections"].forEach(function (key) {
          if (count(row[key], p + "." + key)) sums[key] += row[key];
          else sumsValid = false;
        });
        ["categories", "types"].forEach(function (key) {
          if (
            !own(row, key) ||
            !array(row[key], p + "." + key, key === "types" ? 8 : 12)
          )
            return;
          var sum = 0,
            valid = true;
          row[key].forEach(function (value, n) {
            if (count(value, p + "." + key + "[" + n + "]")) sum += value;
            else valid = false;
          });
          if (
            valid &&
            !equalTotal(sum, row[key === "types" ? "sources" : "actions"])
          )
            issue(
              p + "." + key,
              "Dağılım toplamı satırın ilgili sayımıyla eşleşmeli.",
            );
        });
      });
      if (sumsValid)
        Object.keys(sums).forEach(function (key) {
          if (sums[key] > MAX_NUMBER || !Number.isFinite(sums[key]))
            issue(
              path + ".rows",
              key + " toplamı güvenli sayısal aralığı aşıyor.",
            );
        });
      ["categories", "types"].forEach(function (key) {
        if (
          !own(data, key) ||
          !array(data[key], path + "." + key, key === "types" ? 8 : 12)
        )
          return;
        var sum = 0,
          valid = true;
        data[key].forEach(function (group, index) {
          var p = path + "." + key + "[" + index + "]";
          if (!object(group, p, ["name", "value"], ["name", "value"])) {
            valid = false;
            return;
          }
          text(group.name, p + ".name", 240, true);
          if (count(group.value, p + ".value")) sum += group.value;
          else valid = false;
        });
        if (
          valid &&
          sumsValid &&
          !equalTotal(sum, sums[key === "types" ? "sources" : "actions"])
        )
          issue(
            path + "." + key,
            "Dağılım toplamı aylık satırların ilgili toplamıyla eşleşmeli.",
          );
      });
    }
    if (
      !object(
        spec,
        "$",
        ["schemaVersion", "theme", "components", "page"],
        ["schemaVersion", "components"],
      )
    )
      return { valid: false, errors: errors };
    if (!["1.0.0", VERSION].includes(spec.schemaVersion))
      issue(
        "$.schemaVersion",
        'schemaVersion tam olarak "' + VERSION + '" olmalı.',
      );
    if (own(spec, "theme")) theme(spec.theme, "$.theme");
    if (
      own(spec, "page") &&
      object(spec.page, "$.page", ["title", "description", "layout"], ["title"])
    ) {
      text(spec.page.title, "$.page.title", 240, true);
      optionalText(spec.page, "description", "$.page", 2000, false);
      if (own(spec.page, "layout"))
        choice(spec.page.layout, "$.page.layout", ["stack", "grid"]);
    }
    if (array(spec.components, "$.components", 50)) {
      var componentIds = new Set();
      spec.components.forEach(function (component, index) {
        var path = "$.components[" + index + "]";
        if (
          !component ||
          typeof component !== "object" ||
          Array.isArray(component)
        ) {
          issue(path, "Bir bileşen nesnesi gerekli.");
          return;
        }
        if (kinds.indexOf(component.type) === -1) {
          issue(
            path + ".type",
            "İzin verilen türler: " + kinds.join(", ") + ".",
          );
          return;
        }
        if (extendedKinds.includes(component.type)) {
          if (spec.schemaVersion !== VERSION)
            issue(path + ".type", "Bu tür schemaVersion 1.1.0 gerektirir.");
          const allowed = {
            form: ["type", "id", "title", "fields", "values", "submitLabel"],
            datagrid: [
              "type",
              "id",
              "title",
              "columns",
              "rows",
              "selectable",
              "columnLayout",
              "locale",
            ],
            plot: ["type", "id", "title", "data"],
          };
          const required = {
            form: ["type", "id", "title", "fields"],
            datagrid: ["type", "id", "title", "columns", "rows"],
            plot: ["type", "id", "title", "data"],
          };
          object(
            component,
            path,
            allowed[component.type],
            required[component.type],
          );
          id(component.id, path + ".id");
          text(component.title, path + ".title", 240, true);
          if (componentIds.has(component.id))
            issue(path + ".id", "Yinelenen bileşen kimliği.");
          componentIds.add(component.id);
          try {
            if (component.type === "form") {
              global.MuhitForm.normalizeValues(
                component.fields,
                component.values,
              );
              if (component.submitLabel !== undefined)
                text(component.submitLabel, path + ".submitLabel", 120, true);
            }
            if (component.type === "datagrid") {
              const cols = global.MuhitDataGrid.validateColumns(
                component.columns,
              );
              global.MuhitDataGrid.validateRows(component.rows, cols);
              if (component.columnLayout !== undefined)
                global.MuhitDataGrid.validateColumnLayout(
                  component.columnLayout,
                  component.columns,
                );
              if (
                component.selectable !== undefined &&
                typeof component.selectable !== "boolean"
              )
                throw Error("selectable boolean olmalı.");
              if (component.locale !== undefined)
                new Intl.NumberFormat(component.locale);
            }
            if (component.type === "plot")
              global.MuhitPlot.normalize(component.data);
          } catch (error) {
            issue(path, error.message);
          }
          return;
        }
        if (widgetKinds.includes(component.type)) {
          if (componentIds.has(component.id))
            issue(path + ".id", "Yinelenen bileşen kimliği.");
          componentIds.add(component.id);
          if (!global.MuhitWidgets)
            issue(path, "Önce MuhitWidgets yüklenmeli.");
          else
            global.MuhitWidgets.validate(component).errors.forEach((e) =>
              issue(path + e.path.slice(1), e.message),
            );
          return;
        }
        var fields = {
          card: [
            "type",
            "id",
            "title",
            "description",
            "action",
            "variant",
            "state",
            "meta",
          ],
          metric: ["type", "id", "label", "value", "note"],
          notice: ["type", "id", "title", "message", "tone"],
          table: ["type", "id", "title", "rows"],
          chart: ["type", "id", "title", "data"],
        };
        var required = {
          card: ["type", "id", "title"],
          metric: ["type", "id", "label", "value"],
          notice: ["type", "id", "title", "message", "tone"],
          table: fields.table,
          chart: fields.chart,
        };
        object(
          component,
          path,
          fields[component.type],
          required[component.type],
        );
        id(component.id, path + ".id");
        if (componentIds.has(component.id))
          issue(path + ".id", "Görünüm içinde yinelenen bileşen kimliği.");
        componentIds.add(component.id);
        if (component.type !== "metric")
          text(component.title, path + ".title", 240, true);
        if (component.type === "card") {
          optionalText(component, "description", path, 4000, false);
          optionalText(component, "meta", path, 500, false);
          if (own(component, "variant"))
            choice(component.variant, path + ".variant", [
              "default",
              "horizontal",
              "sage",
              "ink",
            ]);
          if (own(component, "state"))
            choice(component.state, path + ".state", [
              "default",
              "selected",
              "disabled",
              "loading",
              "error",
            ]);
          if (
            own(component, "action") &&
            object(
              component.action,
              path + ".action",
              ["id", "label"],
              ["id", "label"],
            )
          ) {
            id(component.action.id, path + ".action.id");
            text(component.action.label, path + ".action.label", 120, true);
          }
        } else if (component.type === "metric") {
          text(component.label, path + ".label", 240, true);
          text(component.value, path + ".value", 120, true);
          optionalText(component, "note", path, 2000, false);
        } else if (component.type === "notice") {
          text(component.message, path + ".message", 4000, true);
          choice(component.tone, path + ".tone", Object.keys(toneNames));
        } else if (component.type === "table")
          tableRows(component.rows, path + ".rows");
        else if (component.type === "chart")
          chartData(component.data, path + ".data");
      });
    }
    return { valid: errors.length === 0, errors: errors };
  }

  function checked(spec) {
    var result = validate(spec);
    if (!result.valid) {
      var error = new TypeError(
        "Muhit görünümü geçersiz: " +
          result.errors[0].path +
          " — " +
          result.errors[0].message,
      );
      error.errors = clone(result.errors);
      throw error;
    }
    return clone(spec);
  }

  function render(container, spec, options) {
    var data = checked(spec); // Invalid input never clears or changes the current view.
    if (typeof container === "string")
      container = global.document && global.document.querySelector(container);
    if (!container || container.nodeType !== 1 || !container.ownerDocument)
      throw new TypeError("render bir HTML öğesi veya geçerli seçici bekler.");
    if (options === undefined) options = {};
    if (
      !options ||
      typeof options !== "object" ||
      Array.isArray(options) ||
      Object.keys(options).some(function (key) {
        return !["onAction", "locale", "dir", "messages"].includes(key);
      })
    )
      throw new TypeError("Unknown render option.");
    if (
      options.onAction !== undefined &&
      typeof options.onAction !== "function"
    )
      throw new TypeError("onAction bir fonksiyon olmalı.");
    var language = global.MuhitI18n?.create(options);
    var onAction = options.onAction;
    var destroyed = false;
    var current = null;
    var doc = container.ownerDocument;
    var prefix = "mh-agent-" + ++sequence;

    function element(tag, className, text) {
      var node = doc.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    }
    function release(view) {
      if (!view) return;
      view.listeners.forEach(function (item) {
        item.node.removeEventListener("click", item.handler);
      });
      view.mounts.forEach(function (mount) {
        try {
          mount.destroy();
        } catch (_) {
          /* Complete cleanup even if a downstream disposer fails. */
        }
      });
      view.root.remove();
    }
    function prepare(next) {
      if (
        own(next, "theme") &&
        (!global.MuhitTheme ||
          typeof global.MuhitTheme.normalizeConfig !== "function" ||
          typeof global.MuhitTheme.apply !== "function")
      )
        throw new Error("theme alanı için önce MuhitTheme yüklenmeli.");
      next.components.forEach(function (item) {
        if (
          item.type === "table" &&
          (!global.MuhitTable || typeof global.MuhitTable.mount !== "function")
        )
          throw new Error("table bileşeni için MuhitTable yüklenmeli.");
        if (
          item.type === "chart" &&
          (!global.MuhitCharts ||
            typeof global.MuhitCharts.mount !== "function")
        )
          throw new Error("chart bileşeni için MuhitCharts yüklenmeli.");
      });
      var view = {
        root: element("div", "mh-scope mh-agent mh-stack"),
        mounts: [],
        listeners: [],
      };
      view.root.setAttribute("data-muhit-agent", VERSION);
      var contentRoot = view.root;
      if (next.page) {
        var page = element("section", "mh-page"),
          header = element("header", "mh-page__header"),
          textBox = element("div");
        textBox.append(element("h2", "mh-page__title", next.page.title));
        if (next.page.description)
          textBox.append(
            element("p", "mh-page__description", next.page.description),
          );
        header.append(textBox);
        page.append(header);
        contentRoot = element(
          "div",
          next.page.layout === "grid" ? "mh-page-grid" : "mh-stack",
        );
        page.append(contentRoot);
        view.root.append(page);
      }
      view.root.style.minWidth = "0";
      view.root.style.overflowWrap = "anywhere";
      view.root.style.color = "var(--mh-ink)";
      view.root.style.fontFamily = "var(--mh-font-body)";
      try {
        // Omission inherits the host's live CSS tokens; an explicit {} requests normalized defaults.
        if (own(next, "theme"))
          global.MuhitTheme.apply(
            global.MuhitTheme.normalizeConfig(next.theme),
            view.root,
          );
        next.components.forEach(function (component) {
          if (extendedKinds.includes(component.type)) {
            const host = element("section", "mh-stack");
            host.setAttribute("data-component", component.type);
            host.setAttribute("data-component-id", component.id);
            let mount;
            if (component.type === "form")
              mount = global.MuhitForm.mount(host, {
                locale: language?.locale,
                dir: language?.dir,
                messages: options.messages,
                ...clone(component),
                onChange: (values, state) => {
                  if (!destroyed && current === view)
                    onAction?.({
                      id: "form-change",
                      componentId: component.id,
                      value: { values, ...state },
                    });
                },
                onSubmit: onAction
                  ? async (values, signal) => {
                      if (destroyed || current !== view)
                        throw Error("Görünüm kaldırıldı.");
                      return onAction({
                        id: "submit",
                        componentId: component.id,
                        value: values,
                        signal,
                      });
                    }
                  : undefined,
              });
            if (component.type === "datagrid")
              mount = global.MuhitDataGrid.mount(host, {
                locale: language?.locale,
                dir: language?.dir,
                messages: options.messages,
                ...clone(component),
                onRowsChange: (rows, change) => {
                  if (!destroyed && current === view)
                    onAction?.({
                      id: "edit",
                      componentId: component.id,
                      value: { rows, change },
                    });
                },
                onColumnLayoutChange: (value) => {
                  if (!destroyed && current === view)
                    onAction?.({
                      id: "column-layout",
                      componentId: component.id,
                      value,
                    });
                },
                onStateChange: (value) => {
                  if (!destroyed && current === view)
                    onAction?.({
                      id: "state",
                      componentId: component.id,
                      value,
                    });
                },
                onSelectionChange: (value) => {
                  if (!destroyed && current === view)
                    onAction?.({
                      id: "selection",
                      componentId: component.id,
                      value,
                    });
                },
              });
            if (component.type === "plot")
              mount = global.MuhitPlot.mount(host, {
                locale: language?.locale,
                ...component.data,
              });
            view.mounts.push(mount);
            contentRoot.append(host);
            return;
          }
          if (widgetKinds.includes(component.type)) {
            var widgetHost = element("section", "mh-stack");
            widgetHost.setAttribute("data-component", component.type);
            widgetHost.setAttribute("data-component-id", component.id);
            view.mounts.push(
              global.MuhitWidgets.mount(widgetHost, component, {
                locale: language?.locale,
                dir: language?.dir,
                messages: options.messages,
                onAction: function (event) {
                  if (!destroyed && current === view && onAction)
                    onAction({
                      id: event.type,
                      componentId: component.id,
                      value: event.value,
                    });
                },
              }),
            );
            contentRoot.append(widgetHost);
            return;
          }
          var classes =
            component.type === "card"
              ? "mh-card"
              : component.type === "metric"
                ? "mh-panel mh-metric"
                : component.type === "notice"
                  ? "mh-alert mh-alert--" + component.tone
                  : "mh-stack";
          var node = element("section", classes);
          node.setAttribute("data-component", component.type);
          node.setAttribute("data-component-id", component.id);
          node.style.minWidth = "0";
          var labelId = prefix + "-" + component.id + "-title";
          var title;
          if (component.type === "card") {
            if (component.variant && component.variant !== "default")
              node.className += " mh-card--" + component.variant;
            node.setAttribute("data-state", component.state || "default");
            if (component.state === "loading")
              node.setAttribute("aria-busy", "true");
            if (component.state === "disabled")
              node.setAttribute("aria-disabled", "true");
            title = element("h3", "mh-card__title", component.title);
            title.id = labelId;
            node.append(title);
            if (component.description !== undefined)
              node.append(element("p", "mh-card__body", component.description));
            if (component.meta)
              node.append(element("p", "mh-card__meta", component.meta));
            if (component.state && component.state !== "default")
              node.append(
                element(
                  "p",
                  "mh-card__state",
                  {
                    selected: "Seçili",
                    disabled: "Kullanılamıyor",
                    loading: "Yükleniyor",
                    error: "İşlem tamamlanamadı",
                  }[component.state],
                ),
              );
            if (component.action) {
              var footer = element("div", "mh-card__footer");
              var button = element(
                "button",
                "mh-button mh-button--primary",
                component.action.label,
              );
              button.type = "button";
              button.setAttribute("data-action-id", component.action.id);
              button.disabled =
                !onAction ||
                component.state === "disabled" ||
                component.state === "loading";
              var handler = function () {
                if (!destroyed && current === view && onAction)
                  onAction({
                    id: component.action.id,
                    componentId: component.id,
                  });
              };
              button.addEventListener("click", handler);
              view.listeners.push({ node: button, handler: handler });
              footer.append(button);
              node.append(footer);
            }
          } else if (component.type === "metric") {
            title = element("h3", "mh-metric__label", component.label);
            title.id = labelId;
            node.append(
              title,
              element("p", "mh-metric__value", component.value),
            );
            if (component.note !== undefined)
              node.append(element("p", "mh-muted mh-small", component.note));
          } else if (component.type === "notice") {
            node.setAttribute("role", "note");
            var body = element("div", "mh-stack");
            var badge = element(
              "span",
              "mh-badge mh-badge--" + component.tone,
              toneNames[component.tone],
            );
            title = element("h3", "", component.title);
            title.id = labelId;
            body.append(badge, title, element("p", "", component.message));
            node.append(body);
          } else if (component.type === "table") {
            var tableHost = element("div");
            node.append(tableHost);
            view.mounts.push(
              global.MuhitTable.mount(tableHost, {
                locale: language?.locale,
                dir: language?.dir,
                messages: options.messages,
                rows: clone(component.rows),
                title: component.title,
                description: "JSON sözleşmesinden sağlanan yerel kayıtlar.",
                demo: false,
              }),
            );
            node.setAttribute("aria-label", component.title);
          } else {
            title = element("h3", "mh-panel__title", component.title);
            title.id = labelId;
            node.append(title);
            var chartHost = element("div");
            node.append(chartHost);
            var chartData = clone(component.data);
            view.mounts.push(
              global.MuhitCharts.mount(chartHost, {
                locale: language?.locale,
                dir: language?.dir,
                messages: options.messages,
                initialPeriod: chartData.period || 6,
                periodControl: false,
                getData: function () {
                  return clone(chartData);
                },
              }),
            );
          }
          if (component.type !== "table")
            node.setAttribute("aria-labelledby", labelId);
          contentRoot.append(node);
        });
        if (!next.components.length)
          view.root.append(
            element("p", "mh-muted", "Bu görünümde henüz bileşen yok."),
          );
        return view;
      } catch (error) {
        release(view);
        throw error;
      }
    }
    function commit(next) {
      var prepared = prepare(next);
      release(current);
      current = prepared;
      container.replaceChildren(prepared.root);
    }
    var prepared = prepare(data);
    var previous = instances.get(container);
    if (previous) previous.destroy();
    current = prepared;
    container.replaceChildren(prepared.root);
    var api = Object.freeze({
      update: function (nextSpec) {
        if (destroyed) throw new Error("Kaldırılmış görünüm güncellenemez.");
        commit(checked(nextSpec));
        return api;
      },
      destroy: function () {
        if (destroyed) return;
        destroyed = true;
        release(current);
        current = null;
        if (instances.get(container) === api) instances.delete(container);
      },
    });
    instances.set(container, api);
    return api;
  }

  global.MuhitAgent = Object.freeze({ validate: validate, render: render });
})(globalThis);
