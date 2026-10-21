import type {ModuleOptions} from './resources.js';
import type {PageInstance,PageRecipe} from './index.js';
export function mountShell(host:HTMLElement,spec:{title:string;description?:string;recipe:PageRecipe;navigation:Array<{id:string;label:string;href:string}>;current?:string},options?:ModuleOptions):{element:HTMLElement;toolbar:HTMLElement;page:PageInstance;regions:Readonly<Record<string,HTMLElement>>;setState:PageInstance['setState'];destroy():void};
