# Muhit 0.25 · Doğrulama

Yeni testler: tests/readiness25.test.mjs; tests/browser/readiness25-flows.mjs. Callback throw/reject tanılaması, doğrulanmış kayıt/silme mesajı, editör baseline, indeks eşliği/yield/iptal, Almanca/Arapça bildirim başarı-hata/RTL.

Performans testi kurulum süresi ve timer boşluğu kapılarını da uygular. Son kaynak ve CI kanıtları aşağıdadır. Önceki kaynak özetli raporlar bu sürümün kabul kanıtı değildir.

## Son kaynak ve yerel testler

- Runtime commit: a88b3aca1f258cc4297cd83f576ec43daabc1876.
- Kaynak SHA-256: 3bef1a999b9cb04494c75a3fbdede1e10ea4a3aea8d34e1074d7d4b03b7657f3.
- 120/120 birim testi; 88 paketlenmiş NodeNext/Bundler tipli giriş geçti.
- Chromium/WebKit: sekiz callback senaryosu; Almanca/Arapça bildirim başarı-hata akışları; 12 responsive açık/koyu axe taraması geçti.
- Yeni asenkron arama örneği iki motorda 390 px genişlikte 111 eşleşmeden ilk 25 sonucu gösterdi, sayfa taşması yok. Kontrol hedefleri en az 44 px; yeni örneğin Chromium/WebKit axe taramasında ihlal yok.
- Yerel 4x CPU profili: toplam kurulum 165 ms; en büyük timer boşluğu 10,4 ms; yerel sorgu p95 12,4 ms; uzak p95 413,6 ms. Sentetik koşullar fiziksel cihaz kabulü değildir.
- Kaynakla eşleşen kanıtlar tests/evidence/release25/local altında.

CI: https://github.com/omasim/muhit/actions/runs/39762884000. Sonuç: başarılı.

## Yerel ortam sınırı

macOS Firefox ek denemesi testlere ulaşmadan başlatma zaman aşımı verdi: sandbox extension / SWGL framebuffer hatası. Bu deneme başarı sayılmaz; hata kanıtı release25/local altında korunur. Linux Firefox CI sonucu ayrı değerlendirilir. Chromium/WebKit yerel sonuçları bu başlatma hatasından etkilenmez.

## Son CI kabulü: 8/8 başarılı

[CI koşusu](https://github.com/omasim/muhit/actions/runs/39762884000): Chromium, Firefox, WebKit ve Node 18/20/22/24/26 başarılı. Chromium tam verify:all, paketlenmiş React/Vue development/production/SSR, tipler, entegrasyon, dağıtım, bundle ve görsel kontroller geçti. Yeni callback/dil/örnek akışları üç motorda geçti; planlama sayfasında toplam 18 responsive/axe taraması başarılı.

Firefox ilk CI ortamında kurulumda takıldı; yalnız bu iş aynı kaynakta yeniden çalıştırıldı ve başarılı oldu (attempt 2). Yedi başarılı iş korundu. Yerel macOS Firefox başlangıç hatası bununla karıştırılmaz. Tam iş kaydı release25/CI-RESULT.json, kaynakla eşleşen test kanıtları release25/ci altında.

CI kısıtlı performans: asenkron indeks kurulumu 643,4 ms; en büyük timer boşluğu 13,3 ms; yerel sorgu p95 16,4 ms; uzak p95 412,3 ms. Bütün ürün ve regresyon kapıları geçti. Timer boşluğu gerçek INP değildir; gerçek veri ve fiziksel cihaz kabulü açıktır.

Son belge/kanıt commit'i runtime kaynak özetini değiştirmez. Dağıtım PROVENANCE.json son belge commit'ini gösterebilir. Registry/Pages yayını yapılmadı. Manuel kabul ve pilot koşulları MANUAL-ACCEPTANCE-0.25.md içinde açık tutulur.
