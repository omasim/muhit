# Gelişmiş form bağlantıları · 0.9

`MuhitForm.mount` artık `validateAsync(values, signal)` ve `validationDelay` (varsayılan 300 ms) alır. Sonuç alan adı → hata metni nesnesidir. Input değişiminde önceki istek iptal edilir; sağlayıcı iptali dikkate almasa bile eski yanıt uygulanmaz. Reset, setValues ve destroy bekleyen doğrulamayı iptal eder. Kaydetme öncesi uzak doğrulama yeniden yapılır; hatalı değer submit callback'ine gönderilmez. Sunucu hataları ve asenkron doğrulama uygulamanın dilinde sağlanmalıdır.

`MuhitFields.combobox(host,{label,locale,load(query,signal),onChange,delay,value})` en fazla 100 benzersiz `{id,label}` seçeneği gösterir. Varsayılan gecikme 200 ms. Oklar/Home/End gezinir, Enter seçer, Escape kapatır. Serbest metin seçilmiş değer sayılmaz. getValue/setValue/destroy vardır. Uygulama onChange ile seçili kimliği kendi form durumuna bağlar; ağ ve yetkilendirme uygulamanındır.

`MuhitFields.repeater(host,{fields,values,min,max,title,groupLabel,onChange,onSubmit,locale})` düz alan şemasını tekrarlanan kayıt gruplarında kullanır. Varsayılan sınırlar 0–20, azami 50 gruptur. getValues/setValues/validate/submit/destroy vardır. Bozuk güncelleme mevcut değerleri korur. Kayıt tüm gruplar geçerliyse yapılır. Bu bileşen kendi alt formlarını yönetir; başka bir HTML formunun içine yerleştirilmez. Submit sağlayıcısı AbortSignal'i dikkate almalıdır. İç içe sınırsız tekrar, sürüklenerek grup sıralama ve grup bazlı sunucu hatası yönlendirme bu sürümün sözleşmesinde yoktur.

Yeni alan bağlantıları agent JSON'una işlev eklemez. Agent form-change/edit/column-layout/state/selection olayları ve submit callback'iyle uygulamaya bağlanır. Yalnız onAction'a bağlanmak sunucu yetkisi sağlamaz; eylem işleyicisi izinleri sunucuda doğrular. JSON tür sayısı 18 kalır.

Çalışan örnek: examples/advanced.html. Örnekte sağlayıcılar simülasyondur; gerçek ağ isteği gönderilmez.
