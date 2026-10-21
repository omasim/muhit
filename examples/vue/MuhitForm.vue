<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import {
  MuhitForm as Forms,
  type FormOptions,
  type FormInstance,
} from "muhit-ui";
const props = defineProps<
  FormOptions & { onReady?: (form: FormInstance) => void }
>();
const host = ref<HTMLElement | null>(null);
let form: FormInstance | undefined;
let previousBaseline = props.baseline;
function mount() {
  if (!host.value) return;
  const snapshot = form?.getSnapshot();
  let values = snapshot?.values || props.values;
  let baseline = previousBaseline !== props.baseline
    ? props.baseline : snapshot?.baseline ?? props.baseline;
  try {
    Forms.normalizeValues(props.fields, values);
    if (baseline) Forms.normalizeValues(props.fields, baseline);
  } catch {
    values = props.values;
    baseline = props.baseline;
  }
  form?.destroy();
  form = Forms.mount(host.value, {
    ...props,
    values,
    baseline,
    onChange: (v, s) => props.onChange?.(v, s),
    onSubmit: props.onSubmit ? (v, s) => props.onSubmit?.(v, s) : undefined,
    validate: props.validate ? (v) => props.validate?.(v) || {} : undefined,
    validateAsync: props.validateAsync
      ? (v, s) => props.validateAsync?.(v, s) || Promise.resolve({})
      : undefined,
  });
  previousBaseline = props.baseline;
  props.onReady?.(form);
}
onMounted(mount);
watch(
  () => [
    props.fields,
    props.baseline,
    props.locale,
    props.dir,
    props.messages,
    props.title,
    props.submitLabel,
    props.validationDelay,
    !!props.onSubmit,
    !!props.validate,
    !!props.validateAsync,
  ],
  mount,
);
watch(
  () => props.values,
  (v) => {
    if (v) form?.setValues(v);
  },
  { deep: true },
);
onBeforeUnmount(() => form?.destroy());
</script>
<template><div ref="host" /></template>
