<script setup lang="ts">
import MuhitPage from "./MuhitPage.vue";
import MuhitIcon from "./MuhitIcon.vue";
import leaf from "muhit-ui/icons/leaf";
import {ref,shallowRef} from 'vue';
import {type DataColumn,type DataGridInstance,type ColumnLayout} from 'muhit-ui';
import MuhitGrid from './MuhitGrid.vue';
const columns:DataColumn[]=[{key:'name',label:'Name'}],alternate:DataColumn[]=[{key:'name',label:'Name updated'}];
const rows=[{id:'a',name:'Ada'},{id:'b',name:'Bea'}],selected=['a'],state={query:''};
const columnLayout:ColumnLayout[]=[{key:'name',width:240,pin:null}],messages={};
const provider=async()=>({rows,total:2});
const title=ref('Grid'),cols=shallowRef(columns),locale=ref('tr'),custom=ref(false),remote=ref(false),ready=ref('');
let current:DataGridInstance;
function onReady(g:DataGridInstance){current=g;ready.value=JSON.stringify({selected:g.getSelected(),query:g.getState().query,layout:g.getColumnLayout()})}
function mutate(){current.setSelected(['b']);current.setState({query:'Bea'});current.setColumnLayout([{key:'name',width:400,pin:'start'}]);ready.value='changed'}
</script>
<template><MuhitPage title="Lifecycle matrix"><template #actions><MuhitIcon :icon="leaf" label="Shared space" /></template>
<button @click="mutate">Mutate internal state</button>
<button @click="title+='!'">Change title</button>
<button @click="cols=alternate">Change columns</button>
<button @click="custom=true">Change messages</button>
<button @click="remote=true">Change provider</button>
<button @click="locale='en'">Change locale</button>
<output data-testid="matrix-ready">{{ready}}</output>
<MuhitGrid :title="title" :columns="cols" :rows="remote?undefined:rows" :load="remote?provider:undefined" :locale="locale" :messages="custom?messages:undefined" selectable :selected="selected" :state="state" :column-layout="columnLayout" :on-ready="onReady" />
</MuhitPage></template>
