/* Muhit Studio: local demo state only. No model, telemetry or remote service. */
(() => {
  "use strict";
  const Theme = globalThis.MuhitTheme;
  const UI = globalThis.Muhit;
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => [...root.querySelectorAll(q)];
  const escape = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const icon = (name) => UI.icon(name);
  const storageKey = "muhit-ui-studio-v1";
  const names = {
    palette: "Palet stüdyosu",
    customize: "Kişiselleştir",
    components: "Bileşenler",
    agents: "Agent laboratuvarı",
    start: "Projeye ekle",
  };
  let config = Theme.normalizeConfig({});
  let route = "palette";
  let tableInstance, chartInstance, agentInstance, dataGridInstance;
  let widgetInstances = [];
  let lastCreated = "",
    bookmarked = false,
    sampleDone = false;
  let componentTab =
    new URLSearchParams(location.search).get("component") || "cards";
  if (
    ![
      "cards",
      "pages",
      "table",
      "charts",
      "forms",
      "feedback",
      "navigation",
      "workflow",
      "overlays",
      "selection",
    ].includes(componentTab)
  )
    componentTab = "cards";
  let agentDraft = "";
  let validatedAgentDraft = "";
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-recipe]");
    if (!button) return;
    const recipes = {
      editorial: {
        font: "editorial",
        density: "spacious",
        radius: "soft",
        elevation: "flat",
        headingScale: 1.15,
        buttonStyle: "outline",
        contentWidth: "focused",
      },
      workspace: {
        font: "humanist",
        density: "compact",
        radius: "soft",
        elevation: "soft",
        headingScale: 1,
        buttonStyle: "solid",
        contentWidth: "wide",
      },
      gallery: {
        font: "book",
        density: "spacious",
        radius: "organic",
        elevation: "raised",
        headingScale: 1.15,
        buttonStyle: "soft",
        contentWidth: "balanced",
      },
    };
    setConfig(recipes[button.dataset.recipe], true);
  });
  function storageMessage(message) {
    const el = $("#storage-message");
    el.hidden = !message;
    el.textContent = message;
  }
  try {
    const stored =
      localStorage.getItem(storageKey) ||
      localStorage.getItem("terali-ui-studio-v1");
    if (stored) config = Theme.fromJSON(stored);
  } catch {
    storageMessage(
      "Kayıtlı tema okunamadı. Varsayılan tema açıldı; ayarları JSON olarak dışa aktarabilirsiniz.",
    );
  }
  Theme.apply(config);
  function save() {
    try {
      localStorage.setItem(storageKey, Theme.toJSON(config));
      storageMessage("");
    } catch {
      storageMessage(
        "Tarayıcıya kayıt yapılamadı. Değişiklikler bu oturumda geçerli; korumak için tema JSON dosyasını indirin.",
      );
    }
  }
  const themeHistory = [],
    themeFuture = [];
  const themeBaseline = { ...config };
  function setConfig(patch, announce = false) {
    const next = Theme.normalizeConfig({ ...config, ...patch });
    themeHistory.push(config);
    if (themeHistory.length > 30) themeHistory.shift();
    themeFuture.length = 0;
    config = next;
    Theme.apply(config);
    save();
    syncTheme();
    if (announce) UI.toast("Tema güncellendi.");
  }
  const orbit = `<svg viewBox="0 0 130 90" fill="none" aria-hidden="true"><path d="M6 63C12 27 47 6 79 15c29 8 43 38 32 58M18 68C24 37 52 17 77 25c22 7 31 29 26 45M31 73C36 48 56 29 76 36c14 5 20 20 17 34M45 74c4-17 17-31 29-27 9 3 12 13 10 23" stroke="currentColor" stroke-width=".8"/><circle cx="112" cy="22" r="10" fill="var(--mh-chart-3)" opacity=".6"/><path d="M2 79h124" stroke="var(--mh-border-strong)" stroke-width=".7"/></svg>`;
  function hero(kicker, title, description, aside = true) {
    return `<div class="hero"><div><div class="eyebrow"><i></i>${kicker}</div><h1>${title}</h1><p class="hero-description">${description}</p></div>${aside ? `<div class="hero-aside">${orbit}<p>Doğadan bir ritim.<br>Sanattan bir ifade.<br>Her projeye açık bir yapı.</p></div>` : ""}</div>`;
  }
  function steps(active) {
    return `<div class="step-strip" aria-label="Tema oluşturma akışı"><a href="#palette" ${active === "palette" ? 'aria-current="step"' : ""}><span class="step-number">1</span>Paletini seç</a><i class="step-line"></i><a href="#customize" ${active === "customize" ? 'aria-current="step"' : ""}><span class="step-number">2</span>Kendine uyarla</a><i class="step-line"></i><a href="#agents" ${active === "agents" ? 'aria-current="step"' : ""}><span class="step-number">3</span>Birlikte üret</a></div>`;
  }
  function preview() {
    return `<div class="preview-wrap"><div class="preview-caption"><span>CANLI BİLEŞEN ÖNİZLEMESİ</span><span class="live-indicator"><i class="status-dot"></i><span data-theme-name></span></span></div><div class="preview-window"><div class="preview-chrome"><i></i><i></i><i></i><span>muhit / ortak yaşam alanı</span>${icon("lock")}</div><div class="preview-content"><div class="preview-nav"><div class="preview-brand">${icon("leaf")}Ortak alan</div><span class="preview-avatar">AY</span></div><div class="preview-welcome"><div><p class="preview-kicker">BİRLİKTE GELİŞTİRİYORUZ</p><h2>Daha iyi bir yarın için.</h2><p>Küçük adımlar, anlamlı bağlantılar.</p></div><button class="mh-button mh-button--primary" data-sample-new>${icon("plus")}<span>Yeni alan</span></button></div><div class="preview-metrics"><div class="preview-metric"><p>Ortak çalışmalar</p><strong>12</strong><small>3 yeni başlangıç</small></div><div class="preview-metric"><p>Katılan insanlar</p><strong>48</strong><small>Birlikte büyüyoruz</small></div><div class="preview-metric"><p>Tamamlanan adımlar</p><strong>86<span style="font-size:14px">%</span></strong><small>Bu ayın planı</small></div></div><div class="preview-lower"><section class="mini-chart" aria-label="Aylık katılım örnek grafiği"><div class="mini-chart-header"><b>Birlikte gelişim</b><span>Son 6 ay</span></div><svg viewBox="0 0 290 125" role="img" aria-label="Örnek veri: katılım ocakta 12, şubatta 18, martta 16, nisanda 26, mayısta 33 ve haziranda 48 kişi"><path d="M8 14H282M8 51H282M8 88H282" stroke="var(--mh-border)" stroke-dasharray="3 4"/><path d="M8 85L62 72L117 77L172 52L227 38L282 10V99H8Z" fill="var(--mh-accent-soft)"/><path d="M8 85L62 72L117 77L172 52L227 38L282 10" fill="none" stroke="var(--mh-chart-1)" stroke-width="2"/><path d="M8 93L62 88L117 90L172 81L227 76L282 61" fill="none" stroke="var(--mh-chart-2)" stroke-width="1.5" stroke-dasharray="4 4"/><g fill="var(--mh-chart-1)"><circle cx="8" cy="85" r="3"/><circle cx="62" cy="72" r="3"/><circle cx="117" cy="77" r="3"/><circle cx="172" cy="52" r="3"/><circle cx="227" cy="38" r="3"/><circle cx="282" cy="10" r="3"/></g><g fill="var(--mh-muted)" font-size="8" font-family="var(--mh-font-body)"><text x="8" y="119">Oca</text><text x="54" y="119">Şub</text><text x="107" y="119">Mar</text><text x="164" y="119">Nis</text><text x="218" y="119">May</text><text x="269" y="119">Haz</text></g></svg><div class="mini-chart-legend"><span><i></i>Katılım</span><span><i></i>Çalışma</span></div></section><article class="mh-card mh-card--sage preview-project"><span class="mh-kicker">ORTAK ÜRETİM</span><h3 class="mh-card__title">Bir bahçeden<br>fazlası.</h3><p class="mh-card__body">Mahallede yeni bağlantılar kuran, herkesin katkısına açık bir alan.</p><div class="mh-card__footer"><span class="mh-badge mh-badge--success">Devam ediyor</span><button class="mh-button mh-button--icon" data-bookmark aria-label="Çalışmayı kaydet" aria-pressed="${bookmarked}">${icon(bookmarked ? "bookmarkFilled" : "bookmark")}</button></div></article></div><div class="preview-task"><label class="mh-check"><input type="checkbox" id="preview-check" ${sampleDone ? "checked" : ""}>${escape(lastCreated || "Yeni fikirleri birlikte gözden geçir")}</label><span class="mh-badge mh-badge--info">Bugün</span></div><div class="preview-bottomline"><span>Örnek proje ve gösterim verileri.</span><span>Senin ritminde, birlikte.</span></div></div></div><p class="preview-footnote">${icon("info")}Bu alan gerçek tokenları kullanır. Renk, yazı, yoğunluk ve köşe ayarları anında görünür.</p></div>`;
  }
  function palettes() {
    const concepts = {
      grove: "Sakin · Organik",
      clay: "Sıcak · Dokulu",
      tide: "Açık · Akışkan",
      atelier: "Özgün · Sanatsal",
      sand: "Sıcak · Sade",
      moss: "Canlı · Köklü",
      plum: "Derin · Şiirsel",
      slate: "Dengeli · Kentli",
    };
    return Theme.presets
      .map(
        (p) =>
          `<button class="palette-option" data-preset="${p.id}" aria-pressed="false" aria-label="${escape(p.name)} paleti"><span class="palette-colors">${[p.colors.background, p.colors.accent, p.colors.secondary, p.colors.tertiary].map((c) => `<i style="background:${c}"></i>`).join("")}</span><span class="palette-name">${escape(p.name)}</span><span class="palette-concept">${concepts[p.id]}</span><span class="palette-check" hidden>✓</span></button>`,
      )
      .join("");
  }
  function palettePage() {
    return `${hero("AÇIK KAYNAK ARAYÜZ KÜTÜPHANESİ", "Arayüzün<br><em>kendi doğası.</em>", "İnsanla doğa arasındaki dengeden doğan, sanata alan açan bir sistem. Paletini seç; bütün bileşenlerin aynı dili konuşsun.")}${steps("palette")}<div class="studio-grid"><section class="inspector" aria-label="Renk paleti ayarları"><h2 class="section-label">Bir başlangıç seç <span class="mh-kicker">8 PALET</span></h2><p class="section-caption">Her palet, birbirini tamamlayan rollerden oluşur.</p><div class="palette-options">${palettes()}</div><hr><span class="control-label">Görünüm</span><div class="mode-control" aria-label="Görünüm"><button data-mode="light" aria-pressed="false">☼ &nbsp; Açık</button><button data-mode="dark" aria-pressed="false">☾ &nbsp; Koyu</button></div><hr><label class="control-label" for="accent-hex">Vurgu rengi</label><div class="accent-input-row"><input type="color" id="accent-picker" aria-label="Vurgu rengini seç"><input type="text" id="accent-hex" maxlength="7" spellcheck="false" aria-describedby="accent-error" placeholder="#2E5948"></div><p id="accent-error" class="mh-field__error" role="status"></p><button class="small-link" id="reset-accent">Paletin özgün rengini kullan</button><hr><div class="audit-summary" id="audit-summary"></div><ul class="audit-list" id="audit-list"></ul><details class="audit-details"><summary>Tüm kontrast ölçümleri</summary><ul class="audit-list" id="audit-more"></ul></details><p class="audit-note">Seçili metin ve odak rengi eşleşmeleri ölçülür. Bu kontrol, tam erişilebilirlik denetimi değildir. <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" target="_blank" rel="noreferrer">Ölçüt ↗</a></p></section>${preview()}</div>${tokenSection()}`;
  }
  function tokenSection() {
    return `<section class="token-section"><div class="section-heading"><div><h2>Renklere bir rol ver.</h2><p>Değer değişir, anlamı kalır. Tokena tıklayarak CSS değişkenini kopyala.</p></div><button class="small-link" data-download="css">CSS indir ↗</button></div><div class="token-grid" id="token-grid"></div></section>`;
  }
  function selectControl(key, label, options, help = "") {
    return `<div class="control-group"><label class="control-label" for="config-${key}">${label}</label><select id="config-${key}" data-config="${key}">${options.map(([value, text]) => `<option value="${value}">${text}</option>`).join("")}</select>${help ? `<small>${help}</small>` : ""}</div>`;
  }
  function customizePage() {
    return `${hero("KİŞİSELLEŞTİRME", "Aynı öz.<br><em>Sana ait bir ifade.</em>", "Görünümü projenin temposuna uyarla. Her seçim taşınabilir bir ayara dönüşür; aynı tema insanlar ve agent’lar tarafından kullanılabilir.")}${steps("customize")}<div class="studio-grid"><section class="inspector" aria-label="Kişiselleştirme ayarları"><h2 class="section-label">Kendi ritmini bul</h2><div class="theme-history"><button class="mh-button" id="theme-undo">Geri al</button><button class="mh-button" id="theme-redo">Yinele</button></div><details><summary>Başlangıçla karşılaştır</summary><ul id="theme-diff" class="theme-diff"></ul></details><p class="section-caption">Bileşenlerin ortak ayarları.</p><div class="theme-recipes"><button class="mh-button" data-recipe="editorial">Editoryal</button><button class="mh-button" data-recipe="workspace">Çalışma alanı</button><button class="mh-button" data-recipe="gallery">Galeri</button></div>${selectControl(
      "font",
      "Yazı karakteri",
      [
        ["editorial", "Editoryal · Serif + Manrope"],
        ["humanist", "Yalın · Manrope"],
        ["system", "Sistem yazı karakteri"],
        ["book", "Kitap · Source Serif 4"],
      ],
      "Editoryal başlıklar Source Serif 4 kullanır.",
    )}${selectControl(
      "density",
      "İçerik yoğunluğu",
      [
        ["comfortable", "Rahat · Daha fazla nefes"],
        ["compact", "Kompakt · Daha fazla içerik"],
        ["spacious", "Ferah · Geniş boşluklar"],
      ],
      "Kompakt görünümde de temel dokunma alanları korunur.",
    )}${selectControl("radius", "Köşe dili", [
      ["soft", "Yumuşak"],
      ["round", "Yuvarlak"],
      ["square", "Keskin"],
      ["organic", "Organik"],
    ])}${selectControl("scale", "Metin ölçeği", [
      ["1", "%100 · Standart"],
      ["1.125", "%112,5 · Geniş"],
      ["1.25", "%125 · Büyük"],
    ])}${selectControl("border", "Sınır belirginliği", [
      ["subtle", "Hafif"],
      ["strong", "Belirgin"],
    ])}${selectControl("motion", "Hareket", [
      ["system", "Sistem tercihine uy"],
      ["reduced", "Hareketi azalt"],
    ])}<details class="theme-details" open><summary>Yüzey, düzen ve ifade</summary>${selectControl(
      "elevation",
      "Yüzey derinliği",
      [
        ["flat", "Düz"],
        ["soft", "Hafif gölge"],
        ["raised", "Yükseltilmiş"],
      ],
    )}${selectControl("buttonStyle", "Buton dili", [
      ["solid", "Dolu"],
      ["soft", "Yumuşak"],
      ["outline", "Çerçeveli"],
    ])}${selectControl("controlSize", "Kontrol boyutu", [
      ["sm", "Küçük"],
      ["md", "Orta"],
      ["lg", "Büyük"],
    ])}${selectControl("headingScale", "Başlık ölçeği", [
      [0.9, "Sakin"],
      [1, "Dengeli"],
      [1.15, "İfadeli"],
    ])}${selectControl("lineHeight", "Satır aralığı", [
      [1.45, "Sıkı"],
      [1.65, "Dengeli"],
      [1.85, "Ferah"],
    ])}${selectControl("contentWidth", "İçerik genişliği", [
      ["focused", "Odaklı"],
      ["balanced", "Dengeli"],
      ["wide", "Geniş"],
    ])}${selectControl("borderWidth", "Çizgi kalınlığı", [
      [1, "İnce · 1 px"],
      [2, "Belirgin · 2 px"],
    ])}${selectControl("iconWeight", "İkon çizgisi", [
      [1.25, "İnce"],
      [1.5, "Dengeli"],
      [2, "Kalın"],
    ])}${selectControl("accentIntensity", "Vurgu yoğunluğu", [
      ["soft", "Hafif"],
      ["balanced", "Dengeli"],
      ["vivid", "Canlı"],
    ])}${selectControl("chartPalette", "Grafik renkleri", [
      ["natural", "Doğal"],
      ["contrast", "Ayrışan"],
      ["mono", "Tek renk ailesi"],
    ])}${selectControl("cardSurface", "Kart yüzeyi", [
      ["plain", "Düz"],
      ["tinted", "Tonlu"],
      ["outline", "Saydam"],
    ])}${selectControl("layoutGap", "Bileşen aralığı", [
      ["compact", "Yakın"],
      ["balanced", "Dengeli"],
      ["airy", "Ferah"],
    ])}${selectControl("tableRows", "Tablo satırları", [
      ["plain", "Düz"],
      ["striped", "Şeritli"],
    ])}${selectControl("tableHeader", "Tablo başlığı", [
      ["static", "Akışta"],
      ["sticky", "Sabit"],
    ])}</details><hr><button class="mh-button" id="reset-theme">Başlangıca dön</button><p class="audit-note">Sadece bu stüdyonun tema ayarları sıfırlanır.</p></section>${preview()}</div><div class="form-note"><strong>Görsel tercihler, tek bir sözleşme.</strong> Palet, tipografi, boşluk, yüzey, kontrol boyutu, grafik dili ve hareket tercihleri tek bir tema sözleşmesinde. JSON olarak dışa aktar, başka bir projede veya agent çıktısında aynı ayarları uygula.</div>`;
  }
  let pageRecipe = ["workspace", "collection", "detail"].includes(
    new URLSearchParams(location.search).get("page"),
  )
    ? new URLSearchParams(location.search).get("page")
    : "workspace";
  function resourceCards() {
    return `<div class="mh-card-grid"><article class="mh-card mh-card--horizontal"><span class="mh-card__icon mh-card__icon--sage">${icon("book")}</span><div><span class="mh-card__eyebrow">KAYNAK KARTI</span><h3 class="mh-card__title">Ortak bilgi rehberi</h3><p class="mh-card__body">Araştırmanın bağlamı, kaynağı ve bir sonraki adımı tek bir yerde.</p><div class="mh-card__meta"><span>Rehber</span><span>Örnek içerik · 6 bölüm</span></div></div><div class="mh-card__footer"><span class="mh-badge">Bilgi tasarımı</span><button class="mh-button" data-resource-open>Özeti incele</button></div></article><article class="mh-card"><span class="mh-card__eyebrow">GÖREV KARTI</span><h3 class="mh-card__title">Araştırma sorularını netleştir</h3><p class="mh-card__body">Amacı, kapsamı ve kimleri dinleyeceğini birlikte belirle.</p><div class="mh-card__meta">Örnek görev · Ekip değerlendirmesi</div><label class="mh-label"><input type="checkbox" data-task-complete ${sampleDone ? "checked" : ""}> ${sampleDone ? "Tamamlandı" : "Tamamlandı olarak işaretle"}</label><div class="mh-card__footer"><span class="mh-badge">${sampleDone ? "Tamamlandı" : "Planlandı"}</span><span class="mh-small">Oturumluk örnek</span></div></article></div>`;
  }
  function pagesDemo() {
    const titles = {
      workspace: "Birlikte çalışmanın alanı.",
      collection: "Bilgiye bir yer aç.",
      detail: "Bir sorudan, ortak anlayışa.",
    };
    return `<div class="mh-page-switch" role="group" aria-label="Sayfa şablonu">${[
      ["workspace", "Çalışma alanı"],
      ["collection", "Koleksiyon"],
      ["detail", "Ayrıntı"],
    ]
      .map(
        ([id, label]) =>
          `<button class="mh-button" data-page-recipe="${id}" aria-pressed="${pageRecipe === id}">${label}</button>`,
      )
      .join(
        "",
      )}</div><section class="mh-page"><header class="mh-page__header"><div><p class="mh-page__breadcrumb">Ortak alan / ${pageRecipe === "detail" ? "Araştırma ayrıntısı" : "Çalışmalar"}</p><h2 class="mh-page__title">${titles[pageRecipe]}</h2><p class="mh-page__description">${pageRecipe === "detail" ? "Kapsam, kaynak ve kararlar aynı bağlamda." : "İnsanların katkısını, bilginin bağlamını ve sıradaki adımı görünür tut."}</p></div><span class="mh-badge mh-badge--info">Örnek sayfa</span></header>${pageRecipe === "collection" ? resourceCards() : `<div class="mh-page__body"><div class="mh-page__main">${pageRecipe === "detail" ? `<article class="mh-card"><span class="mh-card__eyebrow">ARAŞTIRMA ÇERÇEVESİ</span><h3 class="mh-card__title">İnsanlar bilgiyi nasıl paylaşır?</h3><p class="mh-card__body">Görüşmeler ve çalışma notları üzerinden ortak ihtiyaçları anlamak için hazırlanmış örnek kapsam.</p><div class="mh-card__meta">Taslak · İnsan değerlendirmesi bekliyor</div><progress class="mh-progress" value="40" max="100" aria-label="Örnek araştırma ilerlemesi yüzde 40"></progress></article><details class="mh-card"><summary>Karar ve kaynak notları</summary><p class="mh-card__body">Görüşme planı henüz taslak. Katılımcı onayı ve araştırma kapsamı ekip tarafından değerlendirilecek.</p></details>` : resourceCards()}</div><aside class="mh-page__aside" aria-label="Çalışma bağlamı"><article class="mh-card"><span class="mh-card__eyebrow">SIRADAKİ ADIM</span><h3 class="mh-card__title">Önce birlikte düşün.</h3><p class="mh-card__body">Varsayımları paylaş, ihtiyaçları dinle ve küçük bir adımla başla.</p></article><div class="mh-page__empty"><h3>Henüz karar yok.</h3><p>Ekibin kararları burada yer alacak.</p></div></aside></div>`}</section><details class="mh-code"><summary>Sayfa iskeletinin HTML kodu</summary><pre>${escape('<section class="mh-page">\n  <header class="mh-page__header">…</header>\n  <div class="mh-page__body">\n    <main class="mh-page__main">…</main>\n    <aside class="mh-page__aside">…</aside>\n  </div>\n</section>')}</pre></details>`;
  }
  document.addEventListener("click", (event) => {
    const b = event.target.closest("[data-page-recipe], [data-resource-open]");
    if (!b) return;
    if (b.dataset.pageRecipe) {
      pageRecipe = b.dataset.pageRecipe;
      const url = new URL(location.href);
      url.searchParams.set("page", pageRecipe);
      history.pushState({}, "", url);
      mountComponent();
      document.querySelector(`[data-page-recipe="${pageRecipe}"]`)?.focus();
    } else
      UI.toast(
        "Örnek rehber: bağlamı tanımla, kaynakları ilişkilendir, sorumluluğu görünür tut.",
      );
  });
  document.addEventListener("change", (event) => {
    if (event.target.matches("[data-task-complete]")) {
      sampleDone = event.target.checked;
      const card = event.target.closest(".mh-card");
      card.querySelector(".mh-badge").textContent = sampleDone
        ? "Tamamlandı"
        : "Planlandı";
    }
  });

  function cardsDemo() {
    return `${resourceCards()}<div class="component-cards" style="margin-top:var(--mh-layout-gap)"><article class="mh-card"><span class="mh-card__icon mh-card__icon--sage">${icon("leaf")}</span><span class="mh-kicker">PROJE KARTI</span><h2 class="mh-card__title">Birlikte kök sal.</h2><p class="mh-card__body">Bir fikri, insanların katılabildiği bir çalışmaya dönüştür. Proje kartı başlığı, özeti, durumu ve eylemi aynı yerde tutar.</p><div class="mh-card__footer"><span class="mh-badge mh-badge--success">Katılıma açık</span><button class="mh-button" data-sample-new>Başla ${icon("arrow")}</button></div></article><article class="mh-card mh-card--sage"><span class="mh-kicker">ÖLÇÜM KARTI · ÖRNEK VERİ</span><p class="mh-metric__label">Bu ay ortak üretime katılan</p><strong class="mh-metric__value">48 <small style="font-size:16px">kişi</small></strong><p class="mh-card__body">Ölçümün birimi ve dönemi görünür. Değerin nasıl yorumlanacağını insan belirler.</p><label class="mh-label" for="metric-progress">Aylık katılım hedefi · %80</label><progress class="mh-progress" id="metric-progress" value="80" max="100">%80</progress><div class="mh-card__footer"><span class="mh-badge mh-badge--info">Haziran örneği</span><span class="mh-small">48 / 60 kişi</span></div></article><article class="mh-card mh-card--ink"><span class="mh-kicker">EDİTORYAL KART</span><h2 class="mh-card__title">Daha az gürültü.<br>Daha çok bağ.</h2><p class="mh-card__body">Renk bir vurgu, boşluk bir nefes, tipografi bir ses. Estetik; anlamı ve kullanılabilirliği destekler.</p><div class="mh-card__footer"><span class="mh-small">Muhit tasarım yaklaşımı</span><button class="mh-button mh-button--icon" data-bookmark aria-label="Çalışmayı kaydet" aria-pressed="${bookmarked}">${icon(bookmarked ? "bookmarkFilled" : "bookmark")}</button></div></article></div><details class="mh-code"><summary>Kartın HTML kodunu gör</summary><pre>${escape('<article class="mh-card">\n  <h2 class="mh-card__title">Birlikte kök sal.</h2>\n  <p class="mh-card__body">Ortak üretim için bir alan.</p>\n  <button class="mh-button mh-button--primary">Başla</button>\n</article>')}</pre></details>`;
  }
  function formDemo() {
    return `<form class="mh-panel demo-form" id="demo-form"><h2 class="mh-panel__title">Ortak çalışma oluştur</h2><p class="mh-muted mh-small">Doğrulama, hata ve tamamlanma durumlarını deneyin. Form bu örnekte bir sunucuya gönderilmez.</p><div class="mh-field"><label for="demo-title">Çalışma adı</label><input class="mh-input" id="demo-title" required maxlength="80" placeholder="Örn. Kıyı temizliği"><p class="mh-field__help">Kısa, anlaşılır ve davetkâr bir ad.</p></div><div class="mh-field"><label for="demo-category">Çalışma alanı</label><select class="mh-select" id="demo-category"><option>İnsan ve doğa</option><option>Sanat ve kültür</option><option>Bilgi ve araştırma</option></select></div><div class="mh-field"><label for="demo-notes">Neyi birlikte değiştirmek istiyoruz?</label><textarea class="mh-textarea" id="demo-notes" maxlength="500" placeholder="Bir cümleyle niyetini paylaş."></textarea></div><label class="mh-switch"><input type="checkbox" checked>Katılımcılara açık olsun</label><div class="demo-form-actions"><button class="mh-button mh-button--primary" type="submit">Önizlemeyi oluştur</button><button class="mh-button" type="reset">Temizle</button></div><p id="demo-result" role="status" class="mh-field__help"></p></form>`;
  }
  function feedbackDemo() {
    return `<div class="status-samples">${[
      ["success", "Hazır", "Tema dosyası projeye aktarılabilir."],
      ["info", "Bağlamı görünür tut", "Bu kartlar örnek veriyle çalışır."],
      [
        "warning",
        "İnceleme gerekiyor",
        "Agent çıktısını kullanmadan önce doğrula.",
      ],
      [
        "danger",
        "İşlem tamamlanamadı",
        "Hatalı alanı düzeltip yeniden deneyebilirsin.",
      ],
    ]
      .map(
        ([tone, title, description]) =>
          `<div class="mh-alert mh-alert--${tone}">${icon(tone === "success" ? "check" : "info")}<div><strong>${title}</strong>${description}</div></div>`,
      )
      .join(
        "",
      )}</div><div class="mh-panel"><h2 class="mh-panel__title">Geri bildirim, anlamıyla birlikte.</h2><p class="mh-muted" style="margin:12px 0">Durum sadece renkle anlatılmaz. Metin ve ikon, aynı anlamı taşır.</p><div class="mh-row"><button class="mh-button" id="show-toast">Bildirim göster</button><button class="mh-button" data-sample-new>Dialog aç</button><button class="mh-button" disabled>İşlem kullanılamıyor</button></div></div>`;
  }
  const widgetExamples = {
    tabs: {
      title: "Bir fikrin etrafında",
      items: [
        {
          id: "purpose",
          label: "Niyet",
          content:
            "Mahallenin ortak bahçesini insan, doğa ve sanatın buluştuğu bir alana dönüştürüyoruz.",
        },
        {
          id: "people",
          label: "İnsanlar",
          content:
            "Tasarımcılar, komşular ve yerel üreticiler birlikte karar verir.",
        },
        {
          id: "impact",
          label: "Etki",
          content:
            "Katılım, erişilebilirlik ve bakım sürekliliğini birlikte değerlendiririz.",
        },
      ],
      type: "tabs",
      id: "demo-tabs",
    },
    accordion: {
      title: "Birlikte çalışma rehberi",
      items: [
        {
          id: "join",
          title: "Nasıl katkı sunabilirim?",
          content:
            "Küçük bir fikir, bir saatlik emek veya bir deneyim paylaşımıyla başlayabilirsin.",
        },
        {
          id: "care",
          title: "Bakımı nasıl paylaşırız?",
          content:
            "Görevleri görünür tutar, sorumlulukları gönüllü katılımla sırayla üstleniriz.",
        },
        {
          id: "decisions",
          title: "Kararları kim alır?",
          content:
            "Katılımcılar bağlamı inceler, önerileri tartışır ve ortak karar verir.",
        },
      ],
      type: "accordion",
      id: "demo-accordion",
    },
    pagination: {
      title: "Arşivde gezin",
      total: 126,
      pageSize: 12,
      type: "pagination",
      id: "demo-pagination",
    },
    timeline: {
      title: "Birlikte büyüyen bir süreç",
      items: [
        {
          id: "listen",
          title: "Mahalleyle tanışma",
          description: "İhtiyaçları ve beklentileri dinledik.",
          time: "12 Haziran",
          state: "complete",
        },
        {
          id: "design",
          title: "Ortak tasarım atölyesi",
          description: "Fikirleri küçük denemelere dönüştürüyoruz.",
          time: "20 Haziran",
          state: "active",
        },
        {
          id: "grow",
          title: "İlk ekim günü",
          time: "28 Haziran",
          state: "planned",
        },
      ],
      type: "timeline",
      id: "demo-timeline",
    },
    kanban: {
      title: "Ortak çalışma panosu",
      columns: [
        { id: "ideas", title: "Fikirler" },
        { id: "doing", title: "Üretiyoruz" },
        { id: "done", title: "Tamamlandı" },
      ],
      items: [
        {
          id: "seeds",
          title: "Yerel tohum arşivi",
          column: "ideas",
          description: "Üreticilerle ilk görüşmeler.",
          tag: "Doğa",
        },
        {
          id: "workshop",
          title: "Açık atölye",
          column: "doing",
          description: "Birlikte üretmek için masa başına.",
          tag: "Sanat",
        },
        { id: "map", title: "Mahalle haritası", column: "done", tag: "İnsan" },
      ],
      type: "kanban",
      id: "demo-kanban",
    },
    stepper: {
      title: "Yeni bir ortak alan",
      steps: [
        {
          id: "intent",
          title: "Niyet",
          description: "Neyi değiştirmek istediğini anlat.",
        },
        {
          id: "team",
          title: "Katılımcılar",
          description: "Birlikte çalışacağın kişileri belirle.",
        },
        {
          id: "review",
          title: "Değerlendirme",
          description: "Kapsamı, kaynakları ve sorumlulukları gözden geçir.",
        },
      ],
      type: "stepper",
      id: "demo-stepper",
    },
    choices: {
      title: "Çalışmanın odağını seç",
      multiple: true,
      value: ["nature"],
      options: [
        {
          id: "nature",
          label: "Doğa",
          description: "Yaşamı destekleyen yerel çalışmalar.",
        },
        {
          id: "people",
          label: "İnsan",
          description: "Erişilebilir ve ortak üretim alanları.",
        },
        {
          id: "art",
          label: "Sanat",
          description: "Yeni bakışlara yer açan deneyimler.",
        },
      ],
      type: "choices",
      id: "demo-choices",
    },
    filepicker: {
      title: "Referanslarını ekle",
      accept: "images",
      maxFiles: 4,
      maxSizeMB: 5,
      type: "filepicker",
      id: "demo-filepicker",
    },
    command: {
      title: "Çalışma alanında bul",
      placeholder: "Sayfa, proje veya eylem ara…",
      items: [
        {
          id: "garden",
          label: "Mahalle bahçesi",
          description: "Ortak proje",
          group: "Projeler",
        },
        {
          id: "atelier",
          label: "Açık atölye",
          description: "Sanat ve üretim",
          group: "Projeler",
        },
        { id: "new", label: "Yeni çalışma oluştur", group: "Eylemler" },
        { id: "archive", label: "Araştırma arşivi", group: "Kaynaklar" },
      ],
      type: "command",
      id: "demo-command",
    },
    drawer: {
      title: "Çalışma bağlamı",
      description: "Bir kararın arkasındaki kaynaklar ve insanlar.",
      items: [
        {
          id: "owner",
          title: "Sorumluluk",
          description: "Mahalle çalışma grubu",
        },
        {
          id: "source",
          title: "Kaynaklar",
          description: "Yerel görüşmeler ve açık atölye notları",
        },
        {
          id: "next",
          title: "Sonraki adım",
          description: "Katılımcı geri bildirimlerini birlikte incele",
        },
      ],
      type: "drawer",
      id: "demo-drawer",
    },
  };
  const widgetGroups = {
    navigation: ["tabs", "accordion", "pagination"],
    workflow: ["kanban", "stepper", "timeline"],
    overlays: ["command", "drawer"],
    selection: ["choices", "filepicker"],
  };
  function componentsPage() {
    return `${hero("BİLEŞEN KÜTÜPHANESİ", "Parçalar uyumlu.<br><em>Olasılıklar açık.</em>", "Kartlar, veri tabloları, grafikler ve form öğeleri aynı tema dilini kullanır. Bunlar projene taşıyabileceğin çalışan bileşenlerdir.")}<div class="component-tabs" aria-label="Bileşen türü">${[
      ["cards", "cards", "Kartlar"],
      ["pages", "layers", "Sayfalar"],
      ["table", "table", "Tablo"],
      ["charts", "chart", "Grafikler"],
      ["forms", "form", "Formlar"],
      ["feedback", "bell", "Geri bildirim"],
      ["navigation", "arrow", "Gezinme"],
      ["workflow", "leaf", "İş akışı"],
      ["overlays", "search", "Komut & panel"],
      ["selection", "form", "Seçim & dosya"],
    ]
      .map(
        ([id, i, label]) =>
          `<button class="mh-button" data-component-tab="${id}" aria-pressed="${componentTab === id}">${icon(i)}${label}</button>`,
      )
      .join(
        "",
      )}</div><div id="component-display" class="component-display"></div>`;
  }
  function fallbackSpec() {
    return {
      schemaVersion: "1.0.0",
      components: [
        {
          type: "card",
          id: "garden",
          title: "Birlikte kök sal.",
          description:
            "Mahalle bahçesi için ortak bir başlangıç. Bu içerik örnektir.",
          action: { id: "join-garden", label: "Katılmak istiyorum" },
        },
        {
          type: "metric",
          id: "participants",
          label: "Örnek katılımcı sayısı",
          value: "48",
          note: "Haziran · gösterim verisi",
        },
        {
          type: "notice",
          id: "review",
          title: "Kontrol sende",
          message:
            "Bu görünüm JSON’dan üretilir. Eylem düğmesi yalnız bir callback çağırır.",
          tone: "info",
        },
      ],
    };
  }
  function exampleSpec() {
    return JSON.parse(
      JSON.stringify(globalThis.MuhitStudioExample || fallbackSpec()),
    );
  }
  function agentsPage() {
    if (!agentDraft) agentDraft = JSON.stringify(fallbackSpec(), null, 2);
    return `${hero("AGENT LABORATUVARI", "Aynı dilde tasarla.<br><em>Kontrolü elinde tut.</em>", "Agent’ın ürettiği JSON’u doğrula, bileşenlere dönüştür ve eylemleri kendi uygulamana bağla. Bu laboratuvar yerel ve deterministik çalışır; bir AI modeline bağlı değildir.")}${steps("agents")}<div class="agent-layout"><div class="agent-editor-panel"><div class="section-heading"><div><h2>Bir arayüz sözleşmesi.</h2><p>18 bileşen türü: veri, gezinme, iş akışı, seçim ve komut bileşenleri.</p></div></div><label for="agent-editor" class="mh-sr-only">Arayüz JSON tanımı</label><textarea id="agent-editor" class="agent-editor" spellcheck="false">${escape(agentDraft)}</textarea><div class="agent-controls"><button class="mh-button mh-button--primary" id="render-agent">Doğrula ve oluştur ${icon("arrow")}</button><button class="mh-button" id="add-agent-theme">Temamı ekle</button><button class="mh-button" id="agent-extended-example">Form, tablo & grafik</button><button class="mh-button" id="agent-rich-example">Sayfa & kart durumları</button><button class="mh-button" id="agent-full-example">Veri örneğini aç</button><button class="mh-button" id="agent-workflow-example">İş akışı örneği</button></div><div id="agent-result" class="agent-result" role="status"></div><div class="mh-row"><button class="small-link" id="download-spec">JSON indir</button><a class="small-link" href="schemas/ui.schema.json">JSON Schema ↗</a><a class="small-link" href="docs/AGENT-CONTRACT.md">Agent sözleşmesi ↗</a></div><div class="form-note">Ham HTML ve çalıştırılabilir kod kabul edilmez. Bileşen eylemleri bir <code>onAction</code> callback’i üretir. Ağ, model ve iş mantığı bağlantısını uygulaman kurar.</div></div><div><div class="preview-caption"><span>JSON → DOĞRULAMA → ARAYÜZ</span><span>MuhitAgent.render()</span></div><div id="agent-output" class="agent-output"></div><p id="agent-event" class="agent-event" role="status">Bir kart eylemine tıklayarak callback olayını incele.</p></div></div>`;
  }
  function startPage() {
    return `${hero("PROJENE TAŞI", "Küçük bir çekirdek.<br><em>Açık bir başlangıç.</em>", "Framework gerektirmeyen bileşenler, CSS tokenları ve doğrulanabilir arayüz tanımları. Kendi projelerinde kullan, değiştir ve geliştir.")}<section class="principles"><article><span>01 / İNSAN</span><h2>Kontrol insanda.</h2><p>Okunur metinler, görünür durumlar ve açıklanabilir eylemler. Agent bir arayüz önerir; uygulama sınırları belirler.</p></article><article><span>02 / DOĞA</span><h2>Az kaynak, net iş.</h2><p>Çalışma zamanında harici servis ve framework bağımlılığı yok. Yerel fontlar ve hareket azaltma seçeneği var. Çevresel etki ölçüldüğü iddia edilmez.</p></article><article><span>03 / İFADE</span><h2>Öz aynı, dil senin.</h2><p>Palet, yazı ve ritim değişebilir. Renklerin görevleri ve bileşenlerin davranış sözleşmesi sabit kalır.</p></article></section><div class="install-grid"><section class="install-card"><h2>01. Doğrudan HTML</h2><p>Kütüphane klasörünü projene kopyala. Bileşenleri <code>mh-scope</code> içinde kullan.</p><pre class="code-block">${escape('<link rel="stylesheet" href="muhit-ui/styles/index.css">\n<script src="muhit-ui/src/theme.js"></script>\n<script src="muhit-ui/src/components.js"></script>\n\n<div class="mh-scope" id="my-app">\n  <button class="mh-button mh-button--primary">\n    Birlikte başla\n  </button>\n</div>\n<script>\n  MuhitTheme.apply({ preset: "grove" },\n    document.querySelector("#my-app"));\n</script>')}</pre><a class="mh-text-link" href="examples/basic.html">Çalışan HTML örneğini aç ${icon("arrow")}</a></section><section class="install-card"><h2>02. ESM + TypeScript</h2><p>Kaynak klasöründe <code>npm pack</code> ile paketle. Üretilen yerel dosyayı projenin paket yöneticisiyle yükle.</p><pre class="code-block">${escape('npm install ./muhit-ui-0.10.0.tgz\n\nimport { MuhitTheme, MuhitAgent } from "muhit-ui";\nimport "muhit-ui/styles/index.css";\n\nMuhitTheme.apply({ preset: "clay", mode: "dark" });\nconst result = MuhitAgent.validate(spec);\nif (result.valid) {\n  MuhitAgent.render(root, spec, {\n    onAction: ({ id, componentId }) => {\n      console.log(id, componentId);\n    }\n  });\n}')}</pre><p>TypeScript tanımları paketle gelir. Paket yerel kullanım için hazırlanmıştır; npm kayıt sistemine henüz yayımlanmamıştır.</p></section><section class="install-card"><h2>Agent’a bağlam ver.</h2><p>Agent’ına aşağıdaki kaynakları ver. Önerdiği tanımı, render işleminden önce doğrula. Serbest metni doğrudan HTML olarak çalıştırma.</p><div class="file-links"><a class="mh-button" href="llms.txt">llms.txt ↗</a><a class="mh-button" href="AGENTS.md">AGENTS.md ↗</a><a class="mh-button" href="schemas/components.json">Bileşen manifesti ↗</a></div><pre class="code-block">${escape("Muhit UI ui.schema.json şemasına uyan\nbir JSON arayüz tanımı üret.\nTema: grove / light.\nBir ortak üretim projesi için kart,\nkatılım metriği ve bilgi notu kullan.\nHam HTML, URL veya çalıştırılabilir kod ekleme.\nÖrnek verileri açıkça belirt.")}</pre></section><section class="install-card"><h2>Açık ve taşınabilir.</h2><p>Kod MIT lisanslıdır. Dahil edilen Source Serif 4 ve Manrope fontları kendi SIL Open Font License dosyalarıyla dağıtılır.</p><div class="file-links"><a class="mh-button" href="LICENSE">MIT lisansı ↗</a><a class="mh-button" href="NOTICE">Font lisansları ↗</a><a class="mh-button" href="README.md">README ↗</a></div><ul><li>8 palet, 2 görünüm, özel vurgu rengi.</li><li>16 kişiselleştirme alanı + tema seçimi.</li><li>Yeniden kullanılabilir kart, tablo, grafik ve form öğeleri.</li><li>JSON şeması, ESM API ve TypeScript tanımları.</li></ul></section></div><p class="release-note"><strong>0.10.0 / Muhit kimliği.</strong> Muhit UI, Nevmos arayüz çalışmalarından türetilen bağımsız bir kütüphanedir. Nevmos marka varlıkları bu pakete dahil değildir. Muhit adı, doğa ve çevreyle ilişkisi için seçildi. Kontrast kontrolleri seçili token çiftleriyle sınırlıdır; ürününde klavye, ekran okuyucu ve içerik testlerini tamamla.</p>`;
  }
  function syncTheme() {
    if (document.querySelector("#theme-undo"))
      document.querySelector("#theme-undo").disabled = !themeHistory.length;
    if (document.querySelector("#theme-redo"))
      document.querySelector("#theme-redo").disabled = !themeFuture.length;
    const diff = document.querySelector("#theme-diff");
    if (diff) {
      const keys = Object.keys(config).filter(
        (k) => config[k] !== themeBaseline[k],
      );
      diff.innerHTML = keys.length
        ? keys
            .map(
              (k) =>
                `<li>${escape(k)}: ${escape(themeBaseline[k] ?? "Varsayılan")} → ${escape(config[k] ?? "Varsayılan")}</li>`,
            )
            .join("")
        : "<li>Oturum başlangıcından farklı ayar yok.</li>";
    }

    const { tokens } = Theme.resolve(config);
    const preset = Theme.presets.find((p) => p.id === config.preset);
    $$("[data-theme-name]").forEach(
      (el) =>
        (el.textContent = `${preset.name} · ${config.mode === "dark" ? "Koyu" : "Açık"}`),
    );
    $$("[data-preset]").forEach((el) => {
      const active = el.dataset.preset === config.preset;
      el.setAttribute("aria-pressed", active);
      $(".palette-check", el).hidden = !active;
    });
    $$("[data-mode]").forEach((el) =>
      el.setAttribute("aria-pressed", el.dataset.mode === config.mode),
    );
    if ($("#accent-picker")) {
      $("#accent-picker").value = tokens["--mh-accent"];
      if (document.activeElement !== $("#accent-hex"))
        $("#accent-hex").value = tokens["--mh-accent"];
    }
    $$("[data-config]").forEach((el) => (el.value = config[el.dataset.config]));
    if ($("#audit-list")) {
      const audit = Theme.audit(config);
      const passed = audit.filter((a) => a.pass).length;
      $("#audit-summary").textContent =
        `${passed === audit.length ? "✓" : "!"} ${passed}/${audit.length} kontrast kontrolü geçti`;
      $("#audit-summary").style.color =
        passed === audit.length ? "var(--mh-success)" : "var(--mh-danger)";
      const row = (a) =>
        `<li><span>${escape(a.label)}</span><b>${a.ratio.toFixed(2)}:1 ${a.pass ? "✓" : "!"}</b></li>`;
      $("#audit-list").innerHTML = audit.slice(0, 6).map(row).join("");
      $("#audit-more").innerHTML = audit.slice(6).map(row).join("");
    }
    if ($("#token-grid")) {
      $("#token-grid").innerHTML = [
        ["bg", "Zemin"],
        ["surface", "Yüzey"],
        ["text", "Ana metin"],
        ["accent", "Vurgu"],
        ["accent-soft", "Yumuşak vurgu"],
        ["link", "Bağlantı"],
      ]
        .map(
          ([key, label]) =>
            `<button class="token-chip" data-token="--mh-${key}" aria-label="${label} CSS tokenını kopyala"><span class="token-color" style="background:var(--mh-${key})"></span><strong>${label}</strong><code>${escape(tokens[`--mh-${key}`])}</code></button>`,
        )
        .join("");
    }
    if ($("#export-code")) $("#export-code").textContent = Theme.toJSON(config);
  }
  function cleanMounts() {
    widgetInstances.forEach((x) => x.destroy());
    widgetInstances = [];
    dataGridInstance?.destroy();
    tableInstance?.destroy();
    chartInstance?.destroy();
    agentInstance?.destroy();
    tableInstance = chartInstance = agentInstance = undefined;
  }
  function renderRoute(focus = false) {
    if ($("#agent-editor")) agentDraft = $("#agent-editor").value;
    cleanMounts();
    const incoming = location.hash.slice(1);
    route = names[incoming] ? incoming : "palette";
    $("#breadcrumb").textContent = names[route];
    $$("[data-route]").forEach((el) =>
      el.dataset.route === route
        ? el.setAttribute("aria-current", "page")
        : el.removeAttribute("aria-current"),
    );
    $("#main").innerHTML = {
      palette: palettePage,
      customize: customizePage,
      components: componentsPage,
      agents: agentsPage,
      start: startPage,
    }[route]();
    if (route === "components") mountComponent();
    if (route === "agents") renderAgent(false);
    syncTheme();
    if (focus) {
      $("#main").focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    document.title = `${names[route]} — Muhit UI`;
  }
  function mountComponent() {
    widgetInstances.forEach((x) => x.destroy());
    widgetInstances = [];
    dataGridInstance?.destroy();
    tableInstance?.destroy();
    chartInstance?.destroy();
    tableInstance = chartInstance = undefined;
    $$("[data-component-tab]").forEach((el) =>
      el.setAttribute("aria-pressed", el.dataset.componentTab === componentTab),
    );
    const root = $("#component-display");
    root.innerHTML = (
      {
        cards: cardsDemo,
        pages: pagesDemo,
        forms: formDemo,
        feedback: feedbackDemo,
      }[componentTab] || (() => '<div id="mounted-component"></div>')
    )();
    if (widgetGroups[componentTab]) {
      root.innerHTML =
        '<div class="widget-showcase"></div><p class="mh-widget-status" id="widget-event" role="status">Bir bileşenle etkileşime geç; olay çıktısı burada görünür.</p>';
      widgetGroups[componentTab].forEach((kind) => {
        const box = document.createElement("article");
        box.className = "mh-panel widget-example";
        const host = document.createElement("div");
        box.append(host);
        const code = document.createElement("details");
        code.className = "mh-code";
        const summary = document.createElement("summary");
        summary.textContent = kind + " · JSON sözleşmesi";
        const pre = document.createElement("pre");
        pre.textContent = JSON.stringify(widgetExamples[kind], null, 2);
        code.append(summary, pre);
        box.append(code);
        $(".widget-showcase", root).append(box);
        widgetInstances.push(
          MuhitWidgets.mount(host, widgetExamples[kind], {
            onAction: (event) => {
              $("#widget-event").textContent = JSON.stringify(event);
            },
          }),
        );
      });
    }
    if (componentTab === "table")
      tableInstance = MuhitTable.mount($("#mounted-component"), {
        title: "Ortak çalışmalar",
        description:
          "Filtrele, sırala, seç ve dışa aktar. Bu tablo gösterim verileriyle çalışır.",
        showGuidance: true,
      });
    if (componentTab === "table") {
      const host = document.createElement("div");
      host.style.marginTop = "24px";
      document.querySelector("#component-display").append(host);
      dataGridInstance = MuhitDataGrid.mount(host, {
        title: "Genel veri tablosu · Örnek envanter",
        description:
          "Özel sütunlar, sayı ve tarih türleri; yerel örnek veriler.",
        columns: [
          { key: "name", label: "Kaynak" },
          { key: "count", label: "Adet", type: "number" },
          { key: "date", label: "Tarih", type: "date" },
        ],
        rows: [
          {
            id: "r1",
            name: "Araştırma notları",
            count: 12,
            date: "2026-10-17",
          },
          { id: "r2", name: "Görüşme kayıtları", count: 8, date: "2026-10-16" },
          { id: "r3", name: "Karar belgeleri", count: null, date: null },
        ],
      });
    }
    if (componentTab === "charts")
      chartInstance = MuhitCharts.mount($("#mounted-component"), {
        showGuidance: true,
      });
  }
  function renderAgent(announce = true) {
    const resultEl = $("#agent-result");
    try {
      agentDraft = $("#agent-editor").value;
      if (agentDraft.length > 500000)
        throw new Error("Tanım 500 KB sınırını aşıyor.");
      const spec = JSON.parse(agentDraft);
      const result = MuhitAgent.validate(spec);
      if (!result.valid) {
        resultEl.dataset.valid = "false";
        resultEl.textContent = result.errors
          .map((e) => `${e.path}: ${e.message}`)
          .join("\n");
        return false;
      }
      validatedAgentDraft = agentDraft;
      const onAction = (event) => {
        $("#agent-event").textContent = `onAction → ${JSON.stringify(event)}`;
        UI.toast(`Eylem alındı: ${event.id}`);
      };
      if (agentInstance) agentInstance.update(spec);
      else
        agentInstance = MuhitAgent.render($("#agent-output"), spec, {
          onAction,
        });
      resultEl.dataset.valid = "true";
      resultEl.textContent = `✓ Tanım geçerli. ${spec.components.length} bileşen oluşturuldu. ${spec.theme ? "Tanımın kendi teması kullanılıyor." : "Stüdyo teması devralınıyor."}`;
      if (announce) UI.toast("Tanım doğrulandı ve oluşturuldu.");
      return true;
    } catch (error) {
      resultEl.dataset.valid = "false";
      resultEl.textContent = `Oluşturulamadı: ${error.message}`;
      return false;
    }
  }
  function download(name, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      UI.toast("CSS tokenı kopyalandı.");
    } catch {
      $("#export-code").textContent = text;
      UI.openDialog($("#export-dialog"));
      UI.toast(
        "Otomatik kopyalama kullanılamıyor. Metni açılan pencereden kopyalayabilirsiniz.",
      );
    }
  }
  document.addEventListener("click", (event) => {
    const navigation = event.target.closest("a[data-route]");
    const editor = document.querySelector("#agent-editor");
    if (
      navigation &&
      editor &&
      editor.value !== validatedAgentDraft &&
      !confirm(
        "Doğrulanmamış JSON değişiklikleri var. Sayfadan ayrılmak istiyor musun?",
      )
    ) {
      event.preventDefault();
      return;
    }
    if (event.target.closest(".skip-link")) {
      event.preventDefault();
      $("#main").focus();
      return;
    }
    const button = event.target.closest("button,a[data-route]");
    if (!button) return;
    if (button.dataset.preset) {
      setConfig({ preset: button.dataset.preset, accent: null });
      $("#accent-error").textContent = "";
      $("#accent-hex").removeAttribute("aria-invalid");
    }
    if (button.dataset.mode) setConfig({ mode: button.dataset.mode });
    if (button.id === "reset-accent") {
      setConfig({ accent: null });
      $("#accent-error").textContent = "";
      $("#accent-hex").removeAttribute("aria-invalid");
    }
    if (button.id === "reset-theme") {
      setConfig(Theme.defaults);
      Theme.apply(config);
      save();
      syncTheme();
      UI.toast("Tema başlangıç ayarlarına döndü.");
    }
    if (button.id === "open-export") {
      syncTheme();
      $("#import-result").textContent = "";
      UI.openDialog($("#export-dialog"));
    }
    if (button.hasAttribute("data-close"))
      UI.closeDialog(button.closest("dialog"));
    if (button.dataset.download === "json")
      download("muhit-theme.json", Theme.toJSON(config), "application/json");
    if (button.dataset.download === "css")
      download("muhit-theme.css", Theme.toCSS(config), "text/css");
    if (button.dataset.token) copy(`var(${button.dataset.token})`);
    if (button.hasAttribute("data-sample-new")) {
      $("#sample-form").reset();
      $("#space-error").textContent = "";
      UI.openDialog($("#sample-dialog"));
    }
    if (button.hasAttribute("data-bookmark")) {
      bookmarked = !bookmarked;
      $$("[data-bookmark]").forEach((el) => {
        el.innerHTML = icon(bookmarked ? "bookmarkFilled" : "bookmark");
        el.setAttribute("aria-pressed", bookmarked);
        el.setAttribute(
          "aria-label",
          bookmarked ? "Kaydı kaldır" : "Çalışmayı kaydet",
        );
      });
      UI.toast(
        bookmarked ? "Çalışma bu oturum için kaydedildi." : "Kayıt kaldırıldı.",
      );
    }
    if (button.id === "theme-undo" || button.id === "theme-redo") {
      const undo = button.id === "theme-undo";
      const from = undo ? themeHistory : themeFuture,
        to = undo ? themeFuture : themeHistory;
      if (from.length) {
        to.push(config);
        config = from.pop();
        Theme.apply(config);
        save();
        syncTheme();
      }
    }
    if (button.dataset.componentTab) {
      componentTab = button.dataset.componentTab;
      const url = new URL(location.href);
      url.searchParams.set("component", componentTab);
      history.pushState({}, "", url);
      mountComponent();
    }
    if (button.id === "show-toast")
      UI.toast("Geri bildirim anlaşılır, kısa ve zamanında.");
    if (button.id === "render-agent") renderAgent();
    if (button.id === "add-agent-theme") {
      try {
        const spec = JSON.parse($("#agent-editor").value);
        spec.theme = { ...config };
        $("#agent-editor").value = JSON.stringify(spec, null, 2);
        renderAgent();
      } catch (error) {
        $("#agent-result").textContent = `JSON okunamadı: ${error.message}`;
        $("#agent-result").dataset.valid = "false";
      }
    }
    if (button.id === "agent-extended-example") {
      $("#agent-editor").value = JSON.stringify({"schemaVersion": "1.1.0", "page": {"title": "Ortak çalışma", "description": "Kurgu kayıtlarla agent arayüzü", "layout": "stack"}, "components": [{"type": "form", "id": "profile", "title": "Çalışma adı", "fields": [{"name": "name", "label": "Başlık", "required": true}], "submitLabel": "Örnek eylemi gönder"}, {"type": "datagrid", "id": "sources", "title": "Kaynaklar", "selectable": true, "columns": [{"key": "name", "label": "Ad"}, {"key": "count", "label": "Sayı", "type": "number"}], "rows": [{"id": "one", "name": "Araştırma", "count": 12}]}, {"type": "plot", "id": "usage", "title": "Kaynaklar", "data": {"title": "Kaynak değişimi", "unit": "adet", "labels": ["Ocak", "Şubat", "Mart"], "series": [{"id": "sources", "label": "Kaynak", "values": [12, null, 18]}]}}]}, null, 2); renderAgent();
    }
    if (button.id === "agent-workflow-example") {
      $("#agent-editor").value = JSON.stringify(
        {
          schemaVersion: "1.0.0",
          components: [
            widgetExamples.kanban,
            widgetExamples.stepper,
            widgetExamples.choices,
            widgetExamples.command,
          ],
        },
        null,
        2,
      );
      renderAgent();
    }
    if (button.id === "agent-rich-example") {
      const spec = {
        schemaVersion: "1.0.0",
        page: { title: "Ortak çalışma alanı", layout: "grid" },
        components: ["default", "selected", "disabled", "loading", "error"].map(
          (state, i) => ({
            type: "card",
            id: "state" + i,
            title: [
              "Kaynak rehberi",
              "Seçili çalışma",
              "Erişim bekleniyor",
              "Kaynaklar hazırlanıyor",
              "Belge yüklenemedi",
            ][i],
            state,
            meta: "Örnek kart durumu",
            action: {
              id: "action" + i,
              label: state === "error" ? "Yeniden dene" : "İncele",
            },
          }),
        ),
      };
      $("#agent-editor").value = JSON.stringify(spec, null, 2);
      renderAgent();
    }
    if (button.id === "agent-full-example") {
      $("#agent-editor").value = JSON.stringify(exampleSpec(), null, 2);
      renderAgent();
    }
    if (button.id === "download-spec" && renderAgent(false))
      download("muhit-view.json", agentDraft, "application/json");
  });
  document.addEventListener("change", (event) => {
    const el = event.target;
    if (el.dataset.config)
      setConfig({
        [el.dataset.config]: [
          "scale",
          "headingScale",
          "lineHeight",
          "borderWidth",
          "iconWeight",
        ].includes(el.dataset.config)
          ? Number(el.value)
          : el.value,
      });
    if (el.id === "accent-picker") {
      setConfig({ accent: el.value });
      $("#accent-hex").value = el.value.toUpperCase();
      $("#accent-error").textContent = "";
      $("#accent-hex").removeAttribute("aria-invalid");
    }
    if (el.id === "accent-hex") {
      const value = el.value.trim();
      if (/^#[0-9a-f]{6}$/i.test(value)) {
        setConfig({ accent: value });
        el.value = value.toUpperCase();
        el.removeAttribute("aria-invalid");
        $("#accent-error").textContent = "";
      } else {
        el.setAttribute("aria-invalid", "true");
        $("#accent-error").textContent =
          "6 haneli HEX renk girin. Örn. #2E5948";
      }
    }
    if (el.id === "preview-check") {
      sampleDone = el.checked;
      UI.toast(
        sampleDone ? "Örnek adım tamamlandı." : "Örnek adım yeniden açıldı.",
      );
    }
  });
  document.addEventListener("submit", (event) => {
    if (event.target.id === "sample-form") {
      event.preventDefault();
      const name = $("#space-name").value.trim();
      if (!name) {
        $("#space-error").textContent = "Bir çalışma adı girin.";
        $("#space-name").focus();
        return;
      }
      lastCreated = name;
      sampleDone = false;
      UI.closeDialog($("#sample-dialog"));
      const box = $("#preview-check");
      if (box) {
        box.checked = false;
        box.nextSibling.textContent = lastCreated;
      }
      UI.toast(`“${name}” örnek alana eklendi.`);
    }
    if (event.target.id === "demo-form") {
      event.preventDefault();
      const value = $("#demo-title").value.trim();
      if (!value) {
        $("#demo-result").textContent = "Boşluk yerine bir çalışma adı girin.";
        $("#demo-title").focus();
        return;
      }
      $("#demo-result").textContent =
        `“${value}” için örnek önizleme hazır. Bir sunucuya veri gönderilmedi.`;
    }
  });
  document.addEventListener("reset", (event) => {
    if (event.target.id === "demo-form") $("#demo-result").textContent = "";
  });
  $("#theme-import").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      if (file.size > 50000) throw new Error("Dosya en fazla 50 KB olabilir.");
      const next = Theme.fromJSON(await file.text());
      setConfig(next);
      Theme.apply(config);
      save();
      syncTheme();
      $("#import-result").textContent = "Tema doğrulandı ve uygulandı.";
    } catch (error) {
      $("#import-result").textContent = `İçe aktarılamadı: ${error.message}`;
    }
    event.target.value = "";
  });
  $$("[data-icon]").forEach((el) => (el.innerHTML = icon(el.dataset.icon)));
  addEventListener("popstate", () => {
    const params = new URLSearchParams(location.search);
    componentTab = params.get("component") || "cards";
    pageRecipe = params.get("page") || "workspace";
    renderRoute(true);
  });
  addEventListener("beforeunload", (event) => {
    const editor = document.querySelector("#agent-editor");
    if (editor && editor.value !== validatedAgentDraft) {
      event.preventDefault();
      event.returnValue = "";
    }
  });
  addEventListener("hashchange", () => renderRoute(true));
  renderRoute();
})();
