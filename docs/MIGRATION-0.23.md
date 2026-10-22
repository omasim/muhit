# 0.22 → 0.23

Public API ve snapshot sürümü değişmedi. Takvim düzenleme artık description alanını korur; kaynak alanını boşaltma davranışı açıkça kaldırma olarak devam eder. Sunucu onayı sırasında yeni değişiklik varsa düzenleme tabanı ilerler; gerçek dış güncelleme/kaldırma yine çakışmadır.

React/Vue örneklerinin PlanningAdapter.ts dosyası takvim kayıtlarını ve taslağı birlikte saklar. Üretimde aynı sınırı ürün deposuna bağlayın; örnek bellek saklaması kalıcı sunucu değildir. Uzak arama için GET /api/resources query/page/pageSize sözleşmesi gerekir; geliştirme örneği examples/integration altında.

İç calendar-state yardımcılarını doğrudan uygulama API'si olarak kullanmayın. Public giriş muhit-ui/planning olarak kalır. Gerçek veri ve manuel erişilebilirlik kabulü ayrı kapılardır.
