import {createApp,createSSRApp} from 'vue';import App from './App.vue';import './style.css';
const root=document.getElementById('root')!;(root.hasChildNodes()?createSSRApp(App):createApp(App)).mount(root);
