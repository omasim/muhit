<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import {
  MuhitDataGrid,
  type DataGridOptions,
  type DataGridInstance,
} from "muhit-ui";
import "muhit-ui/styles";
const props = defineProps<
  DataGridOptions & {
    selected?: string[];
    onReady?: (grid: DataGridInstance) => void;
  }
>();
const host = ref<HTMLElement | null>(null);
let grid: DataGridInstance | undefined;
function mount() {
  if (!host.value) return;
  const view = grid?.getView();
  grid?.destroy();
  grid = MuhitDataGrid.mount(host.value, {
    ...props,
    onStateChange: (s) => props.onStateChange?.(s),
    onRowsChange: (r, c) => props.onRowsChange?.(r, c),
    onSelectionChange: (ids) => props.onSelectionChange?.(ids),
    onColumnLayoutChange: (v) => props.onColumnLayoutChange?.(v),
  });
  if (view) grid.restoreView(view);
  if (props.state) grid.setState(props.state);
  if (props.columnLayout) grid.setColumnLayout(props.columnLayout);
  if (props.selected) grid.setSelected(props.selected);
  props.onReady?.(grid);
}
onMounted(mount);
watch(
  () => [
    props.columns,
    props.load,
    props.exportRows,
    props.locale,
    props.dir,
    props.messages,
    props.selectable,
    props.title,
    props.description,
  ],
  mount,
);
watch(
  () => props.rows,
  (r) => {
    if (r && !props.load) grid?.setRows(r);
  },
  { deep: true },
);
watch(
  () => props.state,
  (v) => {
    if (v) grid?.setState(v);
  },
  { deep: true },
);
watch(
  () => props.columnLayout,
  (v) => {
    if (v) grid?.setColumnLayout(v);
  },
  { deep: true },
);
watch(
  () => props.selected,
  (v) => {
    if (v) grid?.setSelected(v);
  },
  { deep: true },
);
onBeforeUnmount(() => grid?.destroy());
</script>
<template><div ref="host" /></template>
