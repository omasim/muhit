# 0.18 → 0.19 beta geçişi

0.19.0-beta.1 eklemeli bir beta sürümüdür. Logo 3.1 ve Agent UI 1.1.0/18 tür korunur. Yeni paket girişleri content, inbox, activity, resources, shell, product'tır.

Atölye 03'ün eski 0.18.0 çalışma TGZ'sinde yeni JS/CSS dosyaları eksikti. Bu dosyayı tüketim için kullanmayın. Yeni sürümün paket dosya listesi kaynakları içerir; tüketici testi declaration yanında gerçek runtime import yapar. Eski arşivler tarihsel kanıt olarak korunur.

- Yeni modüllerin CSS girişlerini PRODUCT-SYSTEM-0.19 rehberindeki gibi açıkça ekleyin.
- Inbox/activity/resources artık BCP47 locale, messages ve timeZone kabul eder. Varsayılan saat dilimi UTC'dir.
- getView/restoreView ile gezinme veya remount öncesi bağlamı taşıyın.
- load için array yerine `{outcome,items}` döndürün. persisted bilgisini yalnız gerçek sunucu sonucundan üretin.
- Yeni imperative modüller Agent JSON türü değildir; eski adapter'a bu isimleri göndermeyin.
- Yerel önizleme, indirilebilir TGZ ve registry yayını farklıdır. Bu çalışmada registry yayını yapılmaz.
