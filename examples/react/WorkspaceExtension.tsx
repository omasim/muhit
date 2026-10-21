import {useEffect,useRef,useState} from 'react';
import {mountResources,type Controller} from 'muhit-ui/resources';
import {mountCalendar,mountDocumentEditor,type CalendarDraft,type DocumentSnapshot} from 'muhit-ui/planning';
import 'muhit-ui/styles/planning.css';
import 'muhit-ui/styles/content.css';
import 'muhit-ui/styles/suite.css';
const data=[{id:'research',title:'Workspace resource',owner:'Ece',type:'Research',updatedAt:'2026-10-22T10:00:00.000Z'}];
function Resources(){const host=useRef<HTMLDivElement>(null);const api=useRef<Controller|null>(null);useEffect(()=>{if(!host.current)return;api.current=mountResources(host.current,data,{locale:'en'});return()=>{api.current?.destroy();api.current=null;};},[]);return <section data-testid="workspace-extension"><button onClick={()=>api.current?.update([...data,{...data[0],id:'second',title:'Second resource'}])}>Update workspace resources</button><div ref={host}/></section>;}
function Planning({saved}:{saved:{calendar?:CalendarDraft;editor?:DocumentSnapshot}}){const calendar=useRef<HTMLDivElement>(null),editor=useRef<HTMLDivElement>(null);useEffect(()=>{const c=mountCalendar(calendar.current!,[],{locale:'en',date:'2026-10-22',draft:saved.calendar});const e=mountDocumentEditor(editor.current!,{title:'Project notes',blocks:[]},{locale:'en',snapshot:saved.editor});return()=>{saved.calendar=c.getDraft();saved.editor=e.getSnapshot();c.destroy();e.destroy();};},[saved]);return <section data-testid="planning-extension"><div ref={calendar}/><div ref={editor}/></section>;}
export function WorkspaceExtension(){const [open,setOpen]=useState(false);const saved=useRef<{calendar?:CalendarDraft;editor?:DocumentSnapshot}>({});return <><button onClick={()=>setOpen(v=>!v)}>{open?'Close workspace extension':'Open workspace extension'}</button>{open&&<><Resources/><Planning saved={saved.current}/></>}</>;}
