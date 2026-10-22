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

import {localDateTimeToUTC,createRecurringEvents,formatTextRange,importDocument,exportDocument} from 'muhit-ui/planning';
import {createSearchIndex,createRemoteSearch} from 'muhit-ui/search';
const instant:string=localDateTimeToUTC('2026-10-22T12:00','Europe/Istanbul');
const recurring=createRecurringEvents({id:'meeting',title:'Review',start:instant,end:'2026-10-22T10:00:00.000Z'},{frequency:'weekly',count:3,timeZone:'Europe/Istanbul'});
const rich=formatTextRange({id:'body',type:'paragraph',text:'Test'},0,4,{bold:true});
const roundtrip=importDocument(exportDocument({title:'Test',blocks:[rich]}));
const index=createSearchIndex([{id:'a',title:'Title'}],{fields:['title']});
const remote=createRemoteSearch(async request=>index.search(request.query,request));
void remote.search('Title');remote.cancel();remote.destroy();void recurring;void roundtrip;
// @ts-expect-error Unsupported recurrence must fail at compile time.
createRecurringEvents({id:'a',title:'A',start:instant,end:instant},{frequency:'hourly',count:1,timeZone:'UTC'});
// @ts-expect-error Query must be a string.
index.search(42);

import {createSearchIndexAsync} from 'muhit-ui/search';
void createSearchIndexAsync([{id:'a',title:'A'}],{signal:new AbortController().signal,sliceMs:8}).then(index=>index.search('A'));
