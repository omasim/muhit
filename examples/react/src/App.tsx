import { Integrations } from "../Integrations";
import { useState } from "react";
import { MuhitTheme, type DataColumn, type DataRow } from "muhit-ui";
import { MuhitGrid } from "../MuhitGrid";
const selected = ["a"];
const baseColumns: DataColumn[] = [
  { key: "name", label: "Kaynak" },
  { key: "count", label: "Adet", type: "number" },
];
const datedColumns: DataColumn[] = [
  ...baseColumns,
  { key: "date", label: "Tarih", type: "date" },
];
const initialRows: DataRow[] = [
  { id: "a", name: "Araştırma notu", count: 12, date: "2026-10-17" },
  { id: "b", name: "Görüşme", count: 2, date: null },
];
export default function App() {
  const [title,setTitle]=useState("Resources");
  const [ready,setReady]=useState("");
  const [rows, setRows] = useState(initialRows),
    [visible, setVisible] = useState(true),
    [dated, setDated] = useState(false),
    [dark, setDark] = useState(false);
  return (
    <main className="mh-scope demo-app mh-content" id="main" tabIndex={-1} data-page-recipe="collection" data-width="standard">
      <a className="mh-skip" href="#main">İçeriğe geç</a><p>React · Muhit entegrasyonu · Örnek veri</p>
      <h1>Ortak kaynaklar</h1>
      <div className="demo-actions">
        <button onClick={()=>setTitle(v=>v+"!")}>Tablo başlığını değiştir</button>
        <output data-testid="ready-selection">{ready}</output>
        <button
          onClick={() =>
            setRows((current) =>
              current.map((r) => (r.id === "a" ? { ...r, count: 24 } : r)),
            )
          }
        >
          Veriyi güncelle
        </button>
        <button
          onClick={() =>
            setRows((current) =>
              current.some((r) => r.id === "c")
                ? current
                : [
                    ...current,
                    {
                      id: "c",
                      name: "<img src=x onerror=alert(1)>",
                      count: 3,
                      date: "2026-10-17",
                    },
                  ],
            )
          }
        >
          Metin kaydı ekle
        </button>
        <button onClick={() => setDated((v) => !v)}>Sütunları değiştir</button>
        <button onClick={() => setVisible((v) => !v)}>
          {visible ? "Tabloyu kaldır" : "Tabloyu aç"}
        </button>
        <button
          onClick={() => {
            const next = !dark;
            setDark(next);
            MuhitTheme.apply({ mode: next ? "dark" : "light" });
          }}
        >
          Temayı değiştir
        </button>
      </div>
      {visible ? (
        <MuhitGrid title={title} selectable selected={selected} onReady={g=>setReady(g.getSelected().join(","))} columns={dated ? datedColumns : baseColumns} rows={rows} />
      ) : (
        <p role="status">Tablo kaldırıldı.</p>
      )}
      <Integrations />
    </main>
  );
}
