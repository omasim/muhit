/* Semantic page regions; state transitions keep region DOM intact. */
(function (global) {
  "use strict";
  const { json, object, text } = global.MuhitContracts;
  let sequence = 0;
  const instances = new WeakMap();
  const recipes = global.MuhitRegistry.pages.recipes;
  function validate(input) {
    const errors = [];
    let page;
    try {
      page = json(input);
      object(
        page,
        [
          "version",
          "recipe",
          "title",
          "description",
          "width",
          "dir",
          "primaryActionId",
        ],
        ["version", "recipe", "title"],
      );
      if (page.version !== "1.0.0") throw Error("Unsupported page version");
      if (!recipes.some((r) => r.id === page.recipe))
        throw Error("Unknown page recipe");
      if (
        !text(page.title, 160) ||
        (page.description !== undefined &&
          (typeof page.description !== "string" ||
            page.description.length > 500))
      )
        throw Error("Invalid page text");
      if (
        page.width !== undefined &&
        !["standard", "wide", "reading"].includes(page.width)
      )
        throw Error("Unknown width");
      if (page.dir !== undefined && !["ltr", "rtl"].includes(page.dir))
        throw Error("Invalid direction");
      if (
        page.primaryActionId !== undefined &&
        !/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(page.primaryActionId)
      )
        throw Error("Invalid action id");
    } catch (e) {
      errors.push(e.message);
    }
    return { valid: !errors.length, errors };
  }
  function mount(host, input, options = {}) {
    const check = validate(input);
    if (!check.valid) throw TypeError(check.errors.join("; "));
    object(options, ["locale", "dir", "messages", "onRetry"]);
    if (options.onRetry !== undefined && typeof options.onRetry !== "function")
      throw TypeError("Invalid retry handler");
    if (typeof host === "string") host = global.document.querySelector(host);
    if (!host?.ownerDocument) throw TypeError("Page host required");
    const doc = host.ownerDocument,
      language = global.MuhitI18n.create(options),
      tr = (s, en) => language.text(s, en),
      id = "mh-page-" + ++sequence;
    let page = json(input),
      dead = false;
    function el(tag, cls, txt) {
      const n = doc.createElement(tag);
      if (cls) n.className = cls;
      if (txt !== undefined) n.textContent = txt;
      return n;
    }
    const root = el("div", "mh-scope mh-system-page"),
      skip = el("a", "mh-skip", tr("İçeriğe geç", "Skip to content")),
      main = el("main", "mh-content"),
      header = el("header", "mh-content__header"),
      heading = el("h1", "", page.title),
      description = el("p", "", page.description || ""),
      status = el("div", "mh-alert"),
      message = el("p"),
      retry = el("button", "mh-button", tr("Yeniden dene", "Retry")),
      content = el("div", "mh-region-grid");
    main.id = id;
    main.tabIndex = -1;
    skip.href = "#" + id;
    const title = el("div");
    title.append(heading, description);
    header.append(title);
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    retry.type = "button";
    retry.onclick = () => options.onRetry?.();
    status.append(message, retry);
    main.append(header, status, content);
    const access = el("nav");
    access.setAttribute("aria-label", tr("Sayfa erişimi", "Page access"));
    access.append(skip);
    root.append(access, main);
    root.lang = language.locale;
    root.dir = page.dir || language.dir;
    const regions = {};
    const recipe = recipes.find((r) => r.id === page.recipe);
    for (const name of recipe.regions) {
      const section = el(
        "section",
        "mh-region" +
          (["main", "rail"].includes(name) ? " mh-region--" + name : ""),
      );
      section.dataset.region = name;
      content.append(section);
      regions[name] = section;
    }
    main.dataset.width = page.width || recipe.width;
    status.hidden = true;
    function setState(state = "content", messageText) {
      if (dead) throw Error("Destroyed page");
      if (
        ![
          "content",
          "loading",
          "empty",
          "error",
          "forbidden",
          "partial",
        ].includes(state)
      )
        throw TypeError("Unknown page state");
      if (
        messageText !== undefined &&
        (typeof messageText !== "string" || messageText.length > 2000)
      )
        throw TypeError("Invalid state message");
      const strings = {
        loading: tr("Yükleniyor…", "Loading…"),
        empty: tr("Henüz kayıt yok.", "No records yet."),
        error: tr(
          "İşlem tamamlanamadı. Yeniden deneyebilirsiniz.",
          "The operation could not complete. You can retry.",
        ),
        forbidden: tr(
          "Bu alan için erişim gerekli.",
          "Access is required for this area.",
        ),
        partial: tr(
          "Bazı kayıtlar işlenemedi. Ayrıntıları inceleyin.",
          "Some records could not be processed. Review the details.",
        ),
      };
      root.dataset.state = state;
      status.hidden = state === "content";
      content.hidden = !["content", "partial"].includes(state);
      main.setAttribute("aria-busy", String(state === "loading"));
      message.textContent = messageText ?? strings[state] ?? "";
      retry.hidden = state !== "error" || !options.onRetry;
      return api;
    }
    const api = Object.freeze({
      root,
      main,
      regions: Object.freeze(regions),
      setState,
      update(next) {
        if (dead) throw Error("Destroyed page");
        const result = validate(next);
        if (!result.valid) throw TypeError(result.errors.join("; "));
        if (next.recipe !== page.recipe)
          throw Error(
            "Mount a new page for a new recipe; migrate drafts explicitly",
          );
        page = json(next);
        heading.textContent = page.title;
        description.textContent = page.description || "";
        main.dataset.width = page.width || recipe.width;
        root.dir = page.dir || language.dir;
        return api;
      },
      focus() {
        main.focus({ preventScroll: true });
      },
      destroy() {
        if (dead) return;
        dead = true;
        retry.onclick = null;
        root.remove();
        if (instances.get(host) === api) instances.delete(host);
      },
    });
    instances.get(host)?.destroy();
    host.replaceChildren(root);
    instances.set(host, api);
    setState("content");
    return api;
  }
  global.MuhitPages = Object.freeze({
    version: "1.0.0",
    validate,
    mount,
    recipes,
  });
})(typeof window !== "undefined" ? window : globalThis);
