# İleri sütun işlemleri · 0.8

DataGrid sütun genişliğini, sırasını ve mantıksal başlangıç/son sabitlemesini destekler. Sütunlar menüsünden görünürlük, sırada öne/arkaya taşıma ve sabitleme yönetilir. Başlıktaki **Taşı** düğmesi sürüklenebilir; tıklanınca klavyeyle kullanılabilen sıra seçeneklerine gider. Aynı sabitleme grubu içindeki sıralama korunur; bir sütun başka grubun üzerine bırakılırsa hedef grubuna taşınır.

Genişlik tutamacını fare/dokunmayla sürükleyin veya odaklayıp sol/sağ okları kullanın: 10 px, Shift ile 50 px. Home 120 px, End 800 px yapar. RTL'de yatay tuşların fiziksel yönü terslenir. Ayarlanabilir ayırıcı mevcut genişliği erişilebilir değer olarak bildirir.

```js
const grid = MuhitDataGrid.mount(host, {
  columns, rows,
  columnLayout: [
    {key:'name', width:280, pin:'start'},
    {key:'score', width:160, pin:null},
    {key:'status', width:200, pin:'end'}
  ],
  onColumnLayoutChange(layout) { application.saveLayout(layout); }
});
const snapshot = grid.getColumnLayout();
grid.setColumnLayout(snapshot);
```

Düzen bütün sütun anahtarlarını tam bir kez içermelidir. Genişlik 120–800 arasında tamsayı; pin `null`, `start` veya `end` olabilir. Geçersiz düzen mevcut görünümü değiştirmez. Getter ve callback kopya döndürür. `validateColumnLayout(layout,columns)` DOM olmadan doğrular. Agent 1.1 datagrid tanımı da `columnLayout` kabul eder.

Görsel sıra, DOM/ekran okuyucu sırası ve CSV sırası aynıdır. Gizlenen sabit sütunlar ofset hesabından çıkarılır. Sabitleme tablo içindeki yatay kaydırma alanıyla sınırlıdır. Sütun düzeni ve seçim değişiklikleri uzaktaki veri sağlayıcısını yeniden çağırmaz. API kendiliğinden depolama yapmaz; örnekteki **Sütun düzenini sakla** eylemi yalnız düzeni localStorage'a yazar. Kişisel kayıtlar saklanmaz.

Yerel hücre düzenlemesi ve seçim klavye odağını korur. Asenkron veri yenilenirken kullanıcı başka bir kontrole geçtiyse odağı geri almaz. Dar ekranlarda geniş tablo kendi alanında yatay kayar.
