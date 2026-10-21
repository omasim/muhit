import type {ModuleOptions} from './resources.js';
export interface Instance { element: HTMLElement; destroy(): void; }
export interface Field {id:string;label:string;type:'text'|'email'|'password'|'textarea'|'multiselect'|'tags'|'date-range'|'time-zone';required?:boolean;options?:Array<{id:string;label:string}>;}
export type Values=Record<string,string|string[]>;
export function validateAdvancedFields(input:unknown):Field[];
export function mountAdvancedForm(host:HTMLElement,fields:Field[],options?:ModuleOptions & {values?:Values;timeZones?:string[];onSubmit?:(values:Values,signal:AbortSignal)=>Promise<{outcome:'success'|'partial';persisted:boolean;errors?:Record<string,string>}>}):Instance & {getValues():Values;setValues(values:Values):void;validate():{valid:boolean;errors:Record<string,string>;values:Values}};
export interface FilterView {query:string;type:string;}
export function mountSavedFilters(host:HTMLElement,options?:ModuleOptions & {types?:string[];onChange?:(view:FilterView)=>void}):Instance & {getView():FilterView;restoreView(view:FilterView):void;getSaved():Array<{name:string;view:FilterView}>;setSaved(views:Array<{name:string;view:FilterView}>):void};
export interface UploadItem {id:string;name:string;size:number;type:string;state:'queued'|'uploading'|'success'|'error'|'cancelled';progress:number;error:string;result:unknown;}
export interface UploadOptions {maxBytes?:number;accept?:string[];upload?:(file:File,context:{signal:AbortSignal;onProgress:(value:number)=>void})=>Promise<{persisted:boolean;[key:string]:unknown}>;onChange?:(items:UploadItem[])=>void;}
export interface UploadQueue {add(files:Iterable<File>|ArrayLike<File>):UploadItem[];start(id:string):Promise<void>;cancel(id:string):void;remove(id:string):void;getSnapshot():UploadItem[];getFile(id:string):File|undefined;destroy():void;}
export function createUploadQueue(options?:UploadOptions):UploadQueue;
export function mountUploads(host:HTMLElement,options?:ModuleOptions & UploadOptions):Instance & {queue:UploadQueue};
export interface Comment {id:string;author:string;body:string;parentId?:string|null;resolved?:boolean;}
export function mountDiscussion(host:HTMLElement,items?:Comment[],options?:ModuleOptions & {author?:string;onChange?:(items:Comment[])=>void}):Instance & {getSnapshot():{items:Comment[];draft:string;parentId:string|null};update(items:Comment[]):void};
export interface Member {id:string;name:string;role:'viewer'|'editor'|'admin';status:'active'|'invited'|'expired';}
export type AccessChange={kind:'role';id:string;role:string}|{kind:'invite';email:string};
export function mountAccess(host:HTMLElement,items:Member[],options?:ModuleOptions & {onCommit?:(change:AccessChange,signal:AbortSignal)=>Promise<{persisted:boolean}>}):Instance & {getSnapshot():Member[];update(items:Member[]):void};
export interface Proposal {before:string;after:string;}
export type StreamEvent={type:'text';text:string}|{type:'source';label:string;url:string}|{type:'tool';label:string}|({type:'proposal'} & Proposal);
export function mountAssistant(host:HTMLElement,options?:ModuleOptions & {run?:(prompt:string,signal:AbortSignal)=>AsyncIterable<StreamEvent>;apply?:(proposal:Proposal,signal:AbortSignal)=>Promise<{persisted:boolean}>}):Instance & {getSnapshot():{state:string;prompt:string;text:string;proposal:Proposal|null;history:Array<{prompt:string;text:string}>}};
export interface Metric {id:string;label:string;value:number|null;previous?:number|null;unit:string;source:string;updatedAt:string;}
export function mountAnalytics(host:HTMLElement,items:Metric[],options?:ModuleOptions & {periods?:string[];onOpen?:(metric:Metric)=>void;onPeriod?:(period:string)=>void}):Instance & {getView():{period:string;compare:boolean};update(items:Metric[]):void};
export function mountMultiCombobox(host:HTMLElement,items:Array<{id:string;label:string}>,options?:ModuleOptions & {label?:string;load?:(query:string,signal:AbortSignal)=>Promise<Array<{id:string;label:string}>>;onChange?:(items:Array<{id:string;label:string}>)=>void}):Instance & {getValue():Array<{id:string;label:string}>;setValue(items:Array<{id:string;label:string}>):void};

export function validateMetrics(input:unknown):Metric[];

export function validateComments(input:unknown):Comment[];
export function validateMembers(input:unknown):Member[];
