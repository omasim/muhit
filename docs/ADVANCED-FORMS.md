# Gelişmiş form bağlantıları · 0.9

`MuhitForm.mount` artık `validateAsync(values, signal)` ve `validationDelay` (varsayılan 300 ms) alır. Sonuç alan adı → hata metni nesnesidir. Input değişiminde önceki istek iptal edilir; sağlayıcı iptali dikkate almasa bile eski yanıt uygulanmaz. Reset, setValues ve destroy bekleyen doğrulamayı iptal eder. Kaydetme öncesi uzak doğrulama yeniden yapılır; hatalı değer submit callback'ine gönderilmez. Sunucu hataları ve asenkron doğrulama uygulamanın dilinde sağlanmalıdır.

`MuhitFields.combobox(host,{label,locale,load(query,signal),onChange,delay,value})` en fazla 100 benzersiz `{id,label}` seçeneği gösterir. Varsayılan gecikme 200 ms. Oklar/Home/End gezinir, Enter seçer, Escape kapatır. Serbest metin seçilmiş değer sayılmaz. getValue/setValue/destroy vardır. Uygulama onChange ile seçili kimliği kendi form durumuna bağlar; ağ ve yetkilendirme uygulamanındır.

`MuhitFields.repeater(host,{fields,values,min,max,title,groupLabel,onChange,onSubmit,locale})` düz alan şemasını tekrarlanan kayıt gruplarında kullanır. Varsayılan sınırlar 0–20, azami 50 gruptur. getValues/setValues/validate/submit/destroy vardır. Bozuk güncelleme mevcut değerleri korur. Kayıt tüm gruplar geçerliyse yapılır. Bu bileşen kendi alt formlarını yönetir; başka bir HTML formunun içine yerleştirilmez. Submit sağlayıcısı AbortSignal'i dikkate almalıdır. İç içe sınırsız tekrar, sürüklenerek grup sıralama  bu sürümün sözleşmesinde yoktur.

Yeni alan bağlantıları agent JSON'una işlev eklemez. Agent form-change/edit/column-layout/state/selection olayları ve submit callback'iyle uygulamaya bağlanır. Yalnız onAction'a bağlanmak sunucu yetkisi sağlamaz; eylem işleyicisi izinleri sunucuda doğrular. JSON tür sayısı 18 kalır.

Çalışan örnek: examples/advanced.html. Örnekte sağlayıcılar simülasyondur; gerçek ağ isteği gönderilmez.

## Üretim bağlantıları

Combobox `name`, `required`, `disabled`, `readOnly` alır. Seçili kimlik gizli input üzerinden FormData'ya girer; serbest yazı geçerli seçim değildir. `setDisabled(boolean)` ve `setReadOnly(boolean)` bekleyen aramayı iptal eder. Native formda kullanın; MuhitForm içine DOM ekleyerek şemayı değiştirmeyin. Uygulama onChange ile kimliği kendi durumuna aktarabilir.

Repeater `validateAsync(values,signal)` ile grup sırasına göre hata nesneleri dizisi alır. `onSubmit` `{errors:[{name:"Bu ad kullanılıyor"},{}]}` döndürebilir. Hatalar yalnız ilgili gruba gider; hatalı async doğrulamada kayıt çağrılmaz. Dizi en fazla mevcut grup sayısındadır ve alan adları şemada olmalıdır. setValues/destroy eski yanıtları geçersiz kılar. Kaydetme sırasında gruplar kilitlidir. İç içe repeater desteklenmez: veri uygulamada düzleştirilmeli, üst düzey ayrı kapsayıcılara bağlanmalı; iç içe HTML formu oluşturulmamalı.

Örnek:
```js
MuhitFields.repeater(host, {
  fields: [{name:'email',label:'E-posta',type:'email',required:true}],
  values: [{email:''}],
  validateAsync: async (groups, signal) => {
    const response = await fetch('/api/contacts/validate', {
      method:'POST', signal, headers:{'Content-Type':'application/json'},
      body:JSON.stringify(groups)
    });
    if (!response.ok) throw new Error('Doğrulama başarısız');
    return response.json(); // [{email:'Hata metni'}] veya [{}]
  },
  onSubmit: async (groups,signal) => {
    const response=await fetch('/api/contacts',{method:'POST',signal,
      headers:{'Content-Type':'application/json'},body:JSON.stringify(groups)});
    if (!response.ok) throw new Error('Kayıt başarısız');
    return response.json(); // {errors:[]}
  }
});
```
Endpointler tüketici uygulama tarafından sağlanır; kimlik ve izin kontrolü sunucuda yapılır.
