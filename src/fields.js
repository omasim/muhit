/* Optional application-owned field integrations. No network or storage ownership. */
(function (global) {
  "use strict";
  let sequence = 0;
  const instances = new WeakMap();
  function hostOf(target) {
    const h =
      typeof target === "string" ? document.querySelector(target) : target;
    if (!h?.ownerDocument) throw new TypeError("Host required");
    return h;
  }
  function choice(value) {
    if (value === null) return null;
    if (
      !value ||
      typeof value.id !== "string" ||
      !value.id ||
      typeof value.label !== "string" ||
      !value.label.trim()
    )
      throw new TypeError("Choice requires id and label");
    return { id: value.id, label: value.label };
  }
  function combobox(target, options) {
    const host = hostOf(target),
      doc = host.ownerDocument,
      lang = global.MuhitI18n.create(options),
      t = (tr, en) => lang.text(tr, en);
    if (typeof options.load !== "function")
      throw new TypeError("load required");
    const delay = options.delay ?? 200;
    if (!Number.isFinite(delay) || delay < 0 || delay > 5000)
      throw new TypeError("Invalid delay");
    let value = choice(options.value ?? null),
      items = [],
      active = -1,
      dead = false,
      serial = 0,
      timer,
      controller;
    const root = doc.createElement("div");
    root.className = "mh-scope mh-field";
    root.lang = lang.locale;
    root.dir = lang.dir;
    const id = "mh-combo-" + ++sequence,
      label = doc.createElement("label"),
      input = doc.createElement("input"),
      list = doc.createElement("ul"),
      status = doc.createElement("p");
    label.htmlFor = id;
    label.textContent = options.label || t("Ara ve seç", "Search and select");
    input.id = id;
    input.className = "mh-input";
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-controls", id + "-list");
    input.autocomplete = "off";
    input.value = value?.label || "";
    list.id = id + "-list";
    list.className = "mh-combobox-list";
    list.setAttribute("role", "listbox");
    list.setAttribute("aria-label", label.textContent);
    list.hidden = true;
    status.setAttribute("role", "status");
    status.className = "mh-field__help";
    root.append(label, input, list, status);
    const close = () => {
      list.hidden = true;
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      active = -1;
    };
    function select(i) {
      if (!items[i]) return;
      value = choice(items[i]);
      input.value = value.label;
      close();
      options.onChange?.({ ...value });
      input.focus();
    }
    function paint() {
      list.replaceChildren();
      items.forEach((item, i) => {
        const n = doc.createElement("li");
        n.id = id + "-option-" + i;
        n.setAttribute("role", "option");
        n.setAttribute("aria-selected", String(i === active));
        n.textContent = item.label;
        n.onpointerdown = (e) => e.preventDefault();
        n.onclick = () => select(i);
        list.append(n);
      });
      list.hidden = !items.length;
      input.setAttribute("aria-expanded", String(!!items.length));
      if (active >= 0) {
        input.setAttribute("aria-activedescendant", id + "-option-" + active);
        list.children[active]?.scrollIntoView({ block: "nearest" });
      } else input.removeAttribute("aria-activedescendant");
    }
    async function search() {
      const ticket = ++serial;
      controller?.abort();
      controller = new AbortController();
      input.setAttribute("aria-busy", "true");
      status.textContent = t("Yükleniyor…", "Loading…");
      close();
      try {
        const result = await options.load(input.value, controller.signal);
        if (dead || ticket !== serial) return;
        if (!Array.isArray(result) || result.length > 100)
          throw new TypeError("Up to 100 choices");
        const next = result.map(choice);
        if (
          next.some((x) => x === null) ||
          new Set(next.map((x) => x.id)).size !== next.length
        )
          throw new TypeError("Unique choices required");
        items = next;
        active = -1;
        paint();
        status.textContent = items.length
          ? lang.number(items.length) + " " + t("sonuç", "results")
          : t("Sonuç yok", "No results");
      } catch (e) {
        if (dead || ticket !== serial) return;
        items = [];
        close();
        status.textContent = t(
          "Yüklenemedi. Tekrar arayın.",
          "Unable to load. Search again.",
        );
      } finally {
        if (!dead && ticket === serial)
          input.setAttribute("aria-busy", "false");
      }
    }
    function cancel() {
      ++serial;
      controller?.abort();
      clearTimeout(timer);
      input.setAttribute("aria-busy", "false");
    }
    input.oninput = () => {
      cancel();
      value = null;
      items = [];
      close();
      options.onChange?.(null);
      timer = setTimeout(search, delay);
    };
    input.onkeydown = (e) => {
      if (e.key === "Escape") {
        cancel();
        close();
        return;
      }
      if (e.key === "Tab") {
        close();
        return;
      }
      if (e.key === "Enter" && active >= 0) {
        e.preventDefault();
        select(active);
        return;
      }
      if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
        e.preventDefault();
        if (!items.length) {
          search();
          return;
        }
        active =
          e.key === "Home"
            ? 0
            : e.key === "End"
              ? items.length - 1
              : (active + (e.key === "ArrowUp" ? -1 : 1) + items.length) %
                items.length;
        paint();
      }
    };
    const outside = (e) => {
      if (!root.contains(e.target)) {
        cancel();
        close();
      }
    };
    doc.addEventListener("pointerdown", outside);
    root.onfocusout = (e) => {
      if (!root.contains(e.relatedTarget)) {
        cancel();
        close();
      }
    };
    instances.get(host)?.destroy();
    host.append(root);
    const api = {
      getValue: () => (value ? { ...value } : null),
      setValue(next) {
        const checked = choice(next);
        if (dead) throw new Error("Destroyed");
        cancel();
        value = checked;
        input.value = value?.label || "";
        close();
        return api;
      },
      destroy() {
        if (dead) return;
        dead = true;
        cancel();
        doc.removeEventListener("pointerdown", outside);
        root.remove();
        if (instances.get(host) === api) instances.delete(host);
      },
    };
    instances.set(host, api);
    return api;
  }
  function repeater(target, options) {
    const host = hostOf(target),
      doc = host.ownerDocument,
      lang = global.MuhitI18n.create(options),
      t = (tr, en) => lang.text(tr, en),
      fields = global.MuhitForm.normalizeFields(options.fields);
    const min = options.min ?? 0,
      max = options.max ?? 20;
    if (
      !Number.isInteger(min) ||
      !Number.isInteger(max) ||
      min < 0 ||
      max < min ||
      max > 50
    )
      throw new TypeError("Invalid group limits");
    function normalize(values) {
      if (!Array.isArray(values) || values.length < min || values.length > max)
        throw new TypeError("Invalid group count");
      return values.map((v) => global.MuhitForm.normalizeValues(fields, v));
    }
    const initial = normalize(
      options.values || Array.from({ length: min }, () => ({})),
    );
    let entries = [],
      dead = false,
      busy = false,
      controller,
      revision = 0;
    const root = doc.createElement("section");
    root.className = "mh-scope mh-stack";
    root.lang = lang.locale;
    root.dir = lang.dir;
    const heading = doc.createElement("h2");
    heading.textContent = options.title || t("Alan grupları", "Field groups");
    const area = doc.createElement("div");
    area.className = "mh-stack";
    const add = doc.createElement("button"),
      save = doc.createElement("button"),
      status = doc.createElement("p");
    for (const b of [add, save]) {
      b.type = "button";
      b.className = "mh-button";
    }
    add.textContent = t("Grup ekle", "Add group");
    save.textContent = t("Kaydet", "Save");
    save.hidden = !options.onSubmit;
    status.setAttribute("role", "status");
    root.append(heading, area, add, save, status);
    const values = () => entries.map((e) => e.form.getValues());
    const change = () => options.onChange?.(values());
    function controls() {
      add.disabled = busy || entries.length >= max;
      save.disabled = busy;
      entries.forEach((e, i) => {
        e.remove.disabled = busy || entries.length <= min;
        e.remove.setAttribute(
          "aria-label",
          t("Grubu kaldır", "Remove group") + " " + lang.number(i + 1),
        );
      });
    }
    function append(value) {
      const wrap = doc.createElement("div"),
        holder = doc.createElement("div"),
        remove = doc.createElement("button");
      wrap.className = "mh-panel mh-stack";
      remove.type = "button";
      remove.className = "mh-button";
      remove.textContent = t("Kaldır", "Remove");
      wrap.append(holder, remove);
      area.append(wrap);
      const entry = {
        wrap,
        remove,
        form: global.MuhitForm.mount(holder, {
          ...options,
          fields,
          values: value,
          title: options.groupLabel || t("Grup", "Group"),
          onChange: () => {
            if (!busy) change();
          },
          onSubmit: async () => submit(),
        }),
      };
      entry.formElement = holder.querySelector("form");
      entry.formElement.addEventListener(
        "submit",
        (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          submit();
        },
        { capture: true },
      );
      entry.formElement.querySelector(".mh-row")?.setAttribute("hidden", "");
      entries.push(entry);
      remove.onclick = () => {
        if (busy || entries.length <= min) return;
        entry.form.destroy();
        wrap.remove();
        entries = entries.filter((e) => e !== entry);
        controls();
        change();
        add.focus();
      };
      controls();
      return entry;
    }
    function validate() {
      const results = entries.map((e) => e.form.validate());
      return {
        valid: results.every((r) => r.valid),
        values: values(),
        errors: results.map((r) => r.errors),
      };
    }
    async function submit() {
      if (dead || busy) return;
      const result = validate();
      if (!result.valid) {
        root.querySelector("[aria-invalid=true]")?.focus();
        return;
      }
      if (!options.onSubmit) return;
      busy = true;
      const current = ++revision;
      controller = new AbortController();
      controls();
      entries.forEach(
        (e) => (e.formElement.querySelector("fieldset").disabled = true),
      );
      try {
        await options.onSubmit(result.values, controller.signal);
        if (!dead && current === revision && !controller.signal.aborted)
          status.textContent = t("Kaydedildi.", "Saved.");
      } catch {
        if (!dead && current === revision)
          status.textContent = t("Kaydedilemedi.", "Unable to save.");
      } finally {
        if (!dead && current === revision) {
          busy = false;
          entries.forEach(
            (e) => (e.formElement.querySelector("fieldset").disabled = false),
          );
          controls();
        }
      }
    }
    add.onclick = () => {
      if (entries.length >= max || busy) return;
      append(global.MuhitForm.normalizeValues(fields, {}))
        .wrap.querySelector("input,select,textarea")
        ?.focus();
      change();
    };
    save.onclick = submit;
    initial.forEach(append);
    instances.get(host)?.destroy();
    host.append(root);
    const api = {
      getValues: values,
      validate,
      setValues(next) {
        if (dead) throw new Error("Destroyed");
        const checked = normalize(next);
        ++revision;
        controller?.abort();
        busy = false;
        entries.forEach((e) => e.form.destroy());
        entries = [];
        area.replaceChildren();
        checked.forEach(append);
        controls();
        return api;
      },
      submit,
      destroy() {
        if (dead) return;
        dead = true;
        controller?.abort();
        entries.forEach((e) => e.form.destroy());
        root.remove();
        if (instances.get(host) === api) instances.delete(host);
      },
    };
    instances.set(host, api);
    return api;
  }
  global.MuhitFields = Object.freeze({ combobox, repeater });
})(globalThis);
