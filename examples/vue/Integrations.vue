<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import {
  MuhitWidgets,
  MuhitPreferences,
  MuhitTheme,
  type WidgetInstance,
  type FormField,
  type FormInstance,
  type FormValues,
} from "muhit-ui";
import MuhitForm from "./MuhitForm.vue";
const fields: FormField[] = [{ name: "name", label: "Adınız", required: true }],
  values = ref({ name: "Ada" }),
  saved = ref(""),
  visible = ref(true),
  host = ref<HTMLDivElement | null>(null);
const baseline=ref({name:"Ada"});
const locale=ref("tr"),dirty=ref(false);
let currentForm:FormInstance|undefined;
let widget: WidgetInstance | undefined, unsubscribe: (() => void) | undefined;
onMounted(() => {
  const preferences = MuhitPreferences.create({ key: "muhit-vue-example" });
  MuhitTheme.apply(preferences.load().config);
  unsubscribe = preferences.subscribe((r) => MuhitTheme.apply(r.config));
  if (host.value)
    widget = MuhitWidgets.mount(host.value, {
      type: "tabs",
      id: "integration-tabs",
      title: "Çalışma alanı",
      items: [
        { id: "one", label: "Özet", content: "Birlikte üretmek." },
        { id: "two", label: "Ayrıntı", content: "İnsan ve doğa uyumu." },
      ],
    });
});
onBeforeUnmount(() => {
  unsubscribe?.();
  widget?.destroy();
});
async function submit(values: FormValues, signal: AbortSignal) {
  await Promise.resolve();
  if (!signal.aborted) saved.value = String(values.name);
}
</script>
<template>
  <section class="mh-panel mh-stack">
    <h2>Form ve widget entegrasyonu</h2>
    <button @click="values = { name: 'Deniz' }">Profili güncelle</button
    ><button @click="visible = !visible">
      {{ visible ? "Formu kaldır" : "Formu aç" }}</button
    >
    <button @click="locale=locale==='tr'?'en':'tr'">Form dilini değiştir</button>
    <button @click="dirty=currentForm?.isDirty() ?? false">Değişiklik durumunu kontrol et</button>
    <button @click="baseline={name:'New baseline'}">Başlangıç değerini değiştir</button>
    <output data-testid="dirty">{{String(dirty)}}</output>
    <MuhitForm
      v-if="visible"
      :locale="locale"
      :title="locale==='tr'?'Bilgiler':'Details'"
      :on-ready="instance=>{currentForm=instance}"
      :baseline="baseline"
      :fields="fields"
      :values="values"
      :on-submit="submit"
    />
    <p role="status">Örnek kayıt: {{ saved }}</p>
    <div ref="host" />
  </section>
</template>
