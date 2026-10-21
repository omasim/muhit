import { useEffect, useRef, useState } from "react";
import {
  MuhitPreferences,
  MuhitTheme,
  MuhitWidgets,
  type FormField,
  type FormInstance,
} from "muhit-ui";
import { MuhitForm } from "./MuhitForm";
const fields: FormField[] = [{ name: "name", label: "Adınız", required: true }];
export function Integrations() {
  const [values, setValues] = useState({ name: "Ada" }),
    [saved, setSaved] = useState(""),
    [visible, setVisible] = useState(true);
  const [slow,setSlow]=useState(false);
  const [baseline,setBaseline]=useState({name:"Ada"});
  const [locale,setLocale]=useState("tr");
  const currentForm=useRef<FormInstance|null>(null);
  const [dirty,setDirty]=useState(false);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    const preferences = MuhitPreferences.create({ key: "muhit-react-example" });
    MuhitTheme.apply(preferences.load().config);
    const unsubscribe = preferences.subscribe((r) =>
      MuhitTheme.apply(r.config),
    );
    const widget = MuhitWidgets.mount(host.current, {
      type: "tabs",
      id: "integration-tabs",
      title: "Çalışma alanı",
      items: [
        { id: "one", label: "Özet", content: "Birlikte üretmek." },
        { id: "two", label: "Ayrıntı", content: "İnsan ve doğa uyumu." },
      ],
    });
    return () => {
      unsubscribe();
      widget.destroy();
    };
  }, []);
  return (
    <section className="mh-panel mh-stack">
      <h2>Form ve widget entegrasyonu</h2>
      <button onClick={() => setValues({ name: "Deniz" })}>
        Profili güncelle
      </button>
      <button onClick={() => setVisible((v) => !v)}>
        {visible ? "Formu kaldır" : "Formu aç"}
      </button>
      <button onClick={()=>setLocale(v=>v==="tr"?"en":"tr")}>Form dilini değiştir</button>
      <button onClick={()=>setDirty(currentForm.current?.isDirty() ?? false)}>Değişiklik durumunu kontrol et</button>
      <button onClick={()=>setBaseline({name:"New baseline"})}>Başlangıç değerini değiştir</button>
      <button onClick={()=>setSlow(true)}>Gecikmeli kaydı aç</button>
      <output data-testid="dirty">{String(dirty)}</output>
      {visible ? (
        <MuhitForm
          messages={{"Kaydedildi.":locale==="tr"?"Yalnız örnek uygulamanın belleğinde onaylandı.":"Confirmed only in this example’s memory."}}
          locale={locale}
          title={locale==="tr"?"Bilgiler":"Details"}
          onReady={instance=>{currentForm.current=instance}}
          baseline={baseline}
          fields={fields}
          values={values}
          onSubmit={async (values, signal) => {
            await new Promise(resolve=>setTimeout(resolve,slow?500:0));
            if (!signal.aborted) setSaved(String(values.name));
          }}
        />
      ) : null}
      <p role="status">Örnek kayıt: {saved}</p>
      <div ref={host} />
    </section>
  );
}
