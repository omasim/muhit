# Taslak, bağlam ve sonuç sözleşmesi · 0.17

Muhit, kullanıcı emeğini korumayı görsel bir tercihten önce davranış kuralı olarak uygular.

## İptal ve sıfırlama

Form ve Repeater `cancelSubmit()` bekleyen doğrulama/gönderimi iptal eder. Görünür “İşlemi iptal et” düğmesi yalnız işlem sürerken sunulur. Değerler korunur; geç dönen yanıt ekrana başarı yazamaz. Form `reset()` ise değerleri son kabul edilmiş başlangıca döndürür. İptal sıfırlama değildir.

Form callback'ine verilen AbortSignal veri katmanına iletilmelidir. İptal, sunucuda tamamlanmış bir yazmayı geri alamaz; sunucu işlemleri için idempotency ve sonuç sorgulama uygulama sorumluluğudur. Repeater geç yanıtı geçersiz kılar; mevcut callback sözleşmesi AbortSignal iletmez.

## Doğru sonuç bildirimi

`onSubmit` / Agent submit `onAction` callback'i `{persisted:false}` döndürürse “İşlem tamamlandı. Veri kaydedilmedi; taslak korunuyor.” gösterilir. Form baseline değişmez. Stüdyo ve yalnız olay gösteren örnekler bu sonucu kullanır.

Geriye uyumluluk nedeniyle `undefined` veya `{persisted:true}` ile çözülen callback başarılı kayıt sözleşmesidir; uygulama bu sonucu ancak kendi veri katmanı doğruladıktan sonra döndürmelidir. Yerel bellek örnekleri başarı mesajında yalnız sayfa belleğini güncellediğini açıklar. Muhit kendiliğinden bir backend veya kalıcı depolama sağlamaz.

Form hatalarında `code:'network'` bağlantı mesajına, `code:'forbidden'` yetki mesajına dönüşür. Diğer hatalar tarafsız yeniden deneme mesajı kullanır; özel hata metni kullanıcıya sızdırılmaz. Alan hata nesneleri mevcut sözleşmeyle çalışır.

## Agent güncellemesi

`update(spec)` aynı kimlik ve aynı tanıma sahip bileşenin DOM ve instance'ını korur. Tanımı değişen form, alan tanımı aynıysa mevcut değer ve baseline snapshot'ını; DataGrid sütun tanımı aynıysa görünümünü taşır. Mevcut taslak yeni spec başlangıç değerlerinden önce gelir. Değişmiş widget/table/chart tanımlarında genel durum göçü vaat edilmez.

Kirli formu kaldıran veya alan tanımını değiştiren güncelleme atomik olarak reddedilir; eski arayüz korunur. Bilinçli veri atma için `update(spec, {resetState:true})` kullanılır. Bu seçenek uygulama tarafından kullanıcı niyeti doğrulandıktan sonra kullanılmalıdır. `cancelPending()` bağlı formları/grupları taslağı bozmadan iptal eder. `destroy()` yaşam döngüsünü sonlandırır; sonrasında durum koruma vaat edilmez.

## Stüdyo kapsamı

Bölüm, bileşen ve sayfa tarifi geçişlerinde gerçek DOM/instance sekme belleğinde saklanır. Form metni, tablo araması ve diğer mevcut kontrol durumları geri dönünce korunur. Bölüm kaydırma konumu saklanır; yeni bölüm başlığına erişilebilir odak taşınır. Bölümden çıkarken bekleyen Agent form gönderimi iptal edilir, açık native dialog kapatılır.

Taslaklar localStorage'a yazılmaz. Yenileme, sekmeyi kapatma veya uygulama oturumunu bitirme taslakları siler; stüdyo bunu görünür biçimde bildirir. Tema tercihleri ayrı mevcut saklama sözleşmesini kullanır. Bu davranış tüketici router'larına otomatik eklenmez; tüketici uygulaması snapshot/instance yaşam döngüsünü yönetmelidir.

## Doğrulama ve sınırlar

`npm run test:principles` gerçek tarayıcıda iptal, geç sonuç, kaydedilmemiş sonuç, hata sınıflaması, Agent atomik güncelleme, stüdyo geçişleri ve klavyeyle hata kurtarma akışını sınar. CI Chromium, Firefox ve WebKit kullanır. Birim, tip, framework, erişilebilirlik ve dağıtım regresyonları ayrıca çalışır. Manuel ekran okuyucu ve gerçek mobil cihaz kabulü bu otomasyonun yerine geçmez.
