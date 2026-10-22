# Muhit 0.23 · P1/P2 kabul kaydı

## P1 düzeltmeleri

Takvim başlık/zaman/kaynak düzenlemesi `description` alanını korur. Kaynak alanını boşaltmak açıkça kaynak bağını kaldırır. Gönderilen kayıt onaylanırken kullanıcı yeni değişiklik yaptıysa, düzenleme tabanı onaylanan kayıtla güncellenir; sonraki kayıt yanlış dış değişiklik hatasına düşmez. Gerçek dış güncelleme/kaldırma koruması devam eder. Nesne anahtar sırası sahte çakışma üretmez.

Saf aday üretimi ve çakışma kontrolü `src/calendar-state.mjs` içine ayrıldı; submit işleyicisi adlandırıldı ve planlama kaynakları okunabilir biçimde düzenlendi. İç yardımcılar kararlı public API taahhüdü değildir.

## P2 kapsamı

- React ve Vue örneklerinde tekrar/istisna/kapasite, biçimlendirme, HTTPS medya, JSON aktarımı ve uzak arama eylemleri var. Örnek adaptör dosyaları aynı kaynaktan üretilmiş eş kopyalardır; framework yaşam döngüsü cleanup çağırır. Sunucu örneği `/api/resources` sözleşmesini sağlar; framework testlerinde hata ve gecikme kontrollü HTTP yanıtlarıyla sınanır.
- Paketlenmiş TGZ ile React/Vue development, production ve SSR hydration akışları test edilir. Mevcut taslak remount testi korunur.
- Node runtime birim/import matrisi 18/20/22/24/26; tarayıcı ve araç CI Node 22. Bu matris bütün framework sürümlerine destek anlamına gelmez.
- Uzun metin ve kısıtlı CPU/ağ ölçümü `npm run test:performance-profile`. Gerçek kayıt dosyası için `MUHIT_SEARCH_DATA=/absolute/anonymized.json`.
- Figma ekleri: DESIGN-CODE-0.23.md. Eski aileler korunur; yeni kontroller 360/800 px ve altı durumla temsil edilir.
- Güncel sürüm ve destek belgeleri paket/manifest ile uyumlu hale getirildi.

## Açık kalan kabul

Gerçek anonimleştirilmiş proje verisi ve hedef fiziksel cihaz henüz sağlanmadı. Sentetik ölçüm bu kabulün yerine geçmez. Manuel erişilebilirlik sonuçları bekliyor; adımlar MANUAL-ACCEPTANCE-0.23.md içinde. Beta etiketi korunur. Ödeme/ortak düzenleme ve üretim sunucu yetkilendirmesi ürün sorumluluğudur.
