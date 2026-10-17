/* Muhit UI primitives — no framework, no network, no persistence. */
(() => {
  "use strict";
  const paths = {
    bookmark: '<path d="M6 3h12v18l-6-4-6 4V3Z"/>',
    bookmarkFilled: '<path d="M6 3h12v18l-6-4-6 4V3Z" fill="currentColor"/>',
    refresh: '<path d="M20 8a8 8 0 1 0 0 8M20 3v5h-5"/>',
    board:
      '<rect x="3" y="3" width="5" height="15" rx="1"/><rect x="10" y="3" width="5" height="10" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/>',
    sliders: '<path d="M4 6h16M4 12h16M4 18h16M8 3v6m8 0v6m-5 0v6"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
    cards:
      '<rect x="3" y="6" width="15" height="15" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12M7 11h7M7 15h4"/>',
    table:
      '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 14h18M9 9v11"/>',
    chart: '<path d="M4 3v17h17M8 16v-5m5 5V6m5 10V9"/>',
    form: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h4m-4 4h10m-10 4h7"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    layout:
      '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 8h18M8 8v13"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    book: '<path d="M12 5v16M12 5C8 2 4 3 2 4v15c4-2 7-1 10 2 3-3 6-4 10-2V4c-2-1-6-2-10 1Z"/>',
    nodes:
      '<circle cx="12" cy="5" r="3"/><circle cx="5" cy="18" r="3"/><circle cx="19" cy="18" r="3"/><path d="m10 8-4 7m8-7 4 7M8 18h8"/>',
    file: '<path d="M14 2H5v20h14V7l-5-5Zm0 0v5h5M8 12h8m-8 4h6"/>',
    folder: '<path d="M3 7h7l2-3h9v16H3V7Zm0 0V4h7l2 3h9"/>',
    people:
      '<circle cx="8" cy="7" r="3"/><path d="M2 21v-3a6 6 0 0 1 12 0v3m1-17a3 3 0 0 1 0 6m2 4a5 5 0 0 1 5 5v2"/>',
    spark: '<path d="m12 2 2 7 8 3-8 2-2 8-3-8-7-2 7-3 3-7Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v.1"/>',
    warning: '<path d="m12 3 10 18H2L12 3Zm0 6v5m0 3v.1"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    lock: '<rect x="4" y="10" width="16" height="12" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v3"/>',
    copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    leaf: '<path d="M20 3C8 2 3 7 5 14c2 6 14 6 15-11ZM4 21 16 8"/>',
  };
  function icon(name) {
    return `<svg class="mh-icon" aria-hidden="true" viewBox="0 0 24 24">${paths[name] || paths.grid}</svg>`;
  }
  function toast(message, options = {}) {
    if (typeof document === "undefined")
      throw new Error("Muhit.toast için bir tarayıcı DOM ortamı gerekli.");
    const host = options.container || document.body;
    if (!host || host.nodeType !== 1)
      throw new TypeError("toast.container bir HTML elementi olmalı.");
    const duration = options.duration === undefined ? 7000 : options.duration;
    if (
      typeof duration !== "number" ||
      !Number.isFinite(duration) ||
      duration < 0
    )
      throw new TypeError(
        "toast.duration negatif olmayan sonlu bir sayı olmalı.",
      );
    let region = Array.from(host.children).find((node) =>
      node.classList.contains("mh-toast-region"),
    );
    if (!region) {
      region = document.createElement("div");
      region.className = "mh-toast-region mh-scope";
      region.setAttribute("role", "status");
      region.setAttribute("aria-live", "polite");
      host.append(region);
    }
    const item = document.createElement("div");
    item.className = "mh-toast";
    const text = document.createElement("span");
    text.textContent = message;
    let timer;
    const dismiss = () => {
      clearTimeout(timer);
      item.remove();
    };
    item.__muhitDismiss = dismiss;
    const close = document.createElement("button");
    close.type = "button";
    close.setAttribute("aria-label", "Bildirimi kapat");
    close.innerHTML = icon("close");
    close.onclick = dismiss;
    item.append(text, close);
    region.append(item);
    if (duration > 0) timer = setTimeout(dismiss, duration);
    item.onmouseenter = () => clearTimeout(timer);
    item.onfocusin = () => clearTimeout(timer);
    while (region.children.length > 3)
      region.firstElementChild.__muhitDismiss();
  }
  function openDialog(dialog) {
    if (!dialog || typeof dialog.showModal !== "function")
      throw new TypeError("Bir HTMLDialogElement gerekli.");
    if (!dialog.open) dialog.showModal();
  }
  function closeDialog(dialog) {
    if (dialog?.open) dialog.close();
  }
  globalThis.Muhit = Object.freeze({ icon, toast, openDialog, closeDialog });
})();
