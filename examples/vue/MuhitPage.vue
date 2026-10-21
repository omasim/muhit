<script setup lang="ts">
import {useId} from 'vue';
import 'muhit-ui/styles/pages.css';
withDefaults(defineProps<{title:string;description?:string;width?:'reading'|'standard'|'wide'|'fluid';skipLabel?:string;navigationLabel?:string}>(),{width:'standard',skipLabel:'Skip to content',navigationLabel:'Navigation'});
const id=useId();
</script>
<template><div class="mh-scope"><a class="mh-skip" :href="'#'+id">{{skipLabel}}</a><div :class="'mh-shell'+($slots.navigation?'':' mh-shell--plain')">
<aside v-if="$slots.navigation" class="mh-shell__nav"><nav :aria-label="navigationLabel"><slot name="navigation" /></nav></aside>
<div class="mh-shell__body"><main :id="id" tabindex="-1" class="mh-content" :data-width="width">
<header class="mh-content__header"><div><h1>{{title}}</h1><p v-if="description">{{description}}</p></div><slot name="actions" /></header>
<div class="mh-region-grid"><section :class="'mh-region mh-region--'+($slots.aside?'main':'full')"><slot /></section><aside v-if="$slots.aside" class="mh-region mh-region--rail"><slot name="aside" /></aside></div>
</main></div></div></div></template>
