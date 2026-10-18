import {MuhitPage} from './MuhitPage';
import {MuhitIcon} from './MuhitIcon';
import leaf from 'muhit-ui/icons/leaf';
import {useRef,useState} from 'react';
import {type DataColumn,type DataGridInstance,type ColumnLayout} from 'muhit-ui';
import {MuhitGrid} from './MuhitGrid';
const columns:DataColumn[]=[{key:'name',label:'Name'}];
const alternate:DataColumn[]=[{key:'name',label:'Name updated'}];
const rows=[{id:'a',name:'Ada'},{id:'b',name:'Bea'}];
const selected=['a'],state={query:''};
const columnLayout:ColumnLayout[]=[{key:'name',width:240,pin:null}];
const provider=async()=>({rows,total:2});
const messages={};
export function Lifecycle(){
 const [title,setTitle]=useState('Grid'),[cols,setCols]=useState(columns),[locale,setLocale]=useState('tr'),[custom,setCustom]=useState(false),[remote,setRemote]=useState(false),[ready,setReady]=useState('');
 const current=useRef<DataGridInstance|null>(null);
 return <MuhitPage title="Lifecycle matrix" actions={<MuhitIcon icon={leaf} label="Shared space" />}>
 <button onClick={()=>{const g=current.current!;g.setSelected(['b']);g.setState({query:'Bea'});g.setColumnLayout([{key:'name',width:400,pin:'start'}]);setReady('changed')}}>Mutate internal state</button>
 <button onClick={()=>setTitle(v=>v+'!')}>Change title</button>
 <button onClick={()=>setCols(alternate)}>Change columns</button>
 <button onClick={()=>setCustom(true)}>Change messages</button>
 <button onClick={()=>setRemote(true)}>Change provider</button>
 <button onClick={()=>setLocale('en')}>Change locale</button>
 <output data-testid="matrix-ready">{ready}</output>
 <MuhitGrid title={title} columns={cols} rows={remote?undefined:rows} load={remote?provider:undefined} locale={locale} messages={custom?messages:undefined} selectable selected={selected} state={state} columnLayout={columnLayout} onReady={g=>{current.current=g;setReady(JSON.stringify({selected:g.getSelected(),query:g.getState().query,layout:g.getColumnLayout()}))}} />
 </MuhitPage>;
}
