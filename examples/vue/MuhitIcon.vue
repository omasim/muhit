<script setup lang="ts">
import {ref,onMounted,onBeforeUnmount,watch} from 'vue';
import type {IconOptions} from 'muhit-ui/icons';
const props=defineProps<IconOptions & {icon:{mount(host:Element,options?:IconOptions):{destroy():void}}}>();
const host=ref<HTMLElement|null>(null);let current:{destroy():void}|undefined;
function mount(){if(!host.value)return;current?.destroy();current=props.icon.mount(host.value,{size:props.size,stroke:props.stroke,label:props.label,dir:props.dir})}
onMounted(mount);watch(()=>[props.icon,props.size,props.stroke,props.label,props.dir],mount);onBeforeUnmount(()=>current?.destroy());
</script>
<template><span ref="host" class="mh-icon-host" /></template>
