<script setup lang="ts">
import {ref,watch,nextTick,onBeforeUnmount} from 'vue';
import {mountResources,type Controller} from 'muhit-ui/resources';
import {mountCalendar,mountDocumentEditor,type CalendarDraft,type DocumentSnapshot} from 'muhit-ui/planning';
import 'muhit-ui/styles/planning.css';
import 'muhit-ui/styles/content.css';import 'muhit-ui/styles/suite.css';
const open=ref(false),host=ref<HTMLDivElement|null>(null);let api:Controller|null=null;
const data=[{id:'research',title:'Workspace resource',owner:'Ece',type:'Research',updatedAt:'2026-10-22T10:00:00.000Z'}];
const calendar=ref<HTMLDivElement|null>(null),editor=ref<HTMLDivElement|null>(null);let c:ReturnType<typeof mountCalendar>|null=null,e:ReturnType<typeof mountDocumentEditor>|null=null,savedCalendar:CalendarDraft|undefined,savedEditor:DocumentSnapshot|undefined;function cleanup(){if(c){savedCalendar=c.getDraft();c.destroy();c=null;}if(e){savedEditor=e.getSnapshot();e.destroy();e=null;}}
watch(open,async value=>{api?.destroy();api=null;cleanup();if(value){await nextTick();if(open.value&&host.value){api=mountResources(host.value,data,{locale:'en'});c=mountCalendar(calendar.value!,[],{locale:'en',date:'2026-10-22',draft:savedCalendar});e=mountDocumentEditor(editor.value!,{title:'Project notes',blocks:[]},{locale:'en',snapshot:savedEditor});}}});
onBeforeUnmount(()=>{api?.destroy();api=null;cleanup();});
function update(){api?.update([...data,{...data[0],id:'second',title:'Second resource'}]);}
</script>
<template><button @click="open=!open">{{open?'Close workspace extension':'Open workspace extension'}}</button><section v-if="open" data-testid="workspace-extension"><button @click="update">Update workspace resources</button><div ref="host"/><section data-testid="planning-extension"><div ref="calendar"/><div ref="editor"/></section></section></template>
