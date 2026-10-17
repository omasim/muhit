/* Shared locale context. Application text is never translated implicitly. */
(function (global) {
  "use strict";
  const english = {
    Taşı: "Move",
    "{title} kartını taşı": "Move {title} card",
    "Taşıma iptal edildi.": "Move cancelled.",
    "Bir sütuna sürükleyin. Escape ile iptal edin.":
      "Drag to a column. Press Escape to cancel.",
    "Oklarla sütun seçin, Enter ile taşıyın, Escape ile iptal edin.":
      "Choose a column with arrow keys, Enter to move, Escape to cancel.",
    "Doğrulama tamamlanamadı. Kaydederken yeniden denenecek.":
      "Validation could not finish. It will retry on submit.",
    "Komut ara ⌕": "Search commands ⌕",
    Bilgiler: "Information",
    Kaydet: "Save",
    Sıfırla: "Reset",
    Seçin: "Select",
    "Geçerli bir e-posta adresi yazın.": "Enter a valid email address.",
    "Değer izin verilen aralıkta olmalı.":
      "Value must be within the allowed range.",
    "Geçerli bir tarih seçin.": "Select a valid date.",
    "Listeden bir seçim yapın.": "Choose an option from the list.",
    "Geçerli bir değer yazın.": "Enter a valid value.",
    "Lütfen aşağıdaki alanları kontrol edin.":
      "Please check the following fields.",
    "Bilgiler geçerli. Kayıt için uygulamanın onSubmit bağlantısı gerekli.":
      "Values are valid. Connect the application submit handler to save.",
    "Kaydediliyor…": "Saving…",
    "Kayıt tamamlanamadı.": "Save was not completed.",
    "Kaydedildi.": "Saved.",
    "Kaydedilemedi. Bağlantınızı kontrol edip yeniden deneyin.":
      "Unable to save. Check your connection and try again.",
    "Kaydedilmemiş değişiklikler var.": "There are unsaved changes.",
    "Değişiklikler sıfırlandı.": "Changes reset.",
    "{label} alanını doldurun.": "Complete {label}.",
    "En fazla {count} karakter yazın.": "Enter up to {count} characters.",
    "Kapat ×": "Close ×",
    Tamamlandı: "Complete",
    Sürüyor: "Active",
    Planlandı: "Planned",
    "Bu alanda henüz çalışma yok.": "No work in this area yet.",
    " durumunu değiştir": " change status",
    "Bir komut ara…": "Search commands…",
    "Komut ara": "Search commands",
    " komut": " commands",
    "Eşleşen komut bulunamadı.": "No matching commands.",
    "Ayrıntıları aç ↗": "Open details ↗",
    "← Önceki": "Previous",
    "Sonraki →": "Next",
    "Adım ": "Step ",
    "Dosyaları seç veya buraya bırak": "Choose files or drop them here",
    "Dosyalar bu bileşende yerel kalır. Sunucuya aktarılmaz.":
      "Files stay local. They are not uploaded.",
    Kaldır: "Remove",
    " dosyasını kaldır": " remove file",
    "Dosya sınırına ulaşıldı.": "File limit reached.",
    ": dosya çok büyük.": ": file is too large.",
    ": dosya türü kabul edilmedi.": ": file type is not accepted.",
    " dosya seçildi.": " files selected.",
    "Henüz kayıt yok.": "No records yet.",
    "{count} dosyaya kadar · dosya başına {size} MB":
      "Up to {count} files · {size} MB per file",
    "{from}–{to} / {total} kayıt": "{from}–{to} / {total} records",
    "Görünür veri yok.": "No visible data.",
    " · Değerler aşağıdaki tabloda.": " · Values in the table below.",
  };
  const catalogs = new Map([
    ["en", english],
    ["tr", {}],
  ]);
  let defaultLocale = "tr-TR";
  function localeOf(locale) {
    if (typeof locale !== "string")
      throw new TypeError("Locale must be a string");
    return Intl.getCanonicalLocales(locale)[0] || "tr-TR";
  }
  function create(options = {}) {
    const locale = localeOf(options.locale || defaultLocale),
      lang = locale.split("-")[0];
    if (options.dir !== undefined && !["ltr", "rtl"].includes(options.dir))
      throw new TypeError("Invalid direction");
    const messages = options.messages === undefined ? {} : options.messages;
    if (
      !messages ||
      typeof messages !== "object" ||
      Array.isArray(messages) ||
      Object.values(messages).some((v) => typeof v !== "string")
    )
      throw new TypeError("Messages must contain strings");
    const dictionary = {
      ...(catalogs.get(lang) || {}),
      ...(catalogs.get(locale) || {}),
      ...messages,
    };
    const dir = options.dir || (/^(ar|fa|he|ur)$/.test(lang) ? "rtl" : "ltr");
    const text = (source, fallback, params = {}) => {
      const value = Object.hasOwn(dictionary, source)
        ? dictionary[source]
        : lang === "tr"
          ? source
          : (fallback ?? english[source] ?? source);
      return value.replace(/\{(\w+)\}/g, (_, key) =>
        String(params[key] ?? "{" + key + "}"),
      );
    };
    return Object.freeze({
      locale,
      dir,
      text,
      number: (v, opts) => new Intl.NumberFormat(locale, opts).format(v),
      date: (v, opts) => new Intl.DateTimeFormat(locale, opts).format(v),
    });
  }
  function register(locale, messages) {
    const key = localeOf(locale);
    create({ locale: key, messages });
    catalogs.set(key, { ...messages });
  }
  global.MuhitI18n = Object.freeze({
    create,
    register,
    getLocale: () => defaultLocale,
    setLocale(locale) {
      defaultLocale = localeOf(locale);
      return defaultLocale;
    },
  });
})(globalThis);
