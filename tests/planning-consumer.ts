import {mountCalendar,mountDocumentEditor,createDocument,validateDocumentDraft,type CalendarDraft} from 'muhit-ui/planning';
declare const host:HTMLElement;
const draft:CalendarDraft={snapshotVersion:1,title:'',start:'',end:'',resource:''};
const calendar=mountCalendar(host,[],{draft,onDirtyChange:dirty=>console.log(dirty),onDraftChange:next=>console.log(next.snapshotVersion),onCommit:async(event,signal)=>{console.log(event.resource,signal.aborted);return{persisted:true};}});
calendar.restoreDraft(calendar.getDraft());calendar.isDirty();calendar.destroy();
const editor=mountDocumentEditor(host,{title:'',blocks:[]},{onSave:async(doc,signal)=>{console.log(signal.aborted);return{persisted:true};}});
editor.restoreSnapshot(editor.getSnapshot());editor.restoreDraft({title:'',blocks:[]});editor.isDirty();editor.destroy();
const model=createDocument(validateDocumentDraft({title:'',blocks:[]}));model.restoreSnapshot(model.getSnapshot());
// @ts-expect-error Snapshot version is fixed.
calendar.restoreDraft({...draft,snapshotVersion:2});
// @ts-expect-error Callback must confirm persistence explicitly.
mountDocumentEditor(host,{title:'T',blocks:[]},{onSave:async()=>({success:true})});
// @ts-expect-error Invalid event shape.
mountCalendar(host,[{id:'a',title:'A'}]);
