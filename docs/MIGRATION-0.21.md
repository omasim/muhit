# Muhit 0.20 → 0.21

## Veri yenileme

Inbox/Resources/Activity `load()` artık bekleme sırasında kayıt verisi değişmişse eski yanıtı uygulamaz; false döndürür ve partial durumu açıklar. Programatik geçerli `update()` bekleyen loader'ı geçersiz kılar. Bozuk update mevcut veriyi bozmaz. Uygulama yeni veri ve yerel değişiklikler için açık bir birleştirme politikası seçmelidir; Muhit sessiz last-write-wins uygulamaz.

## Taslak ve kaydedilebilir belge

`validateDocumentDraft` boş başlığı kabul eder; `validateDocument` ve checkpoint boş/whitespace başlığı reddeder. `getSnapshot().draft` görünen alanla aynı kalır. Save sonucu sadece gönderilen sürümü baseline yapar; daha yeni değişiklikler dirty kalır.

`createDocument`: isDirty, markSaved, restoreSnapshot eklendi. Snapshot v1: snapshotVersion, draft, baseline, undoHistory (50), versions (30), counter, canUndo. Geri yükleme atomik doğrulanır; önceki geçersiz snapshot sürümleri sessizce uygulanmaz.

`mountDocumentEditor`: getDraft, restoreDraft, restoreSnapshot, isDirty; options.snapshot, onDirtyChange, onDraftChange. Snapshot eski sürümde yalnız draft/versions/canUndo içeriyordu; uygulamanızdaki katı snapshot tipini güncelleyin. 0.20 snapshot'ını otomatik tam geçmiş gibi yüklemeyin; yalnız draft verisini yeni başlangıç modeline aktarın.

`mountCalendar`: getDraft/restoreDraft/isDirty; options.draft/onDirtyChange/onDraftChange. Ham draft v1 title/start/end/resource girişlerini içerir; son kayıt doğrulaması submit aşamasındadır. getSnapshot artık draft da döndürür.

## Navigasyon ve saklama

Örnek uygulamada sessionStorage saklaması açık checkbox seçimiyle etkinleşir. Seçilmezse kirli taslakla ayrılırken tarayıcı onayı gerekir. Kapalı duruma almak oturumdaki ilgili kopyayı siler; mevcut formu silmez. Kütüphane kendiliğinden kişisel metni diske yazmaz. Uygulama kendi router, yetki ve saklama politikasını bağlar.

## Dil, ekran ve tasarım

Ürün örnekleri TR/EN sözlüğü kullanır; dil alt akış bağlantılarında korunur. 320 px takvim 44 px hedefleri için yalnız gün ızgarasında yerel yatay kaydırma kullanır. Figma Planning21 aileleri 360/800 genişlik ve altı eylem/durum varyantını gösterir; DOM davranışı kod testlerinin sorumluluğudur.
