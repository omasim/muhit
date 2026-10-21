/** Reference transport. Supply an application-owned same-origin URL. */
export function createDocumentClient(url,fetcher=fetch){
 let revision=null,pending=null;
 async function read(signal){const response=await fetcher(url,{signal});if(!response.ok)throw Error('Read failed');const value=await response.json();revision=response.headers.get('etag');if(!revision||!value.document)throw Error('Invalid response');return value.document;}
 async function save(document,signal){if(!revision)throw Error('Read before saving');const body=JSON.stringify(document),fingerprint=revision+'\n'+body;if(!pending||pending.fingerprint!==fingerprint)pending={fingerprint,key:crypto.randomUUID()};const response=await fetcher(url,{method:'PUT',signal,headers:{'Content-Type':'application/json','If-Match':revision,'Idempotency-Key':pending.key},body});if(response.status===409||response.status===412){const error=new Error('Version conflict; draft preserved');error.code='CONFLICT';throw error;}if(!response.ok)throw Error('Save failed');const result=await response.json();if(result.persisted!==true||!response.headers.get('etag'))throw Error('Unconfirmed result');revision=response.headers.get('etag');pending=null;return{persisted:true};}
 return{read,save,getRevision:()=>revision};
}
