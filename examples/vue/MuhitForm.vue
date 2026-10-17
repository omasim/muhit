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
function mount() {
  if (!host.value) return;
  let values = form?.getValues() || props.values;
  try {
    Forms.normalizeValues(props.fields, values);
  } catch {
    values = props.values;
  }
  form?.destroy();
  form = Forms.mount(host.value, {
    ...props,
    values,
    onChange: (v, s) => props.onChange?.(v, s),
    onSubmit: props.onSubmit ? (v, s) => props.onSubmit?.(v, s) : undefined,
    validate: props.validate ? (v) => props.validate?.(v) || {} : undefined,
    validateAsync: props.validateAsync
      ? (v, s) => props.validateAsync?.(v, s) || Promise.resolve({})
      : undefined,
  });
  props.onReady?.(form);
}
onMounted(mount);
watch(
  () => [
    props.fields,
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
