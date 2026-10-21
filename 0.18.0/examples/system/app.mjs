import { bulkExample, wizardExample } from "./patterns.mjs";
import {
  MuhitTheme as Theme,
  MuhitTokens as Tokens,
  MuhitFlow as Flow,
  MuhitPages as Pages,
  MuhitSystem as System,
  MuhitPrimitives as Primitives,
  MuhitForm as Form,
  MuhitDataGrid as Grid,
  MuhitPlot as Plot,
} from "../../src/index.mjs";
const $ = (id) => document.getElementById(id),
  app = document.body.dataset.app,
  disposers = [];
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}
function button(label, fn, primary = false) {
  const n = el(
    "button",
    "mh-button" + (primary ? " mh-button--primary" : ""),
    label,
  );
  n.type = "button";
  n.onclick = fn;
  return n;
}
function panel(title, parent) {
  const n = el("section", "mh-system-panel mh-stack-system");
  n.append(el("h2", "", title));
  parent.append(n);
  return n;
}
function status(parent) {
  const n = el("p", "system-result");
  n.role = "status";
  n.setAttribute("aria-live", "polite");
  parent.append(n);
  return n;
}
function download(name, text, type = "application/json") {
  const a = el("a"),
    u = URL.createObjectURL(new Blob([text], { type }));
  a.href = u;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
const media = matchMedia("(prefers-color-scheme:dark)");
let config;
function theme() {
  config = Tokens.compose(
    [
      { preset: "grove" },
      {
        preset: $("palette").value,
        mode: $("appearance").value,
        density: $("density").value,
      },
    ],
    { systemMode: media.matches ? "dark" : "light" },
  );
  Theme.apply(config, document.body);
  document.querySelector(".system-bar img").src =
    "../../assets/brand/muhit-logo" +
    (config.mode === "dark" ? "-dark" : "") +
    ".svg";
  if ($("token-json")) renderTokens();
}
["palette", "appearance", "density"].forEach((id) =>
  $(id).addEventListener("change", theme),
);
media.addEventListener("change", theme);
disposers.push(() => media.removeEventListener("change", theme));
theme();
const names = {
  system: "Muhit tasarım sistemi",
  corporate: "Daha anlamlı ortak çalışmalar.",
  admin: "Çalışma alanı",
  data: "Araştırma görünümü",
};
const page = Pages.mount(
  "#app",
  {
    version: "1.0.0",
    recipe:
      app === "corporate"
        ? "editorial"
        : app === "admin"
          ? "collection"
          : "overview",
    title: names[app],
    description:
      app === "system"
        ? "Tokenlardan ürünlere: aynı ilkeler, açık sözleşmeler ve çalışan örnekler."
        : "Örnek veri · Sunucu bağlantısı yok · Sekme belleğinde çalışma",
  },
  {
    onRetry: () => {
      page.setState("content");
      if ($("page-state")) $("page-state").value = "content";
    },
  },
);
const main =
  page.regions.main || page.regions.collection || page.regions.article;
main.classList.add("mh-stack-system");
page.regions.rail?.classList.add("mh-stack-system");
disposers.push(() => page.destroy());
function renderTokens() {
  const doc = Tokens.document(config);
  $("token-json").textContent = JSON.stringify(doc, null, 2);
  $("token-count").textContent =
    Tokens.validate(doc).count +
    " doğrulanmış token · " +
    config.preset +
    " / " +
    config.mode;
}
function operationDemo(parent) {
  const area = panel("İşlem ve kurtarma", parent),
    label = el("label", "mh-field", "Çalışma notu"),
    input = el("textarea", "mh-textarea");
  input.id = "flow-draft";
  label.htmlFor = input.id;
  area.append(label, input);
  const choices = el("label", "", "Örnek sonuç"),
    mode = el("select", "mh-select");
  mode.id = "flow-mode";
  for (const [value, text] of [
    ["success", "Yerel onay"],
    ["error", "Hata"],
    ["partial", "Kısmi sonuç"],
  ]) {
    const o = el("option", "", text);
    o.value = value;
    mode.append(o);
  }
  choices.append(mode);
  area.append(choices);
  const line = status(area),
    actions = el("div", "mh-cluster");
  area.append(actions);
  const flow = Flow.create(
    { note: "" },
    {
      run: async (values, signal) => {
        await new Promise((resolve, reject) => {
          const t = setTimeout(resolve, 400);
          signal.addEventListener(
            "abort",
            () => {
              clearTimeout(t);
              reject(new DOMException("Cancelled", "AbortError"));
            },
            { once: true },
          );
        });
        if (mode.value === "error") throw Error("Example failure");
        return {
          outcome: mode.value === "partial" ? "partial" : "success",
          persisted: false,
          ...(mode.value === "partial"
            ? { errors: { record: "Bir kayıt yeniden denenmeli." } }
            : {}),
        };
      },
      onChange: (s) => {
        const busy = ["submitting", "validating"].includes(s.status);
        input.disabled = busy;
        save.disabled = busy;
        cancel.hidden = !busy;
        line.textContent = {
          idle: "Hazır.",
          editing: "Taslak değişti.",
          submitting: "İşleniyor…",
          validating: "Doğrulanıyor…",
          success: "İşlem tamamlandı. Veri kaydedilmedi; taslak korunuyor.",
          partial:
            "Kısmi sonuç. Taslak korunuyor; başarısız kayıtları yeniden deneyin.",
          error: "İşlem başarısız. Taslak korunuyor.",
          cancelled: "İptal edildi. Taslak korunuyor.",
        }[s.status];
      },
    },
  );
  const save = button("Örneği çalıştır", () => flow.submit(), true),
    cancel = button("İşlemi iptal et", () => {
      flow.cancel();
      save.focus();
    }),
    reset = button("Taslağı sıfırla", () => {
      flow.reset();
      input.value = "";
    });
  save.id = "flow-submit";
  cancel.id = "flow-cancel";
  cancel.hidden = true;
  actions.append(save, cancel, reset);
  input.oninput = () => flow.setDraft({ note: input.value });
  disposers.push(() => flow.destroy());
}
if (app === "system") {
  const metrics = page.regions.metrics;
  metrics.classList.add("mh-auto-grid");
  for (const [value, label] of [
    ["16", "Token görünümü"],
    [String(System.contracts.length), "Bileşen sözleşmesi"],
    ["6", "Sayfa tarifi"],
  ]) {
    const card = el("article", "mh-system-panel");
    card.append(el("h2", "", label), el("p", "", value));
    metrics.append(card);
  }
  const tokens = panel("Tokenlar ve kişiselleştirme", main);
  tokens.id = "tokens";
  tokens.append(
    el(
      "p",
      "",
      "Tema değişiklikleri bütün örnekleri etkiler. Tipli tokenlar dışa aktarılır; özel CSS değerleri açık bir extension alanında tutulur.",
    ),
  );
  const tokenCount = el("p");
  tokenCount.id = "token-count";
  const pre = el("pre", "system-code");
  pre.id = "token-json";
  pre.tabIndex = 0;
  pre.setAttribute("aria-label", "Token belgesi");
  tokens.append(
    tokenCount,
    button("Token JSON indir", () =>
      download("muhit.tokens.json", Tokens.exportJSON(config)),
    ),
    pre,
  );
  renderTokens();
  const catalog = panel("Bileşen sözleşmeleri", main),
    label = el("label", "", "Bileşen ara"),
    search = el("input", "mh-input");
  search.type = "search";
  search.id = "contract-search";
  label.htmlFor = search.id;
  const list = el("div", "system-contracts");
  list.tabIndex = 0;
  list.setAttribute("aria-label", "Bileşen sözleşmeleri listesi");
  catalog.append(label, search, list);
  function renderContracts() {
    list.replaceChildren();
    for (const c of System.contracts.filter((c) =>
      (c.id + " " + c.purpose)
        .toLowerCase()
        .includes(search.value.toLowerCase()),
    )) {
      const a = el("article");
      a.append(
        el("h3", "", c.id + " · " + c.status),
        el("p", "", c.purpose),
        el("p", "", c.behavior),
        el("small", "", "Anatomi: " + c.anatomy.join(" · ")),
      );
      list.append(a);
    }
  }
  search.oninput = renderContracts;
  renderContracts();
  const primitives = panel("Ortak davranışlar", main),
    row = el("div", "mh-cluster"),
    trigger = button("Görünüm menüsü", () => {}),
    menu = el("div", "mh-system-menu");
  trigger.id = "menu-trigger";
  for (const mode of ["light", "dark"]) {
    const item = button(
      mode === "light" ? "Açık görünüm" : "Koyu görünüm",
      () => {
        $("appearance").value = mode;
        theme();
      },
    );
    item.role = "menuitem";
    menu.append(item);
  }
  row.append(trigger, menu);
  primitives.append(row);
  disposers.push(Primitives.menu(trigger, menu).destroy);
  const help = button("Saklama bilgisi", () => {});
  help.id = "tooltip-trigger";
  row.append(help);
  disposers.push(
    Primitives.tooltip(
      help,
      "Taslaklar sekme belleğindedir; yenilemede silinir.",
    ).destroy,
  );
  const popTrigger = button("Katman açıklaması", () => {}),
    pop = el("div", "mh-system-menu");
  pop.append(
    el(
      "p",
      "",
      "Ürün, sayfa, bileşen ve token katmanları bağımsız sözleşmelerle bağlanır.",
    ),
    button("Anladım", () => popover.close(true)),
  );
  row.append(popTrigger, pop);
  const popover = Primitives.popover(popTrigger, pop);
  disposers.push(popover.destroy);
  const treeHost = el("div");
  treeHost.id = "system-tree";
  primitives.append(treeHost);
  disposers.push(
    Primitives.tree(
      treeHost,
      [
        {
          id: "foundations",
          label: "Temeller",
          children: [
            { id: "tokens", label: "Tokenlar" },
            { id: "icons", label: "İkonlar" },
          ],
        },
        {
          id: "products",
          label: "Ürünler",
          children: [{ id: "pages", label: "Sayfalar" }],
        },
      ],
      { label: "Sistem katmanları" },
    ).destroy,
  );
  operationDemo(main);
  disposers.push(wizardExample(main));
  const rail = page.regions.rail,
    recipes = panel("Sayfa sistemi", rail),
    select = el("select", "mh-select"),
    recipeLabel = el("label", "", "Sayfa tarifi");
  select.id = "recipe-select";
  recipeLabel.htmlFor = select.id;
  for (const r of Pages.recipes) {
    const o = el("option", "", r.label);
    o.value = r.id;
    select.append(o);
  }
  const state = el("select", "mh-select"),
    stateLabel = el("label", "", "Sayfa durumu");
  state.id = "page-state";
  stateLabel.htmlFor = state.id;
  for (const key of [
    "content",
    "loading",
    "empty",
    "error",
    "forbidden",
    "partial",
  ]) {
    const o = el("option", "", key);
    o.value = key;
    state.append(o);
  }
  const link = el("a", "mh-text-link", "Tarifi ayrı sayfada aç");
  link.href = "../foundations/overview.html";
  recipes.append(recipeLabel, select, link);
  const stateControl = el("div", "system-controls");
  stateControl.append(stateLabel, state);
  page.main.querySelector("header").append(stateControl);
  select.onchange = () => {
    link.href = "../foundations/" + select.value + ".html";
    recipeSummary.textContent = Pages.recipes
      .find((r) => r.id === select.value)
      .regions.join(" → ");
  };
  const recipeSummary = el("p", "", "metrics → main → rail");
  recipes.append(recipeSummary);
  state.onchange = () => page.setState(state.value);
  const patterns = panel("Kullanım örüntüleri", rail);
  for (const pattern of System.patterns) {
    patterns.append(el("h3", "", pattern.id), el("p", "", pattern.contract));
  }
  const agent = panel("AI önerisini incele", main),
    editor = el("textarea", "mh-textarea");
  editor.id = "proposal";
  editor.rows = 10;
  const editorLabel = el("label", "", "Kompozisyon JSON");
  editorLabel.htmlFor = editor.id;
  const sample = {
    version: "1.0.0",
    page: {
      version: "1.0.0",
      recipe: "settings",
      title: "Araştırma notu",
      primaryActionId: "save",
    },
    view: {
      schemaVersion: "1.1.0",
      components: [
        {
          type: "form",
          id: "brief",
          title: "Not",
          fields: [{ name: "note", label: "Araştırma notu", required: true }],
        },
      ],
    },
    actions: [
      {
        id: "save",
        componentId: "brief",
        event: "submit",
        kind: "write",
        label: "Notu işle",
        confirmation: "Bu örnek yalnız yerel onay verir; veri kaydedilmez.",
      },
    ],
    data: { source: "Kurgu örnek", example: true, persistence: "none" },
  };
  editor.value = JSON.stringify(sample, null, 2);
  const message = status(agent),
    preview = el("div");
  preview.id = "agent-preview";
  let session;
  const approval = el("input");
  approval.type = "checkbox";
  approval.id = "approve";
  const approvalLabel = el("label", "mh-check");
  approvalLabel.append(
    approval,
    document.createTextNode(
      " Bu önerinin örnek işlem olarak uygulanmasını onaylıyorum.",
    ),
  );
  function review() {
    try {
      const result = System.review(JSON.parse(editor.value));
      if (!result.valid) throw Error(result.errors.join("\n"));
      if (session) session.update(result.proposal);
      else
        session = System.createSession(result.proposal, {
          approve: () => approval.checked,
          authorize: () => true,
          execute: async () => ({ outcome: "success", persisted: false }),
          onEvent: (event) => {
            if (event.type === "preview")
              message.textContent =
                "Önizleme olayı alındı. Dış işlem çalıştırılmadı.";
          },
        });
      session.preview(preview);
      apply.disabled = false;
      message.textContent = "Geçerli öneri. Önizleme işlemleri veri kaydetmez.";
      approval.checked = false;
    } catch (e) {
      apply.disabled = true;
      message.textContent = "Öneri reddedildi: " + e.message;
    }
  }
  const apply = button("Onaylanan örnek işlemi uygula", async () => {
    if (!session) return;
    const outcome = await session.apply("save", { note: "Örnek" });
    message.textContent =
      outcome.status === "success"
        ? "Örnek işlem tamamlandı. Veri kaydedilmedi."
        : "Onay veya yetki sağlanmadı; işlem uygulanmadı.";
  });
  apply.id = "apply-proposal";
  editor.oninput = () => {
    apply.disabled = true;
    approval.checked = false;
    session?.cancel();
  };
  agent.append(
    editorLabel,
    editor,
    button("Doğrula ve önizle", review, true),
    approvalLabel,
    apply,
    preview,
  );
  review();
  disposers.push(() => session?.destroy());
}
if (app === "corporate") {
  const hero = el("section", "system-hero");
  hero.append(
    el("p", "system-kicker", "İnsan · Doğa · Ortak üretim"),
    el("h2", "", "Bilgiyi birlikte anlamlı işe dönüştürün."),
    el(
      "p",
      "",
      "Araştırmayı, kararları ve insanları aynı bağlamda buluşturan örnek bir kurumsal arayüz. Tutarlı tokenlar ve erişilebilir bileşenlerle oluşturuldu.",
    ),
  );
  const anchor = el(
    "a",
    "mh-button mh-button--primary",
    "Görüşme notu hazırla",
  );
  anchor.href = "#contact";
  hero.append(anchor);
  main.append(hero);
  const cards = el("div", "mh-auto-grid");
  for (const [title, body] of [
    ["Araştırma", "Kaynakları ve açık soruları aynı bağlamda değerlendirin."],
    [
      "Koordinasyon",
      "Sorumlulukları, bağımlılıkları ve kararları görünür tutun.",
    ],
    ["Öğrenme", "Sonuçları ve belirsizlikleri sonraki çalışmaya aktarın."],
  ]) {
    const c = el("article", "mh-card");
    c.append(el("h2", "mh-card__title", title), el("p", "mh-card__body", body));
    cards.append(c);
  }
  main.append(cards);
  const contact = panel("Görüşme notu", main);
  contact.id = "contact";
  const host = el("div");
  contact.append(host);
  disposers.push(
    Form.mount(host, {
      title: "Talebinizi hazırlayın",
      fields: [
        { name: "name", label: "Adınız", required: true },
        { name: "email", label: "E-posta", type: "email", required: true },
        {
          name: "note",
          label: "Görüşme konusu",
          type: "textarea",
          required: true,
        },
      ],
      submitLabel: "Notu indir",
      onSubmit: async (values) => {
        download("gorusme-notu.json", JSON.stringify(values, null, 2));
        return { persisted: false };
      },
    }).destroy,
  );
}
if (app === "admin") {
  const toolbar = page.regions.toolbar;
  const label = el("label", "", "Çalışmalarda ara"),
    search = el("input", "mh-input");
  search.type = "search";
  search.id = "record-filter";
  label.htmlFor = search.id;
  toolbar.append(label, search);
  const split = el("div", "mh-split"),
    list = el("div", "system-records"),
    detail = el("section", "mh-system-panel");
  split.append(list, detail);
  main.append(split);
  const records = [
      {
        id: "research",
        name: "İnsan odaklı araştırma",
        note: "Kaynakları karşılaştır.",
      },
      {
        id: "design",
        name: "Ortak tasarım çalışması",
        note: "Karar gerekçelerini kaydet.",
      },
      {
        id: "review",
        name: "Erişilebilirlik incelemesi",
        note: "Klavye akışını değerlendir.",
      },
    ],
    drafts = new Map();
  let form,
    current = "research";
  function renderList() {
    list.replaceChildren();
    for (const record of records.filter((r) =>
      r.name
        .toLocaleLowerCase("tr")
        .includes(search.value.toLocaleLowerCase("tr")),
    )) {
      const b = button(record.name, () => open(record.id));
      b.dataset.record = record.id;
      b.setAttribute("aria-current", String(record.id === current));
      list.append(b);
    }
  }
  function open(id) {
    if (form) {
      drafts.set(current, form.getSnapshot());
      form.destroy();
    }
    current = id;
    renderList();
    const record = records.find((r) => r.id === id);
    detail.replaceChildren();
    const flow = Flow.create(
      { name: record.name, note: record.note },
      {
        run: async (values, signal) => {
          await new Promise((resolve) => setTimeout(resolve, 350));
          if (signal.aborted) throw Error("Cancelled");
          Object.assign(record, values);
          renderList();
          return { outcome: "success", persisted: true };
        },
      },
    );
    disposers.push(() => flow.destroy());
    form = Form.mount(detail, {
      title: record.name,
      fields: [
        { name: "name", label: "Çalışma adı", required: true },
        { name: "note", label: "Çalışma notu", type: "textarea" },
      ],
      values: { name: record.name, note: record.note },
      ...(drafts.get(id) || {}),
      messages: {
        "Kaydedildi.": "Yalnız bu sekmenin örnek kayıt belleği güncellendi.",
      },
      onSubmit: async (values, signal) => {
        flow.setDraft(values);
        const cancel = () => flow.cancel();
        signal.addEventListener("abort", cancel, { once: true });
        try {
          const result = await flow.submit();
          if (result.status === "cancelled") throw Error("Cancelled");
          if (result.status !== "success") throw Error("Failed");
          return { persisted: true };
        } finally {
          signal.removeEventListener("abort", cancel);
        }
      },
    });
  }
  search.oninput = renderList;
  open(current);
  disposers.push(() => form?.destroy());
  operationDemo(main);
  disposers.push(bulkExample(main));
}
if (app === "data") {
  const metrics = page.regions.metrics;
  metrics.classList.add("mh-auto-grid");
  for (const [label, value] of [
    ["Örnek kayıt", "3"],
    ["Ölçüm dönemi", "2026 Q1"],
    ["Kaynak", "Kurgu veri"],
  ]) {
    const c = el("article", "mh-system-panel");
    c.append(el("h2", "", label), el("p", "", value));
    metrics.append(c);
  }
  const rows = [
      { id: "r1", name: "Araştırma", count: 24 },
      { id: "r2", name: "Tasarım", count: 18 },
      { id: "r3", name: "Değerlendirme", count: 12 },
    ],
    gridHost = el("div"),
    plotHost = el("div");
  main.append(gridHost);
  page.regions.rail.append(plotHost);
  const grid = Grid.mount(gridHost, {
    title: "Çalışma kayıtları",
    selectable: true,
    columns: [
      { key: "name", label: "Çalışma" },
      { key: "count", label: "Katılım", type: "number" },
    ],
    rows,
  });
  disposers.push(grid.destroy);
  disposers.push(
    Plot.mount(plotHost, {
      title: "Örnek katılım",
      unit: "kişi",
      kind: "bar",
      labels: rows.map((r) => r.name),
      series: [
        {
          id: "participation",
          label: "Katılım",
          values: rows.map((r) => r.count),
        },
      ],
    }).destroy,
  );
  const controls = el("div", "system-controls");
  main.prepend(controls);
  controls.append(
    button("Hata durumunu dene", () => page.setState("error")),
    button("Veriyi CSV indir", () =>
      download(
        "ornek-kayitlar.csv",
        "Çalışma,Katılım\n" +
          rows.map((r) => r.name + "," + r.count).join("\n"),
        "text/csv",
      ),
    ),
  );
  const importPanel = panel("İçe aktarma incelemesi", main),
    file = el("input");
  file.type = "file";
  file.accept = ".json,application/json";
  file.id = "import-file";
  const fileLabel = el("label", "", "Örnek kayıt JSON dosyası");
  fileLabel.htmlFor = file.id;
  const output = status(importPanel),
    importPreview = el("div"),
    applyImport = button("Önizlemeyi tabloda kullan", () => {
      if (!pendingRows) return;
      grid.setRows(pendingRows);
      output.textContent =
        "Örnek tablo sekme belleğinde güncellendi. Grafik ayrı örnek seriyi göstermeye devam ediyor.";
      applyImport.disabled = true;
    });
  applyImport.id = "apply-import";
  applyImport.disabled = true;
  let pendingRows = null,
    previewGrid,
    importRevision = 0;
  importPanel.append(importPreview, applyImport);
  disposers.push(() => {
    importRevision++;
    previewGrid?.destroy();
  });
  file.onchange = async () => {
    const revision = ++importRevision;
    applyImport.disabled = true;
    pendingRows = null;
    previewGrid?.destroy();
    try {
      const f = file.files[0];
      if (!f) return;
      if (f.size > 100000) throw Error("Dosya çok büyük");
      const data = JSON.parse(await f.text());
      if (
        !Array.isArray(data) ||
        data.length > 100 ||
        data.some(
          (r) =>
            !r ||
            typeof r.name !== "string" ||
            r.name.length > 240 ||
            typeof r.count !== "number" ||
            !Number.isFinite(r.count) ||
            r.count < 0,
        )
      )
        throw Error("name ve count alanlarını kontrol edin");
      if (revision !== importRevision) return;
      pendingRows = data.map((r, i) => ({
        id: "import-" + i,
        name: r.name,
        count: r.count,
      }));
      previewGrid = Grid.mount(importPreview, {
        title: "İçe aktarma önizlemesi",
        columns: [
          { key: "name", label: "Çalışma" },
          { key: "count", label: "Katılım", type: "number" },
        ],
        rows: pendingRows,
      });
      applyImport.disabled = false;
      output.textContent =
        data.length +
        " kayıt doğrulandı. Önizleme hazır; kayıt veya yükleme yapılmadı.";
    } catch (e) {
      if (revision !== importRevision) return;
      output.textContent = "Dosya reddedildi: " + e.message;
    }
  };
  importPanel.append(fileLabel, file);
}
window.systemReady = true;
window.addEventListener("pagehide", (event) => {
  if (!event.persisted) disposers.forEach((fn) => fn());
});
