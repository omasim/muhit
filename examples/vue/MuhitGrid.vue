<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref } from "vue";
import {
  MuhitDataGrid,
  type DataGridInstance,
  type DataColumn,
  type DataRow,
} from "muhit-ui";
import "muhit-ui/styles";
const props = defineProps<{ columns: DataColumn[]; rows: DataRow[] }>();
const host = ref<HTMLElement | null>(null);
let grid: DataGridInstance | undefined;
function mount() {
  if (!host.value) return;
  grid?.destroy();
  grid = MuhitDataGrid.mount(host.value, {
    columns: props.columns,
    rows: props.rows,
  });
}
onMounted(mount);
watch(() => props.columns, mount);
watch(
  () => props.rows,
  (rows) => grid?.setRows(rows),
  { deep: true },
);
onBeforeUnmount(() => grid?.destroy());
</script>
<template><div ref="host" /></template>
