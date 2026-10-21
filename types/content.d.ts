export interface ContentOptions {
 title: string; description?: string; eyebrow?: string;
 variant?: 'editorial'|'resource'|'profile'|'project'|'metric'|'proposal';
 headingLevel?: 2|3|4|5|6;
 href?: string; image?: {src:string;alt:string}; meta?: string[];
 status?: {label:string;tone?:'neutral'|'success'|'warning'|'info'};
 progress?: number; progressLabel?: string;
 action?: {label:string;onClick:(event:MouseEvent)=>void};
}
export interface ContentInstance {readonly element:HTMLElement;update(options:ContentOptions):void;destroy():void;}
export function validateContent(options:ContentOptions):ContentOptions;
export function mountCard(host:HTMLElement,options:ContentOptions):ContentInstance;
export function mountRow(host:HTMLElement,options:ContentOptions):ContentInstance;
export function mountSection(host:HTMLElement,options:Pick<ContentOptions,'title'|'description'|'headingLevel'>):{element:HTMLElement;region:HTMLElement;setState(state:'content'|'loading'|'empty'|'error'|'partial',message?:string):void;destroy():void};
