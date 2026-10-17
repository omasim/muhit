import { useEffect, useRef, useState } from "react";
import {
  MuhitPreferences,
  MuhitTheme,
  MuhitWidgets,
  type FormField,
} from "muhit-ui";
import { MuhitForm } from "./MuhitForm";
const fields: FormField[] = [{ name: "name", label: "Adınız", required: true }];
export function Integrations() {
  const [values, setValues] = useState({ name: "Ada" }),
    [saved, setSaved] = useState(""),
    [visible, setVisible] = useState(true);
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
      {visible ? (
        <MuhitForm
          fields={fields}
          values={values}
          onSubmit={async (values, signal) => {
            await Promise.resolve();
            if (!signal.aborted) setSaved(String(values.name));
          }}
        />
      ) : null}
      <p role="status">Örnek kayıt: {saved}</p>
      <div ref={host} />
    </section>
  );
}
