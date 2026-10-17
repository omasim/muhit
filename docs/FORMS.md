# Form ve tercih sistemi · 0.6.0

## Form sözleşmesi

`MuhitForm` metin, e-posta, uzun metin, sayı, tarih, seçim ve checkbox alanlarını tek yaşam döngüsüyle kurar. Gereklilik, metin uzunluğu, sayı sınırları, gerçek takvim tarihi ve seçenek üyeliği doğrulanır. Form tanımı [JSON şeması](../schemas/form.schema.json) ile makine tarafından okunabilir. API bağımsız host üzerinde veya MuhitAgent 1.1 form türü olarak kullanılabilir.

```js
import { MuhitForm } from 'muhit-ui';
import 'muhit-ui/styles';
const form = MuhitForm.mount('#profile', {
  title: 'Profil',
  fields: [
    { name: 'name', label: 'Ad', required: true, maxLength: 80 },
    { name: 'email', label: 'E-posta', type: 'email', required: true },
  ],
  values: { name: 'Ada', email: '' },
  async onSubmit(values, signal) {
    // API adresi, kimlik doğrulama ve sunucu doğrulaması uygulamanıza aittir.
    const response = await fetch('/api/profile', {
      method: 'POST', signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (response.status === 422) return { errors: { email: 'Bu adres kullanılıyor.' } };
    if (!response.ok) throw new Error('Kayıt başarısız');
  },
});
form.getValues(); // Bağımsız değer kopyası
form.isDirty(); // Son başarılı kayıt / başlangıç ile fark
form.setValues({ name: 'Deniz', email: 'deniz@example.com' });
form.validate(); // {valid, values, errors}; görünümü de günceller
form.reset(); // Son başarılı değerleri geri getirir
form.destroy(); // Bekleyen yanıtı etkisizleştirir, isteği iptal eder, DOM'u kaldırır
```

`onSubmit` verilmezse form yalnız doğrulandığını söyler; kaydedilmiş gibi davranmaz. `undefined` veya boş hata nesnesi başarılı uygulama yanıtıdır; sunucu hataları `{errors: {alanAdi: mesaj}}` şeklinde döner. Fırlatılan hata tekrar denemeyi destekleyen genel bir mesaj gösterir; sunucunun iç hata ayrıntısı kullanıcıya sızdırılmaz. Uygulama callback'i başarısız HTTP durumlarını açıkça ele almalıdır.

Beklerken alanlar ve kaydet düğmesi kapalıdır. Sıfırla etkin kalır ve AbortSignal'i iptal eder. Geç kalan yanıtlar ekrana yazılmaz. İptal, sunucuda tamamlanmış bir işlemi geri almaz; callback idempotency ve sunucu tutarlılığını uygulama sağlamalıdır. Aynı host'a tekrar mount eski formu temizler. Başarısız yapı/tür güncellemesi önceki değerleri korur.

Boş sayı `null`, checkbox boolean, diğer alanlar string döndürür. `setValues` tam değer kümesidir; eksik alanlar boş/default olur ve kaydedilmiş kabul edilmez. Başlangıç veya setValues içeriği geçerli alan türünde olmalı; değer kısıtları validate/submit sırasında değerlendirilir. Formda URL, HTML, şifre veya dosya işleme yoktur. Dosya seçimi için mevcut `filepicker` widget'ını kullanın.

## Erişilebilirlik ve tema

Her alanın label, yardım ve hata bağlantısı otomatik kurulur. Gönderim hatası özeti odak alır; özet düğmeleri ilgili alana taşır. Başarı/yüklenme durumu canlı bölgede duyurulur; `aria-busy` kayıt sürecini gösterir. Zorunluluk native required ile de taşınır. Native form kontrolleri ve tema tokenları kullanılır. İki sütun için form köküne `.mh-form--columns` eklenebilir; dar ekranda tek sütuna döner.

## Tercih saklama

```js
import { MuhitPreferences, MuhitTheme } from 'muhit-ui';
const preferences = MuhitPreferences.create({
  key: 'my-app-theme', fallback: { preset: 'grove', mode: 'light' },
});
const loaded = preferences.load();
MuhitTheme.apply(loaded.config);
const result = preferences.save({ preset: 'atelier', mode: 'dark' });
if (!result.saved) { /* Görünümü uygulayabilirsiniz; saklanmadığını açıklayın. */ }
const unsubscribe = preferences.subscribe(result => MuhitTheme.apply(result.config));
// Sayfa/host kaldırıldığında unsubscribe();
// preferences.clear(); yalnız seçilen anahtarı siler.
```

Otomatik saklama yoktur; yalnız açık `save` çağrısı yazar. Bozuk JSON, eski sürüm, kota veya engellenen depolama varsayılan görünümü korur ve açıklanabilir sonuç döndürür. Geçersiz tema konfigürasyonu yazılmadan hata fırlatır. Sekmeler arası storage olayı dinlenebilir; aynı sekmedeki save sonrası görünümü çağıran kod uygular. `storage` seçeneğiyle Storage uyumlu bir adaptör verilebilir. Yalnız tema konfigürasyonu saklanır; form verileri, kimlik bilgileri ve hesap senkronizasyonu bu API kapsamında değildir.

## Çalışan örnek

[Çalışma alanı ayarları](../examples/settings.html) palet, açık/koyu görünüm ve metin ölçeği ile formu birleştirir. Başarı, alan hatası ve bağlantı hatası senaryoları seçilebilir. Kayıt simülasyonu açıkça etiketlidir; gerçek ağ isteği yapmaz.
