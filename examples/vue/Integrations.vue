<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import {
  MuhitWidgets,
  MuhitPreferences,
  MuhitTheme,
  type WidgetInstance,
  type FormField,
  type FormValues,
} from "muhit-ui";
import MuhitForm from "./MuhitForm.vue";
const fields: FormField[] = [{ name: "name", label: "Adınız", required: true }],
  values = ref({ name: "Ada" }),
  saved = ref(""),
  visible = ref(true),
  host = ref<HTMLDivElement | null>(null);
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
    ><MuhitForm
      v-if="visible"
      :fields="fields"
      :values="values"
      :on-submit="submit"
    />
    <p role="status">Örnek kayıt: {{ saved }}</p>
    <div ref="host" />
  </section>
</template>
