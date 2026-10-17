<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import {
  MuhitForm as Forms,
  type FormField,
  type FormValues,
  type FormInstance,
} from "muhit-ui";
const props = defineProps<{
  fields: FormField[];
  values: FormValues;
  onSubmit: (
    values: FormValues,
    signal: AbortSignal,
  ) => Promise<void | { errors?: Record<string, string> }>;
}>();
const host = ref<HTMLDivElement | null>(null);
let form: FormInstance | undefined;
function mount() {
  if (!host.value) return;
  form?.destroy();
  form = Forms.mount(host.value, {
    title: "Profil",
    fields: props.fields,
    values: props.values,
    onSubmit: (v, s) => props.onSubmit(v, s),
  });
}
onMounted(mount);
watch(() => props.fields, mount, { deep: true });
watch(
  () => props.values,
  (v) => form?.setValues(v),
  { deep: true },
);
onBeforeUnmount(() => form?.destroy());
</script>
<template><div ref="host" /></template>
