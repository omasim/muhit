<script setup lang="ts">
import Integrations from "../Integrations.vue";
import { ref, computed } from "vue";
import { MuhitTheme, type DataColumn, type DataRow } from "muhit-ui";
import MuhitGrid from "../MuhitGrid.vue";
const baseColumns: DataColumn[] = [
  { key: "name", label: "Kaynak" },
  { key: "count", label: "Adet", type: "number" },
];
const rows = ref<DataRow[]>([
  { id: "a", name: "Araştırma notu", count: 12, date: "2026-10-17" },
  { id: "b", name: "Görüşme", count: 2, date: null },
]);
const visible = ref(true),
  dated = ref(false),
  dark = ref(false);
const columns = computed(() =>
  dated.value
    ? [...baseColumns, { key: "date", label: "Tarih", type: "date" as const }]
    : baseColumns,
);
function update() {
  rows.value[0].count = 24;
}
function add() {
  if (!rows.value.some((r) => r.id === "c"))
    rows.value.push({
      id: "c",
      name: "<img src=x onerror=alert(1)>",
      count: 3,
      date: "2026-10-17",
    });
}
function theme() {
  dark.value = !dark.value;
  MuhitTheme.apply({ mode: dark.value ? "dark" : "light" });
}
</script>
<template>
  <main class="mh-scope demo-app">
    <p>Vue · Muhit entegrasyonu · Örnek veri</p>
    <h1>Ortak kaynaklar</h1>
    <div class="demo-actions">
      <button @click="update">Veriyi güncelle</button
      ><button @click="add">Metin kaydı ekle</button
      ><button @click="dated = !dated">Sütunları değiştir</button
      ><button @click="visible = !visible">
        {{ visible ? "Tabloyu kaldır" : "Tabloyu aç" }}</button
      ><button @click="theme">Temayı değiştir</button>
    </div>
    <MuhitGrid v-if="visible" :columns="columns" :rows="rows" />
    <p v-else role="status">Tablo kaldırıldı.</p>
    <Integrations />
  </main>
</template>
