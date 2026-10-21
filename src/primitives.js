/* Progressive native controls. The caller owns DOM and business actions. */
(function (global) {
  "use strict";
  let sequence = 0;
  function nodes(trigger, panel) {
    if (
      !trigger?.ownerDocument ||
      !panel?.ownerDocument ||
      trigger.ownerDocument !== panel.ownerDocument
    )
      throw TypeError("Trigger and panel must share a document");
    if (trigger.tagName !== "BUTTON")
      throw TypeError("A native button trigger is required");
  }
  function overlay(trigger, panel, options = {}) {
    nodes(trigger, panel);
    const menu = options.menu === true,
      doc = trigger.ownerDocument,
      win = doc.defaultView,
      original = {
        hidden: panel.hidden,
        id: panel.id,
        expanded: trigger.getAttribute("aria-expanded"),
        controls: trigger.getAttribute("aria-controls"),
        popup: trigger.getAttribute("aria-haspopup"),
        role: panel.getAttribute("role"),
        style: panel.getAttribute("style"),
      };
    let opened = false,
      dead = false;
    if (!panel.id) panel.id = "mh-overlay-" + ++sequence;
    trigger.setAttribute("aria-controls", panel.id);
    trigger.setAttribute("aria-expanded", "false");
    if (menu) {
      trigger.setAttribute("aria-haspopup", "menu");
      panel.setAttribute("role", "menu");
    }
    panel.hidden = true;
    const items = () =>
      [...panel.querySelectorAll("[role=menuitem]")].filter(
        (n) => !n.disabled && n.getAttribute("aria-disabled") !== "true",
      );
    const oldTabs = new Map(
      [...panel.querySelectorAll("[role=menuitem]")].map((n) => [
        n,
        n.getAttribute("tabindex"),
      ]),
    );
    function position() {
      if (!opened) return;
      const r = trigger.getBoundingClientRect();
      panel.style.position = "fixed";
      panel.style.left =
        Math.max(8, Math.min(r.left, win.innerWidth - panel.offsetWidth - 8)) +
        "px";
      panel.style.top =
        Math.max(
          8,
          Math.min(r.bottom + 6, win.innerHeight - panel.offsetHeight - 8),
        ) + "px";
    }
    function close(focus = false) {
      if (dead) return;
      opened = false;
      panel.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      if (focus) trigger.focus();
    }
    function open(last = false) {
      if (dead) throw Error("Destroyed overlay");
      opened = true;
      panel.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      position();
      if (menu) {
        const list = items();
        list.forEach((n) => (n.tabIndex = -1));
        const target = last ? list.at(-1) : list[0];
        if (target) {
          target.tabIndex = 0;
          target.focus();
        }
      }
    }
    function toggle() {
      opened ? close() : open();
    }
    function key(e) {
      if (e.key === "Escape" && opened) {
        e.preventDefault();
        close(true);
        return;
      }
      if (
        e.currentTarget === trigger &&
        menu &&
        ["ArrowDown", "ArrowUp"].includes(e.key)
      ) {
        e.preventDefault();
        open(e.key === "ArrowUp");
        return;
      }
      if (!opened || !menu) return;
      const list = items(),
        i = list.indexOf(doc.activeElement);
      let next;
      if (e.key === "ArrowDown") next = (i + 1) % list.length;
      if (e.key === "ArrowUp") next = (i - 1 + list.length) % list.length;
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = list.length - 1;
      if (next !== undefined && list.length) {
        e.preventDefault();
        list.forEach((n) => (n.tabIndex = -1));
        list[next].tabIndex = 0;
        list[next].focus();
      }
    }
    function outside(e) {
      if (opened && !panel.contains(e.target) && !trigger.contains(e.target))
        close();
    }
    function select(e) {
      if (
        menu &&
        e.target.closest("[role=menuitem]") &&
        !e.target.closest("[role=menuitem]").disabled
      )
        close(true);
    }
    function focus(e) {
      if (opened && !panel.contains(e.target) && e.target !== trigger) close();
    }
    trigger.addEventListener("click", toggle);
    trigger.addEventListener("keydown", key);
    panel.addEventListener("keydown", key);
    panel.addEventListener("click", select);
    doc.addEventListener("pointerdown", outside);
    doc.addEventListener("focusin", focus);
    win.addEventListener("resize", position);
    win.addEventListener("scroll", position, true);
    return Object.freeze({
      open,
      close,
      destroy() {
        if (dead) return;
        close();
        dead = true;
        trigger.removeEventListener("click", toggle);
        trigger.removeEventListener("keydown", key);
        panel.removeEventListener("keydown", key);
        panel.removeEventListener("click", select);
        doc.removeEventListener("pointerdown", outside);
        doc.removeEventListener("focusin", focus);
        win.removeEventListener("resize", position);
        win.removeEventListener("scroll", position, true);
        panel.hidden = original.hidden;
        panel.id = original.id;
        for (const [attr, v] of [
          ["aria-expanded", original.expanded],
          ["aria-controls", original.controls],
          ["aria-haspopup", original.popup],
        ])
          v === null
            ? trigger.removeAttribute(attr)
            : trigger.setAttribute(attr, v);
        original.role === null
          ? panel.removeAttribute("role")
          : panel.setAttribute("role", original.role);
        original.style === null
          ? panel.removeAttribute("style")
          : panel.setAttribute("style", original.style);
        oldTabs.forEach((v, n) =>
          v === null
            ? n.removeAttribute("tabindex")
            : n.setAttribute("tabindex", v),
        );
      },
    });
  }
  function tooltip(trigger, message) {
    if (
      !trigger?.ownerDocument ||
      typeof message !== "string" ||
      !message.trim()
    )
      throw TypeError("Named tooltip required");
    const doc = trigger.ownerDocument,
      tip = doc.createElement("span"),
      old = trigger.getAttribute("aria-describedby");
    tip.id = "mh-tooltip-" + ++sequence;
    tip.className = "mh-system-tooltip";
    tip.role = "tooltip";
    tip.textContent = message;
    tip.hidden = true;
    trigger.after(tip);
    trigger.setAttribute(
      "aria-describedby",
      [old, tip.id].filter(Boolean).join(" "),
    );
    let focused = false,
      hovered = false,
      dismissed = false,
      dead = false,
      timer;
    function show() {
      tip.hidden = dismissed || !(focused || hovered);
      if (!tip.hidden) {
        const r = trigger.getBoundingClientRect();
        tip.style.left =
          Math.max(
            8,
            Math.min(r.left, doc.defaultView.innerWidth - tip.offsetWidth - 8),
          ) + "px";
        tip.style.top =
          Math.max(
            8,
            Math.min(
              r.bottom + 6,
              doc.defaultView.innerHeight - tip.offsetHeight - 8,
            ),
          ) + "px";
      }
    }
    const enter = () => {
        clearTimeout(timer);
        hovered = true;
        dismissed = false;
        show();
      },
      leave = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          hovered = false;
          show();
        }, 100);
      },
      focus = () => {
        focused = true;
        dismissed = false;
        show();
      },
      blur = () => {
        focused = false;
        show();
      },
      key = (e) => {
        if (e.key === "Escape") {
          dismissed = true;
          show();
        }
      };
    tip.addEventListener("mouseenter", enter);
    tip.addEventListener("mouseleave", leave);
    trigger.addEventListener("mouseenter", enter);
    trigger.addEventListener("mouseleave", leave);
    trigger.addEventListener("focus", focus);
    trigger.addEventListener("blur", blur);
    trigger.addEventListener("keydown", key);
    doc.defaultView.addEventListener("scroll", show, true);
    doc.defaultView.addEventListener("resize", show);
    return Object.freeze({
      destroy() {
        if (dead) return;
        dead = true;
        clearTimeout(timer);
        tip.removeEventListener("mouseenter", enter);
        tip.removeEventListener("mouseleave", leave);
        trigger.removeEventListener("mouseenter", enter);
        trigger.removeEventListener("mouseleave", leave);
        trigger.removeEventListener("focus", focus);
        trigger.removeEventListener("blur", blur);
        trigger.removeEventListener("keydown", key);
        doc.defaultView.removeEventListener("scroll", show, true);
        doc.defaultView.removeEventListener("resize", show);
        tip.remove();
        old === null
          ? trigger.removeAttribute("aria-describedby")
          : trigger.setAttribute("aria-describedby", old);
      },
    });
  }
  function tree(host, input, options = {}) {
    const { json, object, text } = global.MuhitContracts;
    const data = json(input);
    object(options, ["label", "onSelect"]);
    if (
      !text(options.label) ||
      (options.onSelect !== undefined && typeof options.onSelect !== "function")
    )
      throw TypeError("Tree label and valid callback required");
    const ids = new Set();
    function validate(nodes, depth = 0) {
      if (!Array.isArray(nodes) || depth > 20) throw TypeError("Invalid tree");
      for (const n of nodes) {
        object(n, ["id", "label", "children"], ["id", "label"]);
        if (
          !text(n.id, 64) ||
          !text(n.label) ||
          ids.has(n.id) ||
          ids.size >= 500
        )
          throw TypeError("Invalid tree node");
        ids.add(n.id);
        if (n.children) validate(n.children, depth + 1);
      }
    }
    validate(data);
    if (typeof host === "string") host = global.document.querySelector(host);
    if (!host?.ownerDocument) throw TypeError("Tree host required");
    const doc = host.ownerDocument,
      root = doc.createElement("ul"),
      records = new Map();
    let selected = null,
      active = null,
      dead = false;
    root.role = "tree";
    root.setAttribute("aria-label", options.label);
    function render(nodes, parent, parentId = null, level = 1) {
      nodes.forEach((n, i) => {
        const li = doc.createElement("li"),
          label = doc.createElement("span");
        li.role = "treeitem";
        li.tabIndex = -1;
        li.dataset.treeId = n.id;
        li.setAttribute("aria-level", level);
        li.setAttribute("aria-posinset", i + 1);
        li.setAttribute("aria-setsize", nodes.length);
        li.setAttribute("aria-selected", "false");
        label.textContent = n.label;
        label.id = "mh-tree-label-" + ++sequence;
        li.setAttribute("aria-labelledby", label.id);
        li.append(label);
        const record = { li, parentId, group: null };
        records.set(n.id, record);
        if (n.children?.length) {
          const group = doc.createElement("ul");
          group.role = "group";
          group.hidden = true;
          li.setAttribute("aria-expanded", "false");
          li.append(group);
          record.group = group;
          render(n.children, group, n.id, level + 1);
        }
        parent.append(li);
      });
    }
    render(data, root);
    function visible() {
      return [...records]
        .filter(([, r]) => {
          let p = r.parentId;
          while (p !== null) {
            const parent = records.get(p);
            if (parent.group.hidden) return false;
            p = parent.parentId;
          }
          return true;
        })
        .map(([id]) => id);
    }
    function focus(id, move = true) {
      records.forEach((r) => (r.li.tabIndex = -1));
      active = id;
      if (id !== null) {
        records.get(id).li.tabIndex = 0;
        if (move) records.get(id).li.focus();
      }
    }
    function expand(id, open) {
      const r = records.get(id);
      if (r.group) {
        r.group.hidden = !open;
        r.li.setAttribute("aria-expanded", String(open));
      }
    }
    function select(id, notify = true) {
      if (dead) throw Error("Destroyed tree");
      if (!records.has(id)) throw TypeError("Unknown tree node");
      selected = id;
      records.forEach((r, k) =>
        r.li.setAttribute("aria-selected", String(k === id)),
      );
      if (notify) options.onSelect?.(id);
    }
    function key(e) {
      const li = e.target.closest("[role=treeitem]");
      if (!li) return;
      const id = li.dataset.treeId,
        r = records.get(id),
        list = visible(),
        i = list.indexOf(id),
        rtl = doc.defaultView.getComputedStyle(root).direction === "rtl";
      let next;
      if (e.key === "ArrowDown") next = list[Math.min(i + 1, list.length - 1)];
      if (e.key === "ArrowUp") next = list[Math.max(i - 1, 0)];
      if (e.key === "Home") next = list[0];
      if (e.key === "End") next = list.at(-1);
      if (e.key === (rtl ? "ArrowLeft" : "ArrowRight")) {
        if (r.group?.hidden) expand(id, true);
        else if (r.group) next = r.group.firstElementChild.dataset.treeId;
        e.preventDefault();
      }
      if (e.key === (rtl ? "ArrowRight" : "ArrowLeft")) {
        if (r.group && !r.group.hidden) expand(id, false);
        else next = r.parentId;
        e.preventDefault();
      }
      if (["Enter", " "].includes(e.key)) {
        e.preventDefault();
        select(id);
      }
      if (next) {
        e.preventDefault();
        focus(next);
      }
    }
    function click(e) {
      const li = e.target.closest("[role=treeitem]");
      if (!li) return;
      const id = li.dataset.treeId;
      focus(id);
      select(id);
      const r = records.get(id);
      if (r.group) expand(id, r.group.hidden);
    }
    root.addEventListener("keydown", key);
    root.addEventListener("click", click);
    focus(data[0]?.id ?? null, false);
    if (!data.length) root.tabIndex = 0;
    host.replaceChildren(root);
    return Object.freeze({
      getView() {
        return {
          selected,
          active,
          expanded: [...records]
            .filter(([, r]) => r.group && !r.group.hidden)
            .map(([id]) => id),
        };
      },
      restoreView(view) {
        if (dead) throw Error("Destroyed tree");
        const v = json(view);
        object(
          v,
          ["selected", "active", "expanded"],
          ["selected", "active", "expanded"],
        );
        if (
          !Array.isArray(v.expanded) ||
          v.expanded.some((id) => !records.get(id)?.group) ||
          (v.selected !== null && !records.has(v.selected)) ||
          (v.active !== null && !records.has(v.active))
        )
          throw TypeError("Invalid tree snapshot");
        records.forEach((r, id) => expand(id, v.expanded.includes(id)));
        selected = v.selected;
        records.forEach((r, id) =>
          r.li.setAttribute("aria-selected", String(selected === id)),
        );
        focus(
          visible().includes(v.active) ? v.active : (visible()[0] ?? null),
          false,
        );
      },
      select(id) {
        select(id);
        return this;
      },
      destroy() {
        if (dead) return;
        dead = true;
        root.removeEventListener("keydown", key);
        root.removeEventListener("click", click);
        root.remove();
      },
    });
  }

  global.MuhitPrimitives = Object.freeze({
    tree,
    menu: (trigger, panel) => overlay(trigger, panel, { menu: true }),
    popover: (trigger, panel) => overlay(trigger, panel),
    tooltip,
  });
})(typeof window !== "undefined" ? window : globalThis);
