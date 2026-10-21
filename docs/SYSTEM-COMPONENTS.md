# Ortak bileşen sözleşmesi

`schemas/component-contracts.json` kaynak envanteridir. Her kayıt: amaç, anatomi, public API, varyant, durum, davranış, veri sahipliği, responsive/RTL, yaşam döngüsü, erişilebilirlik ve kabul bilgisi taşır. `npm run check:system` mevcut 18 Agent türünün eksiksiz kapsandığını ve belgelerin varlığını denetler. Bu katalog yeni JSON render türü eklemez.

Native CSS primitive, Form/Widgets gibi render bileşeni ve sayfa örüntüsü ayrı katmanlardır. Tipografi ve layout native semantik HTML ile kurulur. Dosya seçimi yükleme; tarih input’u tam tarih aralığı takvimi; tooltip ise interaktif popover olarak sunulmaz.

## Ek etkileşim primitive’leri

```js
import {MuhitPrimitives} from 'muhit-ui/primitives';
import 'muhit-ui/styles/system.css';
const menu = MuhitPrimitives.menu(buttonElement, menuElement);
// Native button trigger; menu içindeki düğmeler role="menuitem" taşır.
menu.open(); menu.close(true); menu.destroy();
const help = MuhitPrimitives.tooltip(buttonElement, 'Açıklama');
const popover = MuhitPrimitives.popover(buttonElement, panelElement);
```

Menu oklar/Home/End ile gezinir; Escape odağı tetikleyiciye döndürür. Dış tıklama ve odak çıkışı kapatır. Popover nonmodal içeriktir; odak tuzağı kurmaz. İçerik başlığını, gerekli initial focus’u ve uygun native kontrolleri uygulama sağlar. Modal görev için mevcut `Muhit.openDialog` kullanılır. Tooltip focus/hover ile açılır, hover edilebilir, Escape ile kapanır; mevcut aria-describedby korunur. destroy dinleyicileri temizler, tetikleyici özniteliklerini geri yükler. Aynı DOM’a yeniden bağlamadan önce önceki instance destroy edilmelidir.

```js
const tree = MuhitPrimitives.tree(host,[
 {id:'research',label:'Araştırma',children:[{id:'notes',label:'Notlar'}]}
], {label:'Çalışma ağacı',onSelect:id=>console.log(id)});
const view = tree.getView();
tree.restoreView(view);
tree.destroy();
```

Tree tek seçimlidir; roving focus, RTL okları, Home/End, Enter/Space, expansion/selection snapshot destekler. En fazla 500 düğüm ve 20 iç içe düzey; lazy loading ve çoklu seçim bu sözleşmenin parçası değildir. `select` görünür seçimi değiştirir; `restoreView` olay üretmez.

## Form/Flow ilişkisi

Mevcut Form/Repeater callback sözleşmesi korunur. Yeni `MuhitFlow` daha üst seviyedeki uygulama/örüntü işlem durumudur. UI Form ile bağlantıda AbortSignal → flow.cancel aktarılmalı; field errors ayrıca Form’a eşlenmelidir. Referans yönetim uygulaması bu köprüyü uygular. Her Form’un içini yeniden kurmak gerekmez.
