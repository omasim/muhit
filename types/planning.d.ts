import type {ModuleOptions,Notification,Controller as InboxController} from './inbox.js';
export interface Event {id:string;title:string;start:string;end:string;resource?:string;description?:string;}
export interface Instance {element:HTMLElement;destroy():void;}
export function validateEvents(input:unknown):Event[];
export function findConflicts(input:unknown,event:Event):Event[];
export function eventsOnDate(input:unknown,day:string,timeZone?:string):Event[];
export interface CalendarDraft {snapshotVersion:1;title:string;start:string;end:string;resource:string;editingId?:string;inputTimeZone?:string;baseEvent?:Event;}
export interface DraftOptions<T> {onDirtyChange?:(dirty:boolean)=>void;onDraftChange?:(draft:T)=>void;}
export function mountCalendar(host:HTMLElement,input:Event[],options?:ModuleOptions & DraftOptions<CalendarDraft> & {draft?:CalendarDraft;date?:string;inputTimeZone?:string;disambiguation?:'reject'|'earlier'|'later';resourceCapacities?:Record<string,number>;onMutation?:(mutation:{kind:'create'|'update'|'delete';id:string;event:Event},signal:AbortSignal)=>Promise<{persisted:boolean}>;onCommit?:(event:Event,signal:AbortSignal)=>Promise<{persisted:boolean}>;onChange?:(events:Event[])=>void}):Instance & {getSnapshot():{items:Event[];date:string;month:string;draft:CalendarDraft};getDraft():CalendarDraft;restoreDraft(draft:CalendarDraft):void;isDirty():boolean;update(input:Event[]):void};
export interface Block {id:string;type:'paragraph'|'heading'|'quote'|'list'|'image';text:string;bold?:boolean;italic?:boolean;marks?:TextMark[];url?:string;}
export interface Document {title:string;blocks:Block[];}
export interface Version {id:string;label:string;document:Document;}
export interface DocumentSnapshot {snapshotVersion:1;baseline:Document;undoHistory:Document[];counter:number;draft:Document;versions:Version[];canUndo:boolean;}
export function validateDocumentDraft(input:unknown):Document;
export function validateDocument(input:unknown):Document;
export function compareDocuments(before:Document,after:Document):{titleChanged:boolean;orderChanged:boolean;changes:Array<{id:string;kind:'added'|'removed'|'changed';before:Block|null;after:Block|null}>};
export function createDocument(input:Document):{getSnapshot():DocumentSnapshot;isDirty():boolean;markSaved(value?:Document):void;restoreSnapshot(snapshot:DocumentSnapshot):void;edit(next:Document):void;undo():boolean;checkpoint(label:string):Version;restore(id:string):void;destroy():void};
export function mountDocumentEditor(host:HTMLElement,input:Document,options?:ModuleOptions & DraftOptions<DocumentSnapshot> & {snapshot?:DocumentSnapshot;onSave?:(document:Document,signal:AbortSignal)=>Promise<{persisted:boolean}>}):Instance & {getSnapshot():DocumentSnapshot;getDraft():Document;restoreDraft(draft:Document):void;restoreSnapshot(snapshot:DocumentSnapshot):void;isDirty():boolean;};
export interface NotificationPreferences {delivery:'immediate'|'daily'|'off';mutedTypes:string[];}
export function validateNotificationPreferences(input:unknown):NotificationPreferences;
export function mountNotificationCenter(host:HTMLElement,input:Notification[],options?:ModuleOptions & {now?:()=>number;preferences?:NotificationPreferences;onChange?:(items:Notification[])=>void;onPreferences?:(preferences:NotificationPreferences,signal:AbortSignal)=>Promise<{persisted:boolean}>}):Instance & {inbox:InboxController;getSnapshot():ReturnType<InboxController['getSnapshot']> & {preferences:NotificationPreferences;draftPreferences:NotificationPreferences};update(input:Notification[]):void};

export interface TextMark {from:number;to:number;bold?:boolean;italic?:boolean;href?:string;}
export function formatLocalDateTime(value:string,timeZone?:string):string;
export function localDateTimeToUTC(value:string,timeZone?:string,disambiguation?:'reject'|'earlier'|'later'):string;
export function createRecurringEvents(event:Event,rule:{frequency:'daily'|'weekly';interval?:number;count:number;timeZone:string;exceptions?:string[];disambiguation?:'reject'|'earlier'|'later'}):Event[];
export function capacityAvailable(events:Event[],candidate:Event,capacity?:number):boolean;
export function safeDocumentURL(value:string):string;
export function validateMarks(marks:TextMark[],text:string):TextMark[];
export function formatTextRange(block:Block,from:number,to:number,style:Pick<TextMark,'bold'|'italic'|'href'>):Block;
export function replaceBlockText(block:Block,text:string):Block;
export function diffWords(before:string,after:string):Array<{kind:'equal'|'added'|'removed';text:string}>;
export function exportDocument(value:Document):string;
export function importDocument(value:string):Document;
