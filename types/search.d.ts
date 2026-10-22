export interface Page<T> {items:T[];total:number;page:number;pageSize:number;}
export interface PageOptions {page?:number;pageSize?:number;}
export function createSearchIndex<T extends {id:string}>(rows:T[],options?:{fields?:Array<keyof T & string>;locale?:string;maxRows?:number}):{readonly size:number;search(query:string,options?:PageOptions):Page<T>};
export function createRemoteSearch<T>(loader:(request:{query:string;page:number;pageSize:number},signal:AbortSignal)=>Promise<Page<T>>):{search(query:string,options?:PageOptions):Promise<Page<T>|null>;cancel():void;destroy():void;};

/** Do not mutate rows until resolution. Cancelling rejects without a partial index. */
export function createSearchIndexAsync<T extends {id:string}>(rows:T[],options?:{fields?:Array<keyof T & string>;locale?:string;maxRows?:number;signal?:AbortSignal;sliceMs?:number}):Promise<ReturnType<typeof createSearchIndex<T>>>;
